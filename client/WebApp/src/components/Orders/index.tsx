import { Box, Sheet, Table, Typography } from "@mui/joy";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Order } from "../../types/Order";
import formatNumberAsMoney from "../../utils/formatNumberAsMoney";
import AppDatePicker from "../AppDatePicker";
import NewOrderModal from "../NewOrderModal";
import useOrders from "../../hooks/useOrders";
import moment from "moment";
import FAB from "../FAB";
import useApplicationState from "../../hooks/useApplicationState";

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
        [getAllByDate, setIsLoading]
    );

    useEffect(() => {
        let fetch = true;
        if (fetch) fetchOrders(selectedDate);
        return () => {
            fetch = false;
        };
    }, [fetchOrders, selectedDate]);

    const rows = useMemo(() => {
        return orders.map((order) => ({
            id: order.id,
            time: moment(order.date).format("HH:mm"),
            description: order.items.map((item) => `${item.name} x${item.quantity}`).join(", "),
            paymentMethod: order.paymentMethod || "N/A",
            totalCost: order.items.reduce((total, item) => total + item.cost * item.quantity, 0),
            totalCharge: order.items.reduce(
                (total, item) => total + (!item.charge ? 0 : item.charge * item.quantity),
                0
            ),
        }));
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
            <Box>
                <NewOrderModal open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSubmitOrder} />
                <Typography level="h4" fontWeight="xl" gutterBottom>
                    Ordenes de venta
                </Typography>
                <br />
                <Sheet variant="outlined" sx={{ p: 2 }}>
                    <AppDatePicker
                        sx={{ m: 0, p: 0 }}
                        value={selectedDate}
                        onChange={(d) => handleDateChange(d ?? new Date())}
                    />
                    <Box>
                        <br />
                    </Box>
                    <Table variant="outlined">
                        <thead>
                            <tr>
                                <th>
                                    <Typography level="body-md" fontWeight="md">
                                        Hora
                                    </Typography>
                                </th>
                                <th>
                                    <Typography level="body-md" fontWeight="md">
                                        Descripción
                                    </Typography>
                                </th>
                                <th>
                                    <Typography level="body-md" fontWeight="md">
                                        Metodo de Pago
                                    </Typography>
                                </th>
                                <th>
                                    <Typography level="body-md" fontWeight="md">
                                        Costo
                                    </Typography>
                                </th>
                                <th>
                                    <Typography level="body-md" fontWeight="md">
                                        Cargo
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                                        No hay ordenes registradas
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.time}</td>
                                        <td>{row.description}</td>
                                        <td>{row.paymentMethod}</td>
                                        <td>{formatNumberAsMoney(row.totalCost)}</td>
                                        <td>{!row.totalCharge ? "Sin cargo" : formatNumberAsMoney(row.totalCharge)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3}>
                                    <Typography level="body-lg" fontWeight="lg">
                                        Total
                                    </Typography>
                                </td>
                                <td>
                                    <Typography level="body-lg" fontWeight="lg">
                                        {formatNumberAsMoney(rows.reduce((total, row) => total + row.totalCost, 0))}
                                    </Typography>
                                </td>
                                <td>
                                    <Typography level="body-lg" fontWeight="lg">
                                        {formatNumberAsMoney(rows.reduce((total, row) => total + row.totalCharge, 0))}
                                    </Typography>
                                </td>
                            </tr>
                        </tfoot>
                    </Table>
                </Sheet>
            </Box>
            <FAB onClick={() => setOpenModal(true)} />
        </>
    );
}
