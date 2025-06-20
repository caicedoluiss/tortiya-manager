import axios from "axios";
import {
    BAD_REQUEST_RESPONSE_STATUS,
    NO_REQUEST_RESPONSE_STATUS,
    NOT_ALLOWED_REQUEST_RESPONSE_STATUS,
    SERVER_ERROR_RESPONSE_STATUS,
    UNHANDLED_REQUEST_RESPONSE_STATUS,
} from "./errorResponseCodes";
import { JWT_CLEARED_EVENT_NAME, LOCAL_STORAGE_JWT_KEY } from "../providers/AuthenticationProvider";

const axiosHttpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosHttpClient.interceptors.request.use(function (config) {
    const jwt = localStorage.getItem(LOCAL_STORAGE_JWT_KEY);
    if (!jwt) {
        // delete localStorage[LOCAL_STORAGE_JWT_KEY];
        // Notifica al AuthenticationProvider que el JWT fue eliminado
        if (typeof window !== "undefined" && window.dispatchEvent) {
            window.dispatchEvent(new Event(JWT_CLEARED_EVENT_NAME));
        }
    } else if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
});

axiosHttpClient.interceptors.response.use(
    function (response) {
        return Promise.resolve(response.data);
    },
    function (error) {
        console.debug("Interceptor response error:", error);

        if (!error.response) {
            return Promise.reject({
                code: NO_REQUEST_RESPONSE_STATUS,
                value: {
                    message: error.message,
                },
            });
        }

        if (error.response.status === 400) {
            return Promise.reject({
                code: BAD_REQUEST_RESPONSE_STATUS,
                value: {
                    message: "Bad request.",
                    ...(!error.response.data ? {} : error.response.data),
                },
            });
        }

        if (error.response.status === 401) {
            if (typeof window !== "undefined") {
                window.localStorage.removeItem(LOCAL_STORAGE_JWT_KEY);
                window.dispatchEvent(new Event(JWT_CLEARED_EVENT_NAME));
                window.location.href = "/login";
            }
            return Promise.reject({
                code: error.response.status,
                value: {
                    message: "Unauthorized. Redirecting to login.",
                    ...(!error.response.data ? {} : error.response.data),
                },
            });
        }

        if (error.response.status === 405) {
            return Promise.reject({
                code: NOT_ALLOWED_REQUEST_RESPONSE_STATUS,
                value: {
                    message: "Not allowed.",
                },
            });
        }

        if (error.response.status >= 500) {
            return Promise.reject({
                code: SERVER_ERROR_RESPONSE_STATUS,
                value: {
                    message: "Internal server error.",
                    ...(!error.response.data ? {} : error.response.data),
                },
            });
        }

        return Promise.reject({
            code: UNHANDLED_REQUEST_RESPONSE_STATUS,
            value: { message: "An error has occurred." },
        });
    },
);

export default axiosHttpClient;
