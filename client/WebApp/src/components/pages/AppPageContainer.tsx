import type { ReactElement } from "react";
import { PageContainer } from "@toolpad/core/PageContainer";

type Props = {
    title: string;
    children: ReactElement | ReactElement[];
};
export default function AppPageContainer({ title, children }: Props) {
    return <PageContainer title={title}>{children}</PageContainer>;
}
