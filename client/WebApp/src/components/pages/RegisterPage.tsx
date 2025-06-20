import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { useNotifications } from "@toolpad/core";
import { useState } from "react";
import PrivateRoutePageWrapper from "./PrivateRoutePageWrapper";
import { register } from "../../api/v1/auth";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const notifications = useNotifications();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            notifications.show("Las contraseñas no coinciden.", { severity: "error", autoHideDuration: 5000 });
            return;
        }
        try {
            await register(form);
            notifications.show("Cuenta creada exitosamente. Ahora puedes iniciar sesión.", {
                severity: "success",
                autoHideDuration: 5000,
            });
            setForm({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
            navigate("/login", { replace: true });
        } catch (_) {
            notifications.show("Ocurrió un error al procesar el registro.", {
                severity: "error",
                autoHideDuration: 5000,
            });
            return;
        }
    };

    return (
        <PrivateRoutePageWrapper>
            <Container
                maxWidth="xs"
                sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
            >
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Crear cuenta
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            name="firstName"
                            label="Nombre"
                            size="small"
                            margin="normal"
                            value={form.firstName || ""}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="lastName"
                            label="Apellido"
                            size="small"
                            margin="normal"
                            value={form.lastName || ""}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="email"
                            label="Usuario (Email)"
                            size="small"
                            margin="normal"
                            value={form.email}
                            onChange={handleChange}
                            required
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            name="password"
                            type="password"
                            label="Contraseña"
                            margin="normal"
                            size="small"
                            value={form.password}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            type="password"
                            name="confirmPassword"
                            label="Confirmar contraseña"
                            size="small"
                            margin="normal"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Registrarse
                        </Button>
                        {/* <Box textAlign="center">
                        <Link href="/login" variant="body2">
                            ¿Ya tienes una cuenta? Inicia sesión
                        </Link>
                    </Box> */}
                    </Box>
                </Paper>
            </Container>
        </PrivateRoutePageWrapper>
    );
}
