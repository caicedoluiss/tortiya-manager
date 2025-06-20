import { Box } from "@mui/material";
import ApplicationState from "./providers/ApplicationState";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useNavigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import OrdersPage from "./components/pages/OrdersPage";
import ErrorPage from "./components/pages/ErrorPage";
import LoginPage from "./components/pages/LoginPage";
import type { Authentication, Branding } from "@toolpad/core/AppProvider";
import { useMemo } from "react";
import AuthenticationProvider from "./providers/AuthenticationProvider";
import useAuthentication from "./hooks/useAuthentication";
import RegisterPage from "./components/pages/RegisterPage";

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
                    {
                        path: "/register",
                        element: <RegisterPage />,
                    },
                ],
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
        ],
    },
]);

const BRANDING: Branding = {
    title: "TortiYa Manager",
    homeUrl: "/",
    logo: <img src="/favicon.svg" alt="logo.svg" style={{ width: 40, height: 40, borderRadius: "50%" }} />,
};

function App() {
    return (
        <AuthenticationProvider>
            <RouterProvider router={router} />
        </AuthenticationProvider>
    );
}

function TortiYaManagerApp() {
    const navigate = useNavigate();
    const { session, setJwt } = useAuthentication();

    const authentication: Authentication = useMemo(
        () => ({
            signIn: () => navigate("/login"),
            signOut: () => {
                setJwt(null);
                navigate("/", { replace: true });
            },
        }),
        [navigate, setJwt],
    );

    return (
        <Box id="app">
            <NotificationsProvider>
                <ApplicationState>
                    <ReactRouterAppProvider branding={BRANDING} authentication={authentication} session={session}>
                        <Outlet />
                    </ReactRouterAppProvider>
                </ApplicationState>
            </NotificationsProvider>
        </Box>
    );
}

export default App;
