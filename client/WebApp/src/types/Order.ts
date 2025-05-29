import type { Moment } from "moment";
import type { PaymentMethod as PaymentMethodEnum } from "./PaymentMethod";
import type { OrderItem } from "./OrderItem";

export type Order = {
    id: string;
    dateTime: Moment;
    noCharge: boolean;
    paymentMethod: PaymentMethodEnum | null;
    items: OrderItem[];
}