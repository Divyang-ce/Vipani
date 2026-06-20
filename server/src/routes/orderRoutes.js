const express = require('express');
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require("../controllers/orderController");

router.post("/",protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/",protect, admin ,getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id",protect, admin, updateOrderStatus);


module.exports = router;