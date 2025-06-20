import type { Session } from "@toolpad/core/AppProvider";
import { createContext } from "react";

type Value = {
    session: Session | null;
    setJwt: (jwt: string | null) => void;
};
const defaultContextValue: Value = {
    session: null,
    setJwt: () => {},
};
const AuthenticationContext = createContext<Value>(defaultContextValue);

export default AuthenticationContext;
export type { Value as AuthenticationContextValue };
