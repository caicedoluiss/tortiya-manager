import { useEffect, useMemo } from "react";
import AuthenticationContext from "./Context";
import { useLocalStorageState, type Session } from "@toolpad/core";
import readAndParseJwt from "../../utils/readAndParseJwt";
import { AppClaimsNames, type JwtClaims } from "../../types/JwtClaims";
import moment from "moment";

export const LOCAL_STORAGE_JWT_KEY: string = "tortiya.jwt";
export const JWT_CLEARED_EVENT_NAME: string = "tortiya.jwt-cleared";

function validateJwt(claims: JwtClaims): boolean {
    // Check if the JWT claims are valid
    if (!claims) return false;

    const nbf = claims[AppClaimsNames.notValidBefore];
    const exp = claims[AppClaimsNames.expiration];
    if (!nbf || !exp) return false;

    const [notValidBeforeDate, expirationDate] = [moment.unix(nbf as number), moment.unix(exp as number)];
    // Check if the JWT is not valid before the current time
    const now = moment();
    if (now.isBefore(notValidBeforeDate) || now.isAfter(expirationDate)) return false;

    return true;
}

type Props = {
    children: React.ReactElement | React.ReactElement[];
};
export default function AuthenticationProvider({ children }: Props) {
    const [jwt, setJwt] = useLocalStorageState<string | null>(
        LOCAL_STORAGE_JWT_KEY,
        localStorage.getItem(LOCAL_STORAGE_JWT_KEY),
    );

    useEffect(() => {
        // Listen for JWT cleared event to clear the local storage state
        const handleJwtCleared = () => {
            setJwt(null);
        };
        if (typeof window !== "undefined" && window.addEventListener) {
            window.addEventListener(JWT_CLEARED_EVENT_NAME, handleJwtCleared);
        }
        return () => {
            if (typeof window !== "undefined" && window.removeEventListener) {
                window.removeEventListener(JWT_CLEARED_EVENT_NAME, handleJwtCleared);
            }
        };
    }, [setJwt]);

    const session: Session | null = useMemo(() => {
        if (!jwt) return null;
        // Decode JWT to extract user information and expiration
        // Note: This is a simple JWT parsing. In production, consider using a library like jwt-decode.
        const jwtClaims = readAndParseJwt<JwtClaims>(jwt);
        if (!jwtClaims) return null;
        if (!validateJwt(jwtClaims)) {
            setJwt(null); // Clear JWT if it's invalid
            return null;
        }
        const userId = jwtClaims[AppClaimsNames.userId] as string;
        if (!userId) {
            setJwt(null); // Clear JWT if userId is not present
            return null;
        }
        // If the JWT is valid, return a session object
        // Get user details from api using userId
        // Generate a session object with user information
        return {
            user: {
                id: userId,
                name: "Unknown",
                email: "unknown@domain.com",
                image: "", // Placeholder image URL
            },
        };
    }, [jwt, setJwt]);

    return <AuthenticationContext.Provider value={{ session, setJwt }}>{children}</AuthenticationContext.Provider>;
}
