import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
    TextField,
    Container,
    IconButton,
    InputAdornment,
    Avatar,
    Box,
    Menu as MenuMui,
    Button,
    useTheme,
    useMediaQuery,
    ListItem,
    ClickAwayListener,
    Hidden,
} from "@mui/material";
import {
    Search,
    Person,
    Login,
    AssignmentInd,
    Info,
    Logout,
    ShoppingCart,
} from "@mui/icons-material";
import Menu from "../Menu";

import { useSelector } from "react-redux";
import { getUser, logoutUser } from "../../redux/userReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import { CartDetailType, ShopCartType } from "../../constants/Cart";
import instance from "../../axios";
import { CardCartDetail } from "../Card";
import { ProductType } from "../../constants/Product";
import useSetValueTimeout from "../../hooks/useSetValueTimeout";

const Wrapper = styled.div`
    height: var(--header-height);
    position: relative;
    .Custom-Shape-divider {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
        z-index: -1;
        svg {
            display: block;
            width: calc(100% + 1.3px);
            height: 100px;
            transform: rotateY(180deg);
        }
        .Shape-fill {
            fill: #c5a7d9;
        }
    }
`;

const StyledHeader = styled.div`
    display: flex;
    align-items: center;
    height: var(--header-height);
    background-color: var(--header-background-color);
    position: fixed;
    z-index: 999;
    width: 100%;
`;

const Logo = styled.h1`
    color: var(--white);
    font-size: 48px;
    user-select: none;
    @media (max-width: 600px) {
        font-size: 28px;
    }
`;

const StyledContainer = styled(Container)`
    &.MuiContainer-root {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        @media (max-width: 600px) {
            padding: 8px;
        }
    }
`;

const Navbar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const SearchBox = styled(Box)`
    &&.MuiBox-root {
        flex: 1;
        max-width: 360px;
        position: relative;
    }
    .MuiTextField-root {
        width: 100%;
        background-color: var(--white);
        border-radius: 30px;
        & .MuiOutlinedInput-root {
            fieldset {
                border-radius: 30px;
                border-color: transparent;
            }
        }
        .MuiInputLabel-root {
            color: var(--primary);
            font-size: 16px;
            opacity: 0.8;
        }
        .MuiInputBase-root {
            color: var(--text-color);
            font-size: 16px;
        }
    }
    .SearchBox-result {
        position: absolute;
        top: 100%;
        width: 100%;
        padding: 4px 0;
        border-radius: 5px;
        background-color: white;
    }
`;

const StyledIconButton = styled(IconButton)`
    &:hover {
        .MuiSvgIcon-root {
            color: var(--white);
        }
    }
`;

const StyledMenu = styled(MenuMui)`
    .MuiMenu-paper {
        width: 500px;
        max-width: 90%;
    }
`;

