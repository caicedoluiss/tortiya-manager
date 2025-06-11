import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate, useRouteError } from "react-router-dom";
import AppPageContainer from "./AppPageContainer";

type Props = {
    isRouterRootContext?: boolean;
};
export default function ErrorPage({ isRouterRootContext = false }: Props) {
    const error = useRouteError() as { statusText?: string; message?: string };
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!error) return;
    }, [error, location.pathname, navigate]);

    return isRouterRootContext ? (
        <Box p={2}>
            <Typography variant="h6" gutterBottom>
                Oops! Algo salió mal.
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Lo sentimos, ocurrió un error inesperado en la aplicación.
            </Typography>
            <>
                {error && (
                    <Typography variant="body1" component="i">
                        {error.statusText || error.message}
                    </Typography>
                )}
            </>
        </Box>
    ) : (
        <AppPageContainer title="Application Error">
            <Typography variant="h6" gutterBottom>
                Oops! Algo salió mal.
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Lo sentimos, ocurrió un error inesperado en la aplicación.
            </Typography>
            <>
                {error && (
                    <Typography variant="body1" component="i">
                        {error.statusText || error.message}
                    </Typography>
                )}
            </>
        </AppPageContainer>
    );
}
