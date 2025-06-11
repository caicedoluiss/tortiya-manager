import { Box } from "@mui/material";
import ApplicationState from "./providers/ApplicationState";
import { AppProvider, type Branding } from "@toolpad/core/AppProvider";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import OrdersPage from "./components/pages/OrdersPage";
import ErrorPage from "./components/pages/ErrorPage";

const router = createBrowserRouter([
    {
        element: <TortiYaManagerApp />,
        errorElement: <ErrorPage isRouterRootContext />,
        children: [
            {
                path: "/",
                element: <AppLayout />,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: "/",
                        element: <Navigate to="orders" />,
                    },
                    {
                        path: "/orders",
                        element: <OrdersPage />,
                    },
                ],
            },
        ],
    },
]);

const BRANDING: Branding = {
    title: "TortiYa Manager",
    homeUrl: "/",
    logo: <img src="/favicon.svg" alt="logo.svg" style={{ borderRadius: "50%" }} />,
};

function App() {
    return <RouterProvider router={router} />;
}

function TortiYaManagerApp() {
    return (
        <Box id="app">
            <NotificationsProvider>
                <ApplicationState>
                    <AppProvider branding={BRANDING}>
                        <Outlet />
                    </AppProvider>
                </ApplicationState>
            </NotificationsProvider>
        </Box>
    );
}

export default App;
