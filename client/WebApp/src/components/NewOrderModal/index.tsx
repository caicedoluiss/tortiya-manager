import {
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    IconButton,
    Modal,
    ModalClose,
    ModalDialog,
    Option,
    Select,
    Sheet,
    Table,
    Typography,
} from "@mui/joy";
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
        if (orderItems.length <= 0) alert("Debe agregar al menos un product a la orden.");
        clearState();
        const order: Order = {
            id: newUuid(),
            date: moment().format(),
            paymentMethod: paymentMethod,
            items: orderItems,
        };
        onSubmit?.(order);
        onClose?.();
        clearState();
    };

    const handleSelectProduct = (productId: string) => {
        setSelectedProduct(products.find((product: Product) => product.id === productId) || null);
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

    return (
        <>
            <ProductModal
                product={selectedProduct}
                open={showProductModal}
                onClose={() => setShowProductModal(false)}
                onSubmit={handleAddOrderItem}
            />
            <Modal open={open} onClose={handleClose}>
                <ModalDialog variant="soft" layout="fullscreen" sx={{ height: 1 }}>
                    <ModalClose onClick={onClose} />
                    <Typography level="h4" component="h2" sx={{ mb: 2 }}>
                        Nueva Orden
                    </Typography>
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
                            <FormControl>
                                <FormLabel>Metodo de pago</FormLabel>
                                <Select
                                    name="paymentMethod"
                                    placeholder="Seleccion un método de pago"
                                    value={paymentMethod}
                                    onChange={(_, newValue) => setPaymentMethod(newValue as string)}
                                >
                                    {paymentMethods.map((pm: string) => (
                                        <Option key={pm} value={pm}>
                                            {pm}
                                        </Option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Divider />
                        <Typography level="title-md">Lista de Productos</Typography>
                        <FormControl>
                            <FormLabel>Seleccione un Producto</FormLabel>
                            <Select
                                name="products"
                                defaultValue={null}
                                value={null}
                                onChange={(_, newValue) => handleSelectProduct(newValue as string)}
                            >
                                <Option value={null}>{"< Seleccione un producto >"}</Option>
                                {products.map((product: Product) => (
                                    <Option key={product.id} value={product.id}>
                                        {product.name} - ${product.price}
                                    </Option>
                                ))}
                            </Select>
                        </FormControl>
                        <Sheet variant="outlined" sx={{ mt: 1, p: 1 }}>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Costo</th>
                                        <th>Cargo</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: "center" }}>
                                                No hay productos seleccionados
                                            </td>
                                        </tr>
                                    ) : (
                                        orderItems.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{formatNumberAsMoney(item.cost)}</td>
                                                <td>{!item.charge ? "Sin Cargo" : formatNumberAsMoney(item.charge)}</td>
                                                <td>
                                                    <Button
                                                        color="danger"
                                                        size="sm"
                                                        variant="plain"
                                                        onClick={() => handleDeleteOrderItem(item.id)}
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Sheet>
                    </Box>
                    <Divider />
                    <Box
                        display="flex"
                        gap={1}
                        justifyContent="flex-end"
                        sx={{
                            position: "sticky",
                            bottom: 0,
                        }}
                    >
                        <IconButton variant="outlined" color="danger" onClick={handleClose} sx={{ minWidth: 90 }}>
                            Cancelar
                        </IconButton>
                        <IconButton
                            variant="solid"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ minWidth: 80 }}
                            disabled={orderItems.length <= 0}
                        >
                            OK
                        </IconButton>
                    </Box>
                </ModalDialog>
            </Modal>
        </>
    );
}
