import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/joy";

type Props = {
    onClick?: () => void;
};
export default function FAB({onClick} : Props) {
    return (
        <IconButton
            color="primary"
            variant="soft"
            size="lg"
            sx={{
                position: 'fixed',
                width: 64,
                height: 64,
                bottom: 32,
                right: 32,
                zIndex: 1000,
                borderRadius: '50%',
                boxShadow: 'lg',
            }}
            onClick={onClick}
            aria-label="Add new order"
        >
            <Add color="primary" />
        </IconButton>
    );
}