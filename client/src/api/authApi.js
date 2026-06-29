import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Register new user — POST /api/auth/register
export const registerUser = (name, email, password) => {
    return API.post("/auth/register", {
        name,
        email,
        password,
    });
};

export const loginUser = (email, password) => {
    return API.post("/auth/login", {
        email,
        password,
    });
};

export const getProfile = () => {
    return API.get("/auth/me", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};

export const updateProfile = (profileData) => {
    return API.put("/auth/profile", profileData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};