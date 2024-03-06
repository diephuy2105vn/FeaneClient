import Header from "./Header";
import { LayoutProps } from "./DefaultLayout";
import styled from "styled-components";
import { Container } from "@mui/material";
const Page = styled(Container)``;

const HeaderOnlyLayout = ({ children }: LayoutProps) => {
    return (
        <>
            <Header />
            <Page> {children}</Page>
        </>
    );
};

export default HeaderOnlyLayout;
