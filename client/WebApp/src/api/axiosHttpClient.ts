import axios from "axios";
import { BAD_REQUEST_RESPONSE_STATUS, NO_REQUEST_RESPONSE_STATUS, NOT_ALLOWED_REQUEST_RESPONSE_STATUS, SERVER_ERROR_RESPONSE_STATUS, UNHANDLED_REQUEST_RESPONSE_STATUS } from "./errorResponseCodes";

const axiosHttpClient = axios.create({
    baseURL: import.meta.env.VITE_APPLICATION_API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
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
                }
            });
        }

        if (error.response.status === 400) {
            return Promise.reject({
                code: BAD_REQUEST_RESPONSE_STATUS,
                value: {
                    message: "Bad request.",
                    ...(!error.response.data? {} : error.response.data)
                }
            });
        }

        if (error.response.status === 405) {
            return Promise.reject({
                code: NOT_ALLOWED_REQUEST_RESPONSE_STATUS,
                value: {
                    message: "Not allowed.",
                }
            });
        }

        if (error.response.status >= 500) {
            return Promise.reject({
                code:   SERVER_ERROR_RESPONSE_STATUS,
                value: {
                    message: "Internal server error.",
                    ...(!error.response.data? {} : error.response.data)
                }
            });
        }

        return Promise.reject({ code: UNHANDLED_REQUEST_RESPONSE_STATUS, value: { message: "An error has occurred." }});
    }
);

export default axiosHttpClient;