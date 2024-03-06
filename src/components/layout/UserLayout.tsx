import UserHeader from "./UserHeader";

import { LayoutProps } from "./DefaultLayout";
import { Container } from "@mui/material";
import styled from "styled-components";
import Header from "./Header";
const StyledContainer = styled(Container)`
    &.MuiContainer-root {
        max-width: 960px;
    }
`;

const UserLayout = ({ children }: LayoutProps) => {
    return (
        <>
            <Header />
            <UserHeader />
            <StyledContainer>{children}</StyledContainer>
        </>
    );
};

export default UserLayout;
