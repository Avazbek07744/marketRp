import axios from "axios";
import Cookies from "js-cookie";

const lord = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

lord.interceptors.request.use(
    (config) => {
        const token = typeof window !== "undefined" ? Cookies.get("token") : null;
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default lord;
