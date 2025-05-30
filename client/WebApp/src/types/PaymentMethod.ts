export const PAYMENT_METHOD_CASH = "Cash";
export const PAYMENT_METHOD_NEQUI = "Nequi";

export type PaymentMethod = typeof PAYMENT_METHOD_CASH | typeof PAYMENT_METHOD_NEQUI;