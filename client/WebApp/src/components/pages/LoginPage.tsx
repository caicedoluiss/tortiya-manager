import { useNotifications } from "@toolpad/core";
import { SignInPage as ToolpadSignInPage, type AuthProvider } from "@toolpad/core/SignInPage";
import { login } from "../../api/v1/auth";
import useAuthentication from "../../hooks/useAuthentication";
import { useNavigate } from "react-router-dom";
import type { ErrorResponse } from "../../types/errorResponse";
import { BAD_REQUEST_RESPONSE_STATUS } from "../../api/errorResponseCodes";
import { useEffect } from "react";
// import { Link } from "@mui/material";

const providers = [{ id: "credentials", name: "Email & Password" }];
export default function LoginPage() {
    const notifications = useNotifications();
    const navigate = useNavigate();
    const { session, setJwt } = useAuthentication();

    // Si el usuario ya está autenticado, redirige a la raíz
    useEffect(() => {
        if (session) {
            navigate("/", { replace: true });
        }
    }, [session, navigate]);

    if (session) {
        return null;
    }

    return (
        <ToolpadSignInPage
            localeText={{
                email: "Usuario",
                password: "Contraseña",
                signInTitle: "Iniciar Sesión",
                signInSubtitle: "Ingresa tus credenciales para continuar",
                providerSignInTitle: () => "Iniciar Sesión",
            }}
            slotProps={{
                submitButton: { variant: "contained", color: "primary" },
                emailField: { name: "userName", autoFocus: true },
                passwordField: { name: "password", type: "password" },
                form: { noValidate: true, autoComplete: "off" },
            }}
            // slots={{
            //     signUpLink: (props) => (
            //         <Link {...props} href="/register" variant="body2">
            //             ¿No tienes una cuenta? Regístrate
            //         </Link>
            //     ),
            // }}
            providers={providers}
            signIn={async (provider: AuthProvider, formData: FormData, callbackUrl?: string) => {
                try {
                    if (provider.id === "credentials") {
                        const email = formData.get("userName") as string;
                        const password = formData.get("password") as string;
                        if (!email || !password) {
                            notifications.show("Usuario y Contraseña son requeridos", {
                                severity: "error",
                                autoHideDuration: 5000,
                            });
                            return {};
                        }
                        const { jwt } = (await login(email, password)) || {};
                        setJwt(jwt);
                        if (jwt) {
                            navigate(callbackUrl || "/", { replace: true });
                        }
                    } else {
                        notifications.show("Unsupported authentication provider");
                    }
                } catch (error) {
                    const messageError = (error as ErrorResponse) || {};
                    const { code, message } = messageError;
                    if (code === BAD_REQUEST_RESPONSE_STATUS) {
                        notifications.show("Usuario o contraseña incorrectos.", {
                            severity: "error",
                            autoHideDuration: 5000,
                        });
                    } else {
                        notifications.show(
                            `Ocurrió un error, no se pudo iniciar sesión.${!message ? "" : ` ${message}.`}`,
                            {
                                severity: "error",
                                autoHideDuration: 5000,
                            },
                        );
                    }
                }

                return {};
            }}
        />
    );
}
