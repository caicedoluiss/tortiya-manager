import type { NewOrderItem, OrderItem } from "./OrderItem";

export type Order = {
    id: string;
    date: string;
    paymentMethod: string | null;
    items: OrderItem[];
};

export type NewOrder = {
    clientDate: string;
    paymentMethod: string | null;
    items: NewOrderItem[];
};
