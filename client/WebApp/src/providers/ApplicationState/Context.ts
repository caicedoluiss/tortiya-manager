import { createContext } from "react";
import type { Product } from "../../types/Product";

export type ApplicationStateContextValue = {
    paymentMethods: string[];
    products: Product[];
    setIsLoading: (value: boolean) => void;
};

export const defaultValue: ApplicationStateContextValue = {
    paymentMethods: [],
    products: [],
    setIsLoading: () => {},
};

const ApplicationStateContext = createContext(defaultValue);
export default ApplicationStateContext;
