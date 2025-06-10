import { Add } from "@mui/icons-material";
import { Fab } from "@mui/material";

type Props = {
    onClick?: () => void;
};
export default function FAB({ onClick }: Props) {
    return (
        <Fab
            color="primary"
            sx={{
                position: "fixed",
                width: 64,
                height: 64,
                bottom: 32,
                right: 32,
                zIndex: 1000,
                borderRadius: "50%",
                boxShadow: "lg",
            }}
            onClick={onClick}
        >
            <Add />
        </Fab>
    );
}
