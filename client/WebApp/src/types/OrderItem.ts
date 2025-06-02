export type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    charge: number | null;
    cost: number;
};

export type NewOrderItem = {
    name: string;
    quantity: number;
    charge: number | null;
    cost: number;
};
