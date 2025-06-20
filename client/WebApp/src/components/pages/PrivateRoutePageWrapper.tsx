import { Navigate, useLocation } from "react-router-dom";
import useAuthentication from "../../hooks/useAuthentication";

export default function PrivateRoutePageWrapper({ children }: { children: React.ReactElement }) {
    const { session } = useAuthentication();
    const location = useLocation();
    const isAuthenticated = !!session;

    if (!isAuthenticated) {
        const callbackUrl = location.pathname === "/" ? null : encodeURIComponent(location.pathname + location.search);
        return (
            <Navigate
                to={`/login${!callbackUrl ? "" : `?callbackUrl=${callbackUrl}`}`}
                state={{ from: location }}
                replace
            />
        );
    }

    return <>{children}</>;
}
