import React, { useState } from "react";
import Card from "../../Card";

import { Box, Tabs, Tab, Input, Button } from "@mui/material";
import styled from "styled-components";
import {
    CloseRounded,
    Edit,
    HomeRounded,
    LocalPhoneRounded,
    Person,
} from "@mui/icons-material";

import { useSelector } from "react-redux";
import { getUser } from "../../../redux/userReducer";

import FormGroupDelAddress from "../../FormGroupDelAddress";

const StyledTabs = styled(Tabs)`
    &.MuiTabs-root {
        width: 25%;
        min-width: 160px;
        .MuiTab-root {
            text-align: left;
            align-items: flex-start;
        }
    }
    @media (max-width: 601px) {
        &.MuiTabs-root {
            display: none;
        }
    }
`;

interface TabContentProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const StyledBox = styled(Box)`
    display: flex;
    flex-direction: row;
    @media (max-width: 600px) {
        flex-direction: column;
        gap: 16px;
    }
`;

const StyledTabContent = styled.div`
    display: ${(props) => `${props.hidden ? "none" : "block"}`};
    flex: 1;
    padding: 0 8px;
    > .MuiBox-root {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 8px;
        width: 100%;
        gap: 8px;
        color: #555;

        + .MuiBox-root {
            margin-top: 8px;
        }

        .MuiInputBase-root {
            margin-left: 16px;
            &.MuiInput-underline::before {
                border-bottom-color: #ccc;
            }
            &.MuiInput-underline::after {
                border-bottom-color: #ccc;
            }
        }
    }
    > .MuiBox-root:first-child {
        display: none;
    }
    > .MuiBox-root:last-child {
        justify-content: flex-end;
    }

    @media (max-width: 600px) {
        display: block;
        .MuiBox-root:first-child {
            display: flex;
        }
    }
`;

const TabContent = ({ children, value, index, ...other }: TabContentProps) => {
    return (
        <StyledTabContent hidden={value !== index} {...other}>
            {children}
        </StyledTabContent>
    );
};

const Profile = () => {
    const userState = useSelector(getUser);
    const [tabActive, setTabActive] = React.useState(0);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [userValue, setUserValue] = useState(userState);

    const handleChangeTab = (
        _event: React.SyntheticEvent,
        newTabActive: number
    ) => {
        setTabActive(newTabActive);
    };

    return (
        <Card column={1}>
            <StyledBox>
                <StyledTabs
                    orientation="vertical"
                    variant="scrollable"
                    value={tabActive}
                    onChange={handleChangeTab}>
                    <Tab label="Overview" />
                    <Tab label="Del Address" />
                </StyledTabs>
                <TabContent value={tabActive} index={0}>
                    <Box>
                        <h3>Overview</h3>
                    </Box>
                    <Box>
                        <Person />
                        <Input
                            fullWidth
                            value={userValue?.name || ""}
                            onChange={(e) => {
                                if (isReadOnly) {
                                    return;
                                }
                                return setUserValue(
                                    (pre) =>
                                        pre && {
                                            ...pre,
                                            name: e.target.value,
                                        }
                                );
                            }}
                            readOnly={isReadOnly}
                        />
                    </Box>
                    <Box>
                        <HomeRounded />
                        <Input
                            fullWidth
                            value={userValue?.address}
                            readOnly={isReadOnly}
                            onChange={(e) => {
                                if (isReadOnly) {
                                    return;
                                }
                                return setUserValue(
                                    (pre) =>
                                        pre && {
                                            ...pre,
                                            address: e.target.value,
                                        }
                                );
                            }}
                        />
                    </Box>
                    <Box>
                        <LocalPhoneRounded />
                        <Input
                            type="number"
                            fullWidth
                            value={userValue?.phoneNumber}
                            readOnly={isReadOnly}
                            onChange={(e) => {
                                if (isReadOnly) {
                                    return;
                                }
                                return setUserValue(
                                    (pre) =>
                                        pre && {
                                            ...pre,
                                            phoneNumber: e.target.value,
                                        }
                                );
                            }}
                        />
                    </Box>
                    <Box>
                        {!isReadOnly && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<CloseRounded />}
                                onClick={() => {
                                    setUserValue(userState);
                                    setIsReadOnly(true);
                                }}>
                                Cancel
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Edit />}
                            onClick={() => setIsReadOnly((pre) => !pre)}>
                            {isReadOnly ? "Edit" : "Save"}
                        </Button>
                    </Box>
                </TabContent>
                <TabContent value={tabActive} index={1}>
                    <FormGroupDelAddress />
                </TabContent>
            </StyledBox>
        </Card>
    );
};

export default Profile;
