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
import { useState } from "react";
import type { Product } from "../../types/Product";
import { PAYMENT_METHOD_CASH, PAYMENT_METHOD_NEQUI, type PaymentMethod } from "../../types/PaymentMethod";
import ProductModal from "./ProductModal";
import formatNumberAsMoney from "../../utils/formatNumberAsMoney";
import type { Order } from "../../types/Order";
import newUuid from "../../utils/newUuid";
import moment from "moment";

const demoProducts: Product[] = [
    {
        id: "1",
        name: "Tortilla de Maíz",
        price: 25,
        cost: 15,
        category: "Tortillas",
    },
    {
        id: "2",
        name: "Tortilla de Harina",
        price: 30,
        cost: 18,
        category: "Tortillas",
    },
    { id: "3", name: "Quesadilla", price: 40, cost: 25, category: "Antojitos" },
    { id: "4", name: "Taco de Asada", price: 35, cost: 22, category: "Tacos" },
    { id: "5", name: "Taco al Pastor", price: 33, cost: 20, category: "Tacos" },
    {
        id: "6",
        name: "Gordita de Chicharrón",
        price: 38,
        cost: 24,
        category: "Antojitos",
    },
    {
        id: "7",
        name: "Enchilada Roja",
        price: 45,
        cost: 28,
        category: "Antojitos",
    },
    { id: "8", name: "Sopes", price: 32, cost: 19, category: "Antojitos" },
    {
        id: "9",
        name: "Bebida Refresco",
        price: 20,
        cost: 10,
        category: "Bebidas",
    },
    {
        id: "10",
        name: "Agua de Horchata",
        price: 18,
        cost: 9,
        category: "Bebidas",
    },
];

type Props = {
    open: boolean;
    onClose?: () => void;
    onSubmit?: (order: Order) => void;
};
export default function NewOrderModal({ open, onClose, onSubmit }: Props) {
    const products = demoProducts;
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHOD_CASH);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showProductModal, setShowProductModal] = useState<boolean>(false);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

    const handleSubmit = () => {
        clearState();
        const order: Order = {
            id: newUuid(),
            dateTime: moment(),
            paymentMethod: paymentMethod,
            items: orderItems,
            noCharge: false,
        };
        onSubmit?.(order);
        onClose?.();
        clearState();
    };

    const handleSelectProduct = (productId: string) => {
        setSelectedProduct(products.find((product) => product.id === productId) || null);
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

    const clearState = () => {
        setOrderItems([]);
        setPaymentMethod(PAYMENT_METHOD_CASH);
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
            <Modal open={open} onClose={onClose}>
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
                                    onChange={(_, newValue) => setPaymentMethod(newValue as PaymentMethod)}
                                >
                                    <Option value={PAYMENT_METHOD_CASH}>Efectivo</Option>
                                    <Option value={PAYMENT_METHOD_NEQUI}>Nequi</Option>
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
                                {products.map((product) => (
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
                                                <>{console.log(item.id)}</>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{formatNumberAsMoney(item.cost)}</td>
                                                <td>{item.noCharge ? "Sin Cargo" : formatNumberAsMoney(item.price)}</td>
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
                        <IconButton variant="outlined" color="danger" onClick={onClose} sx={{ minWidth: 90 }}>
                            Cancelar
                        </IconButton>
                        <IconButton variant="solid" color="primary" onClick={handleSubmit} sx={{ minWidth: 80 }}>
                            OK
                        </IconButton>
                    </Box>
                </ModalDialog>
            </Modal>
        </>
    );
}
