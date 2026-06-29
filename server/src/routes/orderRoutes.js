const express = require('express');
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const { createOrder, 
    getMyOrders, 
    getOrderById, 
    getAllOrders, 
    updateOrderStatus, 
    createPaymentOrder, 
    verifyPayment } = require("../controllers/orderController");

router.post("/", protect, createOrder);
router.post("/:id/payment", protect, createPaymentOrder);
router.post("/:id/verify-payment", protect, verifyPayment)
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id", protect, admin, updateOrderStatus);


module.exports = router;