import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {

    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export const addToWishlist = (productId) => {
    return API.post(`/wishlist/${productId}`);
};

export const getWishlist = () => {
    return API.get("/wishlist");
};

export const removeFromWishlist = (productId) => {
    return API.delete(`/wishlist/${productId}`);
};