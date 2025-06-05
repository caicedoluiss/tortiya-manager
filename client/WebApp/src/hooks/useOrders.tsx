import { useCallback } from "react";
import { getOrdersByDate, postOrder } from "../api/v1/orders";
import type { ErrorResponse } from "../types/errorResponse";
import { BAD_REQUEST_RESPONSE_STATUS } from "../api/errorResponseCodes";
import type { Order } from "../types/Order";

export default function useOrders() {
    const getAllByDate = useCallback(async (date: Date) => {
        try {
            const { orders } = await getOrdersByDate(date);
            return orders;
        } catch (error) {
            const axiosError = (error as ErrorResponse) || {};
            const { code, validationErrors = [], message } = axiosError;
            alert(`${code}: ${message}`);
            if (code === BAD_REQUEST_RESPONSE_STATUS && validationErrors?.length > 0) {
                console.error(JSON.stringify(validationErrors));
            }
            return [];
        }
    }, []);

    const create = useCallback(async (order: Order) => {
        try {
            const resultOrder = await postOrder(order);
            return resultOrder;
        } catch (error) {
            const axiosError = (error as ErrorResponse) || {};
            const { code, validationErrors = [], message } = axiosError;
            alert(`${code}: ${message}`);
            if (code === BAD_REQUEST_RESPONSE_STATUS && validationErrors?.length > 0) {
                console.error(JSON.stringify(validationErrors));
            }
        }
    }, []);

    return { getAllByDate, create };
}
