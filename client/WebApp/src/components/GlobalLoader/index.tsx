import { CircularProgress, Paper } from "@mui/material";
import { createPortal } from "react-dom";

type Props = {
    open: boolean;
};
export default function GlobalLoader({ open = false }: Props) {
    if (!open) return null;

    return createPortal(
        <Paper
            sx={{
                position: "fixed",
                zIndex: 2000,
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                bgcolor: "rgba(255,255,255,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <CircularProgress variant="indeterminate" color="primary" />
        </Paper>,
        document.getElementById("global-loader")!
    );
}
