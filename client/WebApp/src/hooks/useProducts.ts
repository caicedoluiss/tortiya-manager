import { useCallback } from "react";
import { getProducts } from "../api/v1/products";

export default function useProducts() {
    const getAll = useCallback(async () => {
        try {
            const { products } = await getProducts();
            return products;
        } catch (_) {
            return [];
        }
    }, []);

    return { getAll };
}
