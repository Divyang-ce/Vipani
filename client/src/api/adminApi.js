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

export const getDashboardStats = () => {
    return API.get("/admin/dashboard");
};

export const getAllOrders = () => {
    return API.get("/order");
};

export const updateOrderStatus = (orderId, status) => {
    return API.put(`/order/${orderId}`, {
        status,
    });
};
// Low Stock APIs
export const getLowStockProducts = () => {
    return API.get("/admin/low-stock");
};

export const updateStockThreshold = (productId, lowStockThreshold) => {
    return API.put(`/admin/products/${productId}/threshold`, { lowStockThreshold });
};