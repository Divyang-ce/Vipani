import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token){
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export const addToCart = (productId, quantity = 1) => {
    return API.post("/cart", {
        productId,
        quantity,
    });
};

export const removeCartItem = (productId) => {
    return API.delete(`/cart/${productId}`);
};

export const updateCartItem = (
    productId,
    quantity
) => {
    return API.put(`/cart/${productId}`, {
        quantity,
    });
};

export const getCart = () => {
    return API.get("/cart");
};