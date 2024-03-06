import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export interface LayoutProps {
    children: ReactNode;
}

const Page = styled.div`
    min-height: calc(100vh - var(--header-height));
`;

const DefaultLayout = ({ children }: LayoutProps) => {
    return (
        <>
            <Header />
            <Page>{children}</Page>
            <Footer />
        </>
    );
};

export default DefaultLayout;