const Header = () => {
    const [valueSearch, setValueSearch] = useState("");
    const [searchResult, setSearchResult] = useState<ProductType[]>([]);
    const [shopCarts, setShopCarts] = useState<ShopCartType[]>([]);
    const [anchorElMenuUser, setAnchorElMenuUser] =
        React.useState<null | HTMLElement>(null);
    const [anchorElMenuCart, setAnchorElMenuCart] =
        React.useState<null | HTMLElement>(null);

    const openMenuUser = Boolean(anchorElMenuUser);
    const openMenuCart = Boolean(anchorElMenuCart);
    const [checkedCartDetails, setCheckedCartDetails] = useState<
        ShopCartType[]
    >([]);
    const valueSearchSend = useSetValueTimeout(valueSearch, 2000) as string;
    const handleClickIconUser = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMenuUser(event.currentTarget);
    };
    const handleClickIconCart = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMenuCart(event.currentTarget);
    };
    const handleCloseMenuUser = () => {
        setAnchorElMenuUser(null);
    };
    const handleCloseMenuCart = () => {
        setAnchorElMenuCart(null);
    };

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const userState = useSelector(getUser);
    const menuUser = useMemo(() => {
        return userState
            ? {
                  title: userState.username,
                  list: [
                      {
                          title: "Profile",
                          Icon: <Info />,
                          to: `/user/${userState.username}`,
                          divider: true,
                      },
                      {
                          title: "Logout",
                          Icon: <Logout />,
                          handleClick: () => {
                              dispatch(logoutUser());
                          },
                      },
                  ],
              }
            : {
                  title: "User",
                  list: [
                      {
                          title: "Login",
                          Icon: <Login />,
                          to: "/login",
                          divider: true,
                      },
                      {
                          title: "Register",
                          Icon: <AssignmentInd />,
                          to: "/register",
                      },
                  ],
              };
    }, [userState]);

    useEffect(() => {
        if (openMenuCart) {
            instance
                .get("/user/cart")
                .then((res) => {
                    setShopCarts(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [openMenuCart]);
    const handleSearch = () => {
        valueSearchSend.trim() &&
            instance
                .get(`/public/product/all?q=${valueSearchSend}&&size=8`)
                .then((res) => {
                    console.log(res.data);
                    setSearchResult(res.data);
                });
    };
    useEffect(() => {
        handleSearch();
    }, [valueSearchSend]);

    const handleToggleCheckedCartDetails = (
        shopCart: ShopCartType,
        detail: CartDetailType
    ) => {
        setCheckedCartDetails((pre) => {
            const newDetails = [...pre];
            const shopIndex = newDetails.findIndex(
                (item) => item.shop.id === shopCart.shop.id
            );

            if (shopIndex < 0) {
                const newShopCart: ShopCartType = {
                    shop: shopCart.shop,
                    details: [{ ...detail }],
                };
                return [...newDetails, newShopCart];
            }
            const detailIndex = newDetails[shopIndex].details.findIndex(
                (detailPre) => detailPre.product.id === detail.product.id
            );
            if (detailIndex < 0) {
                newDetails[shopIndex].details = [
                    ...newDetails[shopIndex].details,
                    detail,
                ];
            } else {
                newDetails[shopIndex].details.splice(detailIndex, 1);
                newDetails[shopIndex].details.length === 0 &&
                    newDetails.splice(shopIndex, 1);
            }
            return newDetails;
        });
    };

    const isCheckedCartDetails = (
        shopCart: ShopCartType,
        detail: CartDetailType
    ) => {
        const shopIndex = checkedCartDetails.findIndex(
            (item) => item.shop.id === shopCart.shop.id
        );
        if (shopIndex < 0) {
            return false;
        }
        const detailIndex = checkedCartDetails[shopIndex].details.findIndex(
            (detailPre) => detailPre.product.id === detail.product.id
        );
        return detailIndex >= 0;
    };
    return (
        <Wrapper>
            <StyledHeader>
                <StyledContainer>
                    <Link to="/">
                        <Logo>Feane</Logo>
                    </Link>
                    <ClickAwayListener onClickAway={() => setSearchResult([])}>
                        <SearchBox>
                            <TextField
                                label={!valueSearch && "Enter search content"}
                                variant="outlined"
                                value={valueSearch}
                                onChange={(e) => setValueSearch(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleSearch}>
                                                <Search />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                InputLabelProps={{
                                    shrink: false,
                                }}
                            />
                            {searchResult.length > 0 && (
                                <Box className="SearchBox-result">
                                    {searchResult.map((result, index) => (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                padding: "2px 8px",
                                                " & + &": {
                                                    borderTop: "1px solid #ccc",
                                                },
                                            }}>
                                            <img
                                                width={45}
                                                height={45}
                                                src={result.images[0]}
                                            />
                                            <Box
                                                sx={{
                                                    marginLeft: "6px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "start",
                                                    gap: "2px",
                                                }}>
                                                <p
                                                    style={{
                                                        fontSize: "12px",
                                                        fontWeight: 500,
                                                    }}>
                                                    {result.name}
                                                </p>
                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        fontWeight: 500,
                                                        padding: "2px 5px",
                                                        borderRadius: "10px",
                                                        backgroundColor:
                                                            "var(--primary)",
                                                        color: "white",
                                                    }}>
                                                    {result.price.toLocaleString()}{" "}
                                                    đ
                                                </span>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </Box>
                            )}
                        </SearchBox>
                    </ClickAwayListener>
                    <Navbar>
                        <Box>
                            <StyledIconButton
                                size={matches ? "large" : "medium"}
                                onClick={handleClickIconUser}>
                                {userState ? (
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                        }}
                                        src={userState.avatar}
                                    />
                                ) : (
                                    <Person fontSize="inherit" />
                                )}
                            </StyledIconButton>
                            <Menu
                                anchorEl={anchorElMenuUser}
                                open={openMenuUser}
                                handleClose={handleCloseMenuUser}
                                menu={menuUser}
                            />
                        </Box>
                        <Hidden mdDown>
                            <Box>
                                <StyledIconButton
                                    size={matches ? "large" : "medium"}
                                    onClick={(e) =>
                                        userState
                                            ? handleClickIconCart(e)
                                            : navigate("/login")
                                    }>
                                    <ShoppingCart />
                                </StyledIconButton>
                                <StyledMenu
                                    anchorEl={anchorElMenuCart}
                                    open={openMenuCart}
                                    onClose={handleCloseMenuCart}>
                                    {shopCarts.map((shopCart, index) => (
                                        <Box key={index + 1}>
                                            <Box
                                                sx={{
                                                    padding: "4px 8px",
                                                    opacity: 0.8,
                                                    display: "flex",
                                                    gap: "16px",
                                                    alignItems: "center",
                                                    borderBottom:
                                                        "1px solid #ccc",
                                                }}>
                                                <Link
                                                    to={`/shop/${shopCart.shop.id}`}>
                                                    <h3
                                                        style={{
                                                            fontWeight: 600,
                                                            fontSize: "16px",
                                                        }}>
                                                        {shopCart.shop.name}
                                                    </h3>
                                                </Link>
                                            </Box>
                                            {shopCart.details.map(
                                                (
                                                    detail: CartDetailType,
                                                    index: number
                                                ) => (
                                                    <CardCartDetail
                                                        key={index + 1}
                                                        detail={detail}
                                                        setShopCarts={
                                                            setShopCarts
                                                        }
                                                        checked={isCheckedCartDetails(
                                                            shopCart,
                                                            detail
                                                        )}
                                                        handleToggleChecked={() => {
                                                            handleToggleCheckedCartDetails(
                                                                shopCart,
                                                                detail
                                                            );
                                                        }}
                                                    />
                                                )
                                            )}
                                        </Box>
                                    ))}

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: "8px",
                                            padding: "0 8px",
                                        }}>
                                        <Button
                                            size="small"
                                            fullWidth
                                            variant="contained"
                                            onClick={() => {
                                                const order = {
                                                    orderDetails:
                                                        checkedCartDetails,
                                                    orderByCart: true,
                                                };
                                                localStorage.setItem(
                                                    "order",
                                                    JSON.stringify(order)
                                                );
                                                navigate("/order");
                                            }}
                                            disabled={
                                                checkedCartDetails.length === 0
                                            }>
                                            Order Now
                                        </Button>
                                        <Button
                                            size="small"
                                            fullWidth
                                            variant="outlined">
                                            Go to Cart
                                        </Button>
                                    </Box>
                                </StyledMenu>
                            </Box>
                        </Hidden>
                    </Navbar>
                </StyledContainer>
            </StyledHeader>
            <div className="Custom-Shape-divider">
                <svg
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none">
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        className="Shape-fill"></path>
                </svg>
            </div>
        </Wrapper>
    );
};

export default Header;
