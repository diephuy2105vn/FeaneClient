import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { CookiesProvider } from "react-cookie";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/index.tsx";

window.global = window;
ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
    <ThemeProvider theme={theme}>
        <ReduxProvider store={store}>
            <CookiesProvider>
                <App />
            </CookiesProvider>
        </ReduxProvider>
    </ThemeProvider>
    // </React.StrictMode>
);
