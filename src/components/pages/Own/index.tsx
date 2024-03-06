import { Routes, Route } from "react-router-dom";

import ShopRegister from "./ShopRegister";
import ShopOverview from "./ShopOverview";
import ShopAllProduct from "./ShopAllProduct";
import ShopSetting from "./ShopSetting";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getUser } from "../../../redux/userReducer";
import ShopCreateProduct from "./ShopCreateProduct";
import ShopEditProduct from "./ShopEditProduct";
import ShopOrder from "./ShopOrder";
import OneProduct from "../OneProduct";
const shopRouters = [
    {
        path: "/register",
        component: <ShopRegister />,
    },
    {
        path: "/:shopName/overview",
        component: <ShopOverview />,
    },
    {
        path: "/:shopName/product/all",
        component: <ShopAllProduct />,
    },
    {
        path: "/:shopName/product/create",
        component: <ShopCreateProduct />,
    },
    {
        path: "/:shopName/order/all",
        component: <ShopOrder />,
    },
    {
        path: "/:shopName/product/:productId",
        component: <OneProduct />,
    },
    {
        path: "/:shopName/product/:productId/edit",
        component: <ShopEditProduct />,
    },
    {
        path: "/:shopName/setting",
        component: <ShopSetting />,
    },
];

const Shop = () => {
    const navigate = useNavigate();
    const userState = useSelector(getUser);
    useEffect(() => {
        if (!userState) {
            return navigate("/login");
        }
        if (!userState.roles?.includes("ROLE_OWNER")) {
            return navigate("/own/shop/register");
        }
    }, [userState]);
    return (
        <Routes>
            {shopRouters.map((route, index) => {
                return (
                    <Route
                        key={index}
                        path={route.path}
                        Component={() => route.component}
                    />
                );
            })}
        </Routes>
    );
};

export default Shop;
