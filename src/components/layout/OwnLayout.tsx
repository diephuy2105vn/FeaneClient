import { styled as styledMui, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as AppBarMuiProps } from "@mui/material/AppBar";
import { useState, useMemo, useEffect, createContext } from "react";
import styled from "styled-components";
import {
    Toolbar,
    List,
    Box,
    Drawer as DrawerMui,
    CssBaseline,
    CSSObject,
    Theme,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Button,
    Avatar,
} from "@mui/material";

import {
    Menu as MenuIcon,
    ChevronLeft,
    ChevronRight,
    Settings,
    Shop,
    AppRegistration,
    Info,
    Logout,
    ArrowDropDown,
    ShoppingCart,
    Store,
    AutoGraph,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { LayoutProps } from "./DefaultLayout";
import { useSelector } from "react-redux";
import { getUser, logoutUser } from "../../redux/userReducer";
import Menu from "../Menu";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";

import { ShopType } from "../../constants/Shop";
import instance from "../../axios";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styledMui("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends AppBarMuiProps {
    open?: boolean;
}

const AppBar = styledMui(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    backgroundColor: "var(--header-background-color)",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styledMui(DrawerMui, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));
const Logo = styled.h1`
    color: var(--primary);
    font-size: 32px;
    user-select: none;
`;

export const ShopContext = createContext<{
    shops: ShopType[] | null;
    shopActive: ShopType | null;
    setShops: React.Dispatch<React.SetStateAction<ShopType[] | null>> | null;
    setShopActive: React.Dispatch<React.SetStateAction<ShopType | null>> | null;
}>({ shops: [], shopActive: null, setShops: null, setShopActive: null });

const OwnLayout = ({ children }: LayoutProps) => {
    const theme = useTheme();
    const userState = useSelector(getUser);
    const dispatch: AppDispatch = useDispatch();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [shops, setShops] = useState<ShopType[] | null>([]);
    const [shopActive, setShopActive] = useState<ShopType | null>(null);
    const [anchorElMenuUser, setAnchorElMenuUser] =
        useState<null | HTMLElement>(null);
    const openMenuUser = Boolean(anchorElMenuUser);
    const handleCloseMenuUser = () => {
        setAnchorElMenuUser(null);
    };
    const [anchorElMenuShops, setAnchorElMenuShops] =
        useState<null | HTMLElement>(null);
    const openMenuShops = Boolean(anchorElMenuShops);
    const handleCloseMenuShops = () => {
        setAnchorElMenuShops(null);
    };
    const handleOpenMenuShops = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMenuShops(event.currentTarget);
    };

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
            : null;
    }, [userState]);

    const ownLinks = useMemo(
        () => [
            {
                title: "Shop overview",
                icon: Shop,
                to: `/own/shop/${shopActive?.name}/overview`,
            },
            {
                title: "All products",
                icon: Store,
                to: `/own/shop/${shopActive?.name}/product/all`,
            },
            {
                title: "Order",
                icon: ShoppingCart,
                to: `/own/shop/${shopActive?.name}/order/all`,
            },
            {
                title: "Diagram",
                icon: AutoGraph,
                to: `/own/shop/${shopActive?.name}/setting`,
            },
            {
                title: "Setting",
                icon: Settings,
                to: `/own/shop/${shopActive?.name}/setting`,
            },
        ],
        [shopActive]
    );
    const handleClickIconUser = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMenuUser(event.currentTarget);
    };

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    useEffect(() => {
        if (userState) {
            instance.get("/own/shop/all").then((res) => {
                if (res.data.length > 0) {
                    setShops(res.data);
                    return setShopActive(res.data[0]);
                }
            });
        }
    }, [userState]);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position="fixed" open={openDrawer}>
                <Toolbar
                    sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 3,
                                ...(openDrawer && { display: "none" }),
                            }}>
                            <MenuIcon />
                        </IconButton>

                        <Box>
                            <Button
                                onClick={handleOpenMenuShops}
                                sx={{ color: "white" }}
                                endIcon={<ArrowDropDown />}>
                                {shopActive ? shopActive.name : "Your Shop"}
                            </Button>
                            <Menu
                                anchorEl={anchorElMenuShops}
                                open={openMenuShops}
                                handleClose={handleCloseMenuShops}
                                menu={{
                                    list: shops
                                        ? shops.map((shop) => ({
                                              title: shop.name,
                                              to: `/shop/${shop.name}/overview`,
                                              handleClick: () =>
                                                  setShopActive(shop),
                                              divider: true,
                                          }))
                                        : [],
                                }}
                            />
                        </Box>
                    </Box>
                    <Box>
                        <IconButton size="large" onClick={handleClickIconUser}>
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                }}
                                src={userState?.avatar}
                            />
                        </IconButton>
                        {menuUser && (
                            <Menu
                                anchorEl={anchorElMenuUser}
                                open={openMenuUser}
                                handleClose={handleCloseMenuUser}
                                menu={menuUser}
                            />
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={openDrawer}>
                <DrawerHeader>
                    <Link to="/">
                        <Logo>Feane</Logo>
                    </Link>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? (
                            <ChevronRight />
                        ) : (
                            <ChevronLeft />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {ownLinks.map((link, index) => (
                        <ListItem
                            key={index}
                            disablePadding
                            sx={{ display: "block" }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: openDrawer
                                        ? "initial"
                                        : "center",
                                    px: 2.5,
                                }}
                                component={Link}
                                to={link.to}
                                disabled={!shopActive}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: openDrawer ? 3 : "auto",
                                        justifyContent: "center",
                                    }}>
                                    <link.icon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={link.title}
                                    sx={{ opacity: openDrawer ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding sx={{ display: "block" }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: openDrawer
                                    ? "initial"
                                    : "center",
                                px: 2.5,
                            }}
                            component={Link}
                            to="/shop/register">
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: openDrawer ? 3 : "auto",
                                    justifyContent: "center",
                                }}>
                                <AppRegistration />
                            </ListItemIcon>
                            <ListItemText
                                primary="Register"
                                sx={{ opacity: openDrawer ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pt: 3,
                    backgroundColor: "var(--background-color)",
                    minHeight: "100vh",
                }}>
                <DrawerHeader />
                <ShopContext.Provider
                    value={{
                        shops,
                        shopActive,
                        setShops,
                        setShopActive,
                    }}>
                    {children}
                </ShopContext.Provider>
            </Box>
        </Box>
    );
};

export default OwnLayout;
