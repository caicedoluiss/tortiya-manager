import type { Product } from "../../types/Product";
import { useState } from "react";
import { Add, Close, Remove } from "@mui/icons-material";
import formatNumberAsMoney from "../../utils/formatNumberAsMoney";
import type { OrderItem } from "../../types/OrderItem";
import newUuid from "../../utils/newUuid";
import {
    Box,
    Button,
    Checkbox,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    Typography,
} from "@mui/material";

type Props = {
    product: Product | null;
    open: boolean;
    onClose?: () => void;
    onSubmit?: (item: OrderItem) => void;
};
export default function ProductModal({ product, open, onClose, onSubmit }: Props) {
    const [quantity, setQuantity] = useState<number>(1);
    const [noCharge, setNoCharge] = useState<boolean>(false);

    const handleSubmit = () => {
        if (!product) return;
        const orderItem: OrderItem = {
            id: newUuid(),
            name: product.name,
            quantity,
            cost: product.cost * quantity,
            charge: noCharge ? null : product.price * quantity,
        };
        onSubmit?.(orderItem);
        clearState();
    };

    const handleClose = () => {
        clearState();
        onClose?.();
    };

    const clearState = () => {
        setQuantity(1);
        setNoCharge(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} sx={{ zIndex: 1300 }} fullWidth>
            <DialogTitle>
                <Typography variant="h6" component="p">
                    Nuevo Producto
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
            <DialogContent sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }} dividers>
                <Container>
                    {product && (
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography>{product.name}</Typography>
                            <Typography variant="body1" color="neutral">
                                Precio: {formatNumberAsMoney(product.price)}
                            </Typography>
                        </Box>
                    )}
                    <Box display="flex" flexDirection="column" gap={2}>
                        <FormControl>
                            <FormLabel>Cantidad</FormLabel>
                            <br />
                            <Box display="flex" alignItems="center" gap={2} sx={{ alignSelf: "center" }}>
                                <Button
                                    color="error"
                                    variant="contained"
                                    sx={{ borderRadius: 5 }}
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                >
                                    <Remove />
                                </Button>
                                <Typography variant="h5" component="p" sx={{ minWidth: 32, textAlign: "center" }}>
                                    {quantity}
                                </Typography>
                                <Button
                                    color="success"
                                    variant="contained"
                                    sx={{ borderRadius: 5 }}
                                    onClick={() => setQuantity((q) => q + 1)}
                                >
                                    <Add />
                                </Button>
                            </Box>
                        </FormControl>
                        <FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={noCharge} onChange={(e) => setNoCharge(e.target.checked)} />
                                }
                                label="Sin cargo"
                            />
                        </FormControl>
                    </Box>
                </Container>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="error" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}
