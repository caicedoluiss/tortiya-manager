import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import ApplicationStateContext, { defaultValue } from "./Context";
import usePaymentMethods from "../../hooks/usePaymentMethods";
import useProducts from "../../hooks/useProducts";
import type { Product } from "../../types/Product";
import GlobalLoader from "../../components/GlobalLoader";
import useAuthentication from "../../hooks/useAuthentication";

type Props = {
    children: ReactElement | ReactElement[];
};

export default function ApplicationState({ children }: Props) {
    const { session } = useAuthentication();
    const { getAll: getAllPaymentMethods } = usePaymentMethods();
    const { getAll: getAllProducts } = useProducts();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [state, setState] = useState<{ paymentMethods: string[]; products: Product[] }>(defaultValue);

    const fetchData = useCallback(async () => {
        if (!session) return;
        setIsFetching(true);
        const [paymentMethods, products] = await Promise.all([getAllPaymentMethods(), getAllProducts()]);
        setIsFetching(false);
        setState({ products, paymentMethods });
    }, [getAllPaymentMethods, getAllProducts, session]);

    useEffect(() => {
        let fetch = true;
        if (fetch) fetchData();

        return () => {
            fetch = false;
        };
    }, [fetchData]);

    const value = useMemo(
        () => ({
            paymentMethods: state.paymentMethods,
            products: state.products,
            setIsLoading,
        }),
        [state],
    );

    return (
        <ApplicationStateContext.Provider value={value}>
            <GlobalLoader open={isFetching || isLoading} />
            {children}
        </ApplicationStateContext.Provider>
    );
}
