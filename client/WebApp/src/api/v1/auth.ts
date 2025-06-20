import type { ErrorResponse } from "../../types/errorResponse";
import axiosHttpClient from "../axiosHttpClient";

type LoginResponse = {
    jwt: string;
};
export function login(userName: string, password: string): Promise<LoginResponse> {
    const url = "/v1/auth/login";
    const body = { userName, password };
    return axiosHttpClient.post(url, body);
}

export function register({
    email,
    password,
    firstName,
    lastName,
}: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}): Promise<ErrorResponse | null> {
    const url = "/v1/auth/register";
    const body = { email, password, firstName, lastName };
    return axiosHttpClient.post(url, body);
}
