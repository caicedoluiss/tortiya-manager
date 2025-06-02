import { useCallback, useMemo } from "react";
import { getPaymentMethods } from "../api/v1/payment-methods";

export default function usePaymentMethods() {
    const getAll = useCallback(async () => {
        try {
            const { paymentMethods } = await getPaymentMethods();
            return paymentMethods;
        } catch (_) {
            return [];
        }
    }, []);

    const value = useMemo(
        () => ({
            getAll,
        }),
        [getAll]
    );

    return value;
}
