import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUser } from "../../redux/userReducer";

import styled from "styled-components";
import { Avatar, Container, Tabs, Tab, Button } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppRegistration } from "@mui/icons-material";
import { FriendType } from "../../constants/Friend";
import instance from "../../axios";

const StyledContainer = styled(Container)`
    &.MuiContainer-root {
        max-width: 960px;
    }
    .MuiAvatar-root {
        width: 132px;
        height: 132px;
        padding: 8px;
        background-color: var(--background-color);
        box-shadow: 0 0 3px 3px rgba(var(--primaryRGB), 0.2);
        .MuiAvatar-img {
            border-radius: 50%;
        }
    }
    .Header {
        height: 132px;
        display: flex;
        justify-content: space-between;
        .Header-user {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .Header-info {
            height: 60px;
            transform: translateY(50%);
            margin-bottom: 8px;
            h3 {
                font-size: 28px;
                color: var(--text-color);
            }
            p {
                margin-top: 4px;
                font-size: 14px;
            }
        }
        .Header-action {
            text-align: center;
            transform: translateY(50%);
        }
        @media (max-width: 600px) {
            flex-direction: column;
            height: 210px;
            .Header-user {
                flex-direction: column;
                .Header-info {
                    height: auto;
                    transform: translateY(0%);
                    p {
                        display: none;
                    }
                }
            }
            .Header-action {
                transform: translateY(0);
            }
        }
    }
    .Nav {
        margin-top: 18px;
        .MuiTabs-root {
            border-top: 1px solid #ccc;
        }
    }
`;

const Wrapper = styled.div`
    display: flex;
    height: 200px;
    margin-bottom: 16px;
    position: relative;
    &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        background-color: white;
        z-index: -2;
    }
    @media (max-width: 600px) {
        height: 278px;
    }
`;

const UserHeader = () => {
    const location = useLocation();
    const userState = useSelector(getUser);

    const navigate = useNavigate();
    const pathNames = location.pathname.split("/");
    const [tabActive, setTabActive] = useState(
        pathNames[pathNames.length - 1] == "friends" ? 1 : 0
    );
    const [friends, setFriends] = useState<FriendType[]>([]);
    useEffect(() => {
        instance
            .get("/user/friends")
            .then((res) => setFriends(res.data))
            .catch((err) => console.log(err));
    }, []);

    const handleChangeTab = (_event: React.SyntheticEvent, newTab: number) => {
        setTabActive(newTab);
    };

    const userLinks = [
        {
            title: "Profile",
            to: `/user/${userState?.username}`,
        },
        {
            title: "Friends",
            to: `/user/${userState?.username}/friends`,
        },
        {
            title: "Orders",
            to: `/user/${userState?.username}/orders`,
        },
    ];

    useLayoutEffect(() => {
        if (!userState) {
            navigate("/");
        }
    }, []);

    return (
        <Wrapper>
            <StyledContainer>
                <div className="Header">
                    <div className="Header-user">
                        <Avatar sizes="large" src={userState?.avatar} />
                        <div className="Header-info">
                            <h3>{userState?.name}</h3>
                            <p>{friends.length} bạn bè</p>
                        </div>
                    </div>
                    <div className="Header-action">
                        {userState?.shops && userState.shops.length > 0 ? (
                            <Button
                                variant="contained"
                                startIcon={<AppRegistration />}
                                component={Link}
                                to={`/own/shop/${userState?.shops[0].name}/overview`}>
                                Your Shops
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                startIcon={<AppRegistration />}
                                component={Link}
                                to="/shop/register">
                                Register Shop
                            </Button>
                        )}
                    </div>
                </div>
                <div className="Nav">
                    <Tabs value={tabActive} onChange={handleChangeTab}>
                        {userLinks.map((link, index) => (
                            <Tab
                                key={index}
                                label={link.title}
                                component={Link}
                                to={link.to}
                            />
                        ))}
                    </Tabs>
                </div>
            </StyledContainer>
        </Wrapper>
    );
};

export default UserHeader;
