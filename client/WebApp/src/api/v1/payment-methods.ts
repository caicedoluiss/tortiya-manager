import axiosHttpClient from "../axiosHttpClient";

type GetPaymentMethodsResponse = {
    paymentMethods: string[];
};
export async function getPaymentMethods(): Promise<GetPaymentMethodsResponse> {
    const url = "/v1/payment-methods";
    return await axiosHttpClient.get(url);
}
