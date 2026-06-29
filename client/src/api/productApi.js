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

export const getProducts = (params = {}) => {
  return API.get("/products", {
    params,
  });
};

export const getProductById = (id) => {
  return API.get(`/products/${id}`);
};

export const deleteProduct = (id) => {
    return API.delete(`/products/${id}`);
};

export const updateProduct = (id, formData) => {
    return API.put(
        `/products/${id}`,
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );
};

export const createProduct = (formData) => {
    return API.post(
        "/products",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );
};

export const addReview = (
  productId,
  reviewData
) => {
  return API.post(
    `/products/${productId}/reviews`,
    reviewData
  );
};