import { Divider, IconButton, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import type { Product } from "../../types/Product";
import { useState } from "react";
import { Box, FormControl, FormLabel, Checkbox } from "@mui/joy";
import { Add, Remove } from "@mui/icons-material";
import formatNumberAsMoney from "../../utils/formatNumberAsMoney";
import type { OrderItem } from "../../types/OrderItem";
import newUuid from "../../utils/newUuid";

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
            noCharge: noCharge,
            cost: product.cost * quantity,
            price: noCharge ? 0 : product.price * quantity,
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
        <Modal open={open} onClose={handleClose} sx={{ zIndex: 1300 }}>
            <ModalDialog variant="soft" layout="center" size="lg">
                <Typography level="h4" component="h2">
                    Nuevo Producto
                </Typography>
                <Divider />
                <ModalClose onClick={onClose} />
                <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    {product && (
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography level="title-md">{product.name}</Typography>
                            <Typography level="body-sm" color="neutral">
                                Precio: {formatNumberAsMoney(product.price)}
                            </Typography>
                        </Box>
                    )}
                    <Box display="flex" flexDirection="column" gap={2}>
                        <FormControl>
                            <FormLabel>Cantidad</FormLabel>
                            <Box display="flex" alignItems="center" gap={1}>
                                <IconButton
                                    variant="soft"
                                    size="md"
                                    color="danger"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                >
                                    <Remove />
                                </IconButton>
                                <Typography level="body-lg" sx={{ minWidth: 32, textAlign: "center" }}>
                                    {quantity}
                                </Typography>
                                <IconButton
                                    variant="soft"
                                    size="md"
                                    color="success"
                                    onClick={() => setQuantity((q) => q + 1)}
                                >
                                    <Add />
                                </IconButton>
                            </Box>
                        </FormControl>
                        <FormControl>
                            <Checkbox
                                checked={noCharge}
                                onChange={(e) => setNoCharge(e.target.checked)}
                                label="Sin cargo"
                            />
                        </FormControl>
                    </Box>
                </Box>
                <Box display="flex" gap={2} justifyContent="flex-end">
                    <IconButton variant="outlined" color="danger" onClick={handleClose} sx={{ minWidth: 90 }}>
                        Cancelar
                    </IconButton>
                    <IconButton variant="solid" color="primary" onClick={handleSubmit} sx={{ minWidth: 80 }}>
                        OK
                    </IconButton>
                </Box>
            </ModalDialog>
        </Modal>
    );
}
