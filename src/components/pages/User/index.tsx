import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import Friends from "./Friends";
import { useSelector } from "react-redux";
import { getUser } from "../../../redux/userReducer";
import { useNavigate } from "react-router-dom";
import Orders from "./Orders";

const userRouter = [
    {
        path: "/",
        component: <Profile />,
    },
    {
        path: "/friends",
        component: <Friends />,
    },
    {
        path: "/orders",
        component: <Orders />,
    },
];

const User = () => {
    const userState = useSelector(getUser);
    const navigate = useNavigate();
    useEffect(() => {
        if (!userState) {
            navigate("/");
        }
    }, []);

    return (
        <Routes>
            {userRouter.map((route, index) => {
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

export default User;
