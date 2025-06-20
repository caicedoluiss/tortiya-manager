import { useContext } from "react";
import AuthenticationContext from "../providers/AuthenticationProvider/Context";

export default function useAuthentication() {
    const { session, setJwt } = useContext(AuthenticationContext);

    return { session, setJwt };
}
