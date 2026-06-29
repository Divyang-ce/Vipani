import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

// User — cart ma coupon validate karvate
export const validateCoupon = (code) => {
    return API.post("/coupons/validate", { code });
};

// Admin — badha coupons fetch karvate
export const getAllCoupons = () => {
    return API.get("/coupons");
};

// Admin — navo coupon banavavate
export const createCoupon = (data) => {
    return API.post("/coupons", data);
};

// Admin — coupon delete karvate
export const deleteCoupon = (id) => {
    return API.delete(`/coupons/${id}`);
};

// Admin — coupon active/inactive toggle karvate
export const toggleCoupon = (id) => {
    return API.put(`/coupons/${id}/toggle`);
};