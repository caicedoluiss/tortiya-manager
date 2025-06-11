import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";

export default function AppLayout() {
    return (
        <DashboardLayout hideNavigation>
            <Outlet />
        </DashboardLayout>
    );
}
