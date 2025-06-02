import { useContext } from "react";
import type { ApplicationStateContextValue } from "../providers/ApplicationState/Context";
import ApplicationStateContext from "../providers/ApplicationState/Context";

export default function useApplicationState() {
    const value = useContext<ApplicationStateContextValue>(ApplicationStateContext);
    return value;
}
