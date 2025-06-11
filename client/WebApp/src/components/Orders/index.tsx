import { useCallback, useEffect, useMemo, useState } from "react";
import type { Order } from "../../types/Order";
import formatNumberAsMoney from "../../utils/formatNumberAsMoney";
import AppDatePicker from "../AppDatePicker";
import NewOrderModal from "../NewOrderModal";
import useOrders from "../../hooks/useOrders";
import moment from "moment";
import FAB from "../FAB";
import useApplicationState from "../../hooks/useApplicationState";
import {
    Box,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

export default function Orders() {
    const { setIsLoading } = useApplicationState();
    const { getAllByDate, create: createOrder } = useOrders();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = useCallback(
        async (date: Date) => {
            setIsLoading(true);
            const orders = await getAllByDate(date);
            setOrders(orders);
            setIsLoading(false);
        },
        [getAllByDate, setIsLoading],
    );

    useEffect(() => {
        let fetch = true;
        if (fetch) fetchOrders(selectedDate);
        return () => {
            fetch = false;
        };
    }, [fetchOrders, selectedDate]);

    const rows = useMemo(() => {
        return (
            orders?.map((order) => ({
                id: order.id,
                time: moment(order.date).format("HH:mm"),
                description: order.items.map((item) => `${item.name} x${item.quantity}`).join(", "),
                paymentMethod: order.paymentMethod || "N/A",
                totalCost: order.items.reduce((total, item) => total + item.cost * item.quantity, 0),
                totalCharge: order.items.reduce(
                    (total, item) => total + (!item.charge ? 0 : item.charge * item.quantity),
                    0,
                ),
            })) ?? []
        );
    }, [orders]);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        fetchOrders(date);
    };

    const handleSubmitOrder = async (order: Order) => {
        setOpenModal(false);
        setIsLoading(true);
        await createOrder(order);
        await fetchOrders(selectedDate);
    };

    return (
        <>
            <Container>
                <NewOrderModal open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSubmitOrder} />
                <br />
                <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                    <AppDatePicker
                        sx={{ m: 0, p: 0 }}
                        value={selectedDate}
                        onChange={(d) => handleDateChange(d ?? new Date())}
                    />
                    <Box>
                        <br />
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="bold">
                                            Hora
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="bold">
                                            Descripción
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="bold">
                                            Metodo de Pago
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="bold">
                                            Costo
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="bold">
                                            Cargo
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                            No hay ordenes registradas
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.time}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>{row.paymentMethod}</TableCell>
                                            <TableCell>{formatNumberAsMoney(row.totalCost)}</TableCell>
                                            <TableCell>
                                                {!row.totalCharge ? "Sin cargo" : formatNumberAsMoney(row.totalCharge)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>

                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Typography variant="body1" fontWeight="bold">
                                            Total
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="lg">
                                            {formatNumberAsMoney(rows.reduce((total, row) => total + row.totalCost, 0))}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="lg">
                                            {formatNumberAsMoney(
                                                rows.reduce((total, row) => total + row.totalCharge, 0),
                                            )}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
            <FAB onClick={() => setOpenModal(true)} />
        </>
    );
}
