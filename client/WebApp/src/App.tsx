import { Box } from "@mui/joy";
import Orders from "./components/Orders";
import ApplicationState from "./providers/ApplicationState";

function App() {
    return (
        <Box id="app">
            <ApplicationState>
                <Orders />
            </ApplicationState>
        </Box>
    );
}

export default App;
