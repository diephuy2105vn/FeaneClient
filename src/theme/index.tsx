import { createTheme } from "@mui/material";
import "@fontsource-variable/ysabeau-infant";
import "@fontsource/roboto";
import "@fontsource-variable/dancing-script";
const theme = createTheme({
    typography: {
        fontFamily: "Ysabeau Infant variable, Arial",
        fontWeightLight: "500",
        fontWeightRegular: "600",
        fontWeightMedium: "700",
        fontWeightBold: "800",
    },
    palette: {
        primary: {
            main: "#936dcb",
            contrastText: "#fff",
        },
        secondary: {
            main: "#f3917b",
            contrastText: "#fff",
        },
    },
    components: {
        MuiTextField: {
            defaultProps: {
                margin: "dense",
            },
        },
    },
});

export default theme;
