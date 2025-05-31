import type { Moment } from "moment";
import type { OrderItem } from "./OrderItem";

export type Order = {
    id: string;
    dateTime: Moment;
    paymentMethod: string | null;
    items: OrderItem[];
}