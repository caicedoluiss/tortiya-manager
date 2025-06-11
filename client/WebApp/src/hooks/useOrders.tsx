import { useCallback } from "react";
import { getOrdersByDate, postOrder } from "../api/v1/orders";
import type { ErrorResponse } from "../types/errorResponse";
import type { Order } from "../types/Order";
import { useNotifications } from "@toolpad/core/useNotifications";

export default function useOrders() {
    const notifications = useNotifications();
    const getAllByDate = useCallback(
        async (date: Date) => {
            try {
                const { orders } = await getOrdersByDate(date);
                return orders;
            } catch (error) {
                const axiosError = (error as ErrorResponse) || {};
                const { code, message } = axiosError;
                notifications.show(`Application request error: '${code}'.${!message ? "" : ` ${message}`}`, {
                    autoHideDuration: 5000,
                    severity: "error",
                });
                return [];
            }
        },
        [notifications],
    );

    const create = useCallback(
        async (order: Order) => {
            try {
                const resultOrder = await postOrder(order);
                notifications.show("Orden registrada exitosamente.", { autoHideDuration: 3000, severity: "success" });
                return resultOrder;
            } catch (error) {
                const axiosError = (error as ErrorResponse) || {};
                const { code, message } = axiosError;
                notifications.show(`Application request error: '${code}'.${!message ? "" : ` ${message}`}`, {
                    autoHideDuration: 5000,
                    severity: "error",
                });
            }
        },
        [notifications],
    );

    return { getAllByDate, create };
}
