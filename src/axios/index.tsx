import axios from "axios";
import { Cookies } from "react-cookie";

const instance = axios.create({
    baseURL: "http://localhost:8080/api/",
});

instance.interceptors.request.use(
    function (config) {
        const cookies = new Cookies();
        const refreshToken = cookies.get("refreshToken");

        if (refreshToken) {
            config.headers["Authorization"] = `Bearer ${refreshToken}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default instance;
