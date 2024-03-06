import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyle from "./components/styles/GlobalStyle";
import DefaultLayout, { LayoutProps } from "./components/layout/DefaultLayout";
import publicRoutes from "./constants/routes";
import { useCookies } from "react-cookie";
import { Fragment, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshUser } from "./redux/userReducer";
import { AppDispatch } from "./redux";

function App() {
    const [cookies] = useCookies();
    const dispatch: AppDispatch = useDispatch();
    useLayoutEffect(() => {
        const handleRefreshUser = async () => {
            if (cookies.accessToken) {
                await dispatch(refreshUser());
            }
        };
        handleRefreshUser();
    }, []);

    return (
        <>
            <GlobalStyle />
            <BrowserRouter>
                <Routes>
                    {publicRoutes.map((route, index) => {
                        let Layout: React.ComponentType<LayoutProps> =
                            DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        }
                        if (route.layout === null) {
                            Layout = Fragment;
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                Component={() => (
                                    <Layout>{route.component}</Layout>
                                )}
                            />
                        );
                    })}
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
