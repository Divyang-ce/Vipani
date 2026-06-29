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

export const createOrder = (couponCode = "") => {
    return API.post("/order", {
        couponCode,
    });
};

export const getMyOrders = () => {
    return API.get("/order/my-orders");
};

export const getOrderById = (id) => {
    return API.get(`/order/${id}`);
};

export const createPaymentOrder = (orderId) => {
    return API.post(`/order/${orderId}/payment`);
};

export const verifyPayment = (orderId, paymentData) => {
    return API.post(
        `/order/${orderId}/verify-payment`,
        paymentData
    );
};

export const getAllOrders = () => {
    return API.get("/order");
};

export const updateOrderStatus = (
    orderId,
    status
) => {
    return API.put(
        `/order/${orderId}`,
        { status }
    );
};