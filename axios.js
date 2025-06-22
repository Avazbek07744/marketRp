import axios from "axios";

const lord = axios.create({
    baseURL: "http://109.199.108.248:5000",
});

lord.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = {
                ...config.headers, // mavjud headerlar yo‘qolmasin
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default lord;
