import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { OrderItem } from "../../types/OrderItem";
import { useEffect, useState } from "react";
import type { Product } from "../../types/Product";
import ProductModal from "./ProductModal";
import formatNumberAsMoney from "../../utils/formatNumberAsMoney";
import type { Order } from "../../types/Order";
import newUuid from "../../utils/newUuid";
import moment from "moment";
import useApplicationState from "../../hooks/useApplicationState";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";

type Props = {
    open: boolean;
    onClose?: () => void;
    onSubmit?: (order: Order) => void;
};
export default function NewOrderModal({ open, onClose, onSubmit }: Props) {
    const { paymentMethods, products } = useApplicationState();
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showProductModal, setShowProductModal] = useState<boolean>(false);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

    useEffect(() => {
        setPaymentMethod(paymentMethods[0] ?? "");
    }, [paymentMethods]);

    const handleSubmit = () => {
        if (orderItems.length <= 0) alert("Debe agregar al menos un producto a la orden.");
        clearState();
        const order: Order = {
            id: newUuid(),
            date: moment().format(),
            paymentMethod: orderItems.every((item) => !item.charge) ? null : paymentMethod,
            items: orderItems,
        };
        onSubmit?.(order);
        onClose?.();
        clearState();
    };

    const handleSelectProduct = (productId: string) => {
        setShowProductModal(true);
        setSelectedProduct(products.find((product: Product) => product.id === productId) ?? null);
        if (productId) setShowProductModal(true);
    };

    const handleAddOrderItem = (item: OrderItem) => {
        setShowProductModal(false);
        setOrderItems((prevItems) => [...prevItems, item]);
        setSelectedProduct(null);
    };

    const handleDeleteOrderItem = (itemId: string) => {
        setOrderItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };

    const handleClose = () => {
        onClose?.();
        clearState();
    };

    const clearState = () => {
        setOrderItems([]);
        setPaymentMethod(paymentMethods[0]);
        setSelectedProduct(null);
    };

    const handleCloseProductDialog = () => {
        setSelectedProduct(null);
        setShowProductModal(false);
    };

    return (
        <>
            <ProductModal
                product={selectedProduct}
                open={showProductModal}
                onClose={handleCloseProductDialog}
                onSubmit={handleAddOrderItem}
            />
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    <Typography component="p" variant="h5" sx={{ mb: 2 }}>
                        Nueva Orden
                    </Typography>
                </DialogTitle>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <Close />
                </IconButton>
                <DialogContent dividers>
                    <Container>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                overflowY: "auto",
                                minHeight: 0,
                                flexGrow: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                                width={"50dvw"}
                            >
                                <FormControl sx={{ mt: 1 }}>
                                    <InputLabel>Método de pago</InputLabel>
                                    <Select
                                        name="paymentMethod"
                                        label="Metodo de pago"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        {paymentMethods.map((pm: string) => (
                                            <MenuItem key={pm} value={pm}>
                                                {pm}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Typography>Lista de Productos</Typography>
                            <FormControl>
                                <InputLabel>Seleccione un Producto</InputLabel>
                                <Select
                                    name="products"
                                    label="Seleccione un producto"
                                    defaultValue={""}
                                    value={selectedProduct?.id ?? ""}
                                    onChange={(e) => handleSelectProduct(e.target.value)}
                                >
                                    <MenuItem value="">{"< Seleccione un producto >"}</MenuItem>
                                    {products.map((product: Product) => (
                                        <MenuItem key={product.id} value={product.id}>
                                            {product.name} - ${product.price}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <Typography fontWeight="bold">Producto</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight="bold">Cantidad</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight="bold">Costo</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight="bold">Cargo</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight="bold">Eliminar</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderItems.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                                                    No hay productos seleccionados
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            orderItems.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>{formatNumberAsMoney(item.cost)}</TableCell>
                                                    <TableCell>
                                                        {!item.charge ? "Sin Cargo" : formatNumberAsMoney(item.charge)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            color="error"
                                                            onClick={() => handleDeleteOrderItem(item.id)}
                                                        >
                                                            <DeleteOutlineIcon fontSize="small" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Container>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" color="error" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={orderItems.length <= 0}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
