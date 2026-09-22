import axios from "axios";

const API = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:8080/api",
});


/*
========================================
AUTOMATIC LOGOUT WHEN JWT EXPIRES
========================================
*/

const scheduleAutoLogout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {
        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        const expirationTime =
            payload.exp * 1000;

        const remainingTime =
            expirationTime - Date.now();

        if (remainingTime <= 0) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/login";

            return;
        }

        setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/login";
        }, remainingTime);

    } catch (error) {
        console.error(
            "Invalid token:",
            error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    }
};


/*
========================================
REQUEST INTERCEPTOR
========================================
*/

API.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("token");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) =>
        Promise.reject(error)
);


/*
========================================
RESPONSE INTERCEPTOR
========================================
*/

API.interceptors.response.use(
    (response) => response,

    (error) => {

        if (
            error.response?.status === 401
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);


/*
========================================
START EXPIRY TIMER
========================================
*/

scheduleAutoLogout();


export default API;