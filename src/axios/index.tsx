import axios from "axios";

const instance = axios.create({
    withCredentials: true,
    baseURL: "https://feaneserver-production.up.railway.app/api/",
});

export default instance;
