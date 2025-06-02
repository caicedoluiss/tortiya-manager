import type { Product } from "../../types/Product";
import axiosHttpClient from "../axiosHttpClient";

type GetProductsResponse = {
    products: Product[];
};
export async function getProducts(): Promise<GetProductsResponse> {
    const url = "v1/products";
    return await axiosHttpClient.get(url);
}
