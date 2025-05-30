import { Box } from "@mui/joy";
import Orders from "./components/Orders";
import FAB from "./components/FAB";
import NewOrderModal from "./components/NewOrderModal";
import { useState } from "react";
import type { Order } from "./types/Order";

function App() {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [orders, setOrders] = useState<Order[]>([]);
    return (
        <Box id="app">
            <NewOrderModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={(order) => setOrders([...orders, order])}
            />
            <Orders orders={orders} />
            <FAB onClick={() => setOpenModal(true)} />
        </Box>
    );
}

export default App;
