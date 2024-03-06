import { lazy, Suspense } from "react";
import { LayoutProps } from "../components/layout/DefaultLayout";
import UserLayout from "../components/layout/UserLayout";
import ShopLayout from "../components/layout/OwnLayout";

const HomePage = lazy(() => import("../components/pages/HomePage"));
const LoginPage = lazy(() => import("../components/pages/LoginPage"));
const RegisterPage = lazy(() => import("../components/pages/RegisterPage"));
const UserPage = lazy(() => import("../components/pages/User"));
const ShopPage = lazy(() => import("../components/pages/Own"));
const ChatPage = lazy(() => import("../components/pages/ChatPage"));
const OrderPage = lazy(() => import("../components/pages/OrderPage"));
const OneProduct = lazy(() => import("../components/pages/OneProduct"));

type RouteType = {
    name: string;
    path: string;
    component: React.ReactElement;
    layout?: React.ComponentType<LayoutProps> | null;
};

const publicRoutes: RouteType[] = [
    {
        name: "Home",
        path: "/",
        component: (
            <Suspense fallback={<h1>Loading</h1>}>
                <HomePage />
            </Suspense>
        ),
    },
    {
        name: "One Product ",
        path: "/product/:productId",
        component: (
            <Suspense>
                <OneProduct />
            </Suspense>
        ),
    },
    {
        name: "Order",
        path: "/order",
        component: (
            <Suspense>
                <OrderPage />
            </Suspense>
        ),
    },
    {
        name: "Login",
        path: "/login",
        component: (
            <Suspense fallback={<h1>Loading</h1>}>
                <LoginPage />
            </Suspense>
        ),
    },
    {
        name: "Register",
        path: "/register",
        component: (
            <Suspense fallback={<h1>Loading</h1>}>
                <RegisterPage />
            </Suspense>
        ),
    },
    {
        name: "User",
        path: "/user/:username/*",
        component: (
            <Suspense fallback={<h1>Loading</h1>}>
                <UserPage />
            </Suspense>
        ),
        layout: UserLayout,
    },
    {
        name: "Chat",
        path: "/chat",
        component: (
            <Suspense fallback={<h1>Loading</h1>}>
                <ChatPage />
            </Suspense>
        ),
        layout: null,
    },
    {
        name: "Chat",
        path: "/chat/:roomId",
        component: (
            <Suspense fallback={<h1>Loading</h1>}>
                <ChatPage />
            </Suspense>
        ),
        layout: null,
    },
    {
        name: "Shop",
        path: "own/shop/*",
        component: (
            <Suspense fallback={<h1>Loading</h1>}>
                <ShopPage />
            </Suspense>
        ),
        layout: ShopLayout,
    },
];

export default publicRoutes;
