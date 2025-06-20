import Orders from "../Orders";
import AppPageContainer from "./AppPageContainer";
import PrivateRoutePageWrapper from "./PrivateRoutePageWrapper";

export default function OrdersPage() {
    return (
        <PrivateRoutePageWrapper>
            <AppPageContainer title="Ordenes">
                <Orders />
            </AppPageContainer>
        </PrivateRoutePageWrapper>
    );
}
