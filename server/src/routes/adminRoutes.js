const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    getDashboardStats,
    getLowStockProducts,
    updateStockThreshold,
} = require("../controllers/adminController");

router.get("/dashboard", protect, admin, getDashboardStats);

// Low Stock — nava routes
router.get("/low-stock", protect, admin, getLowStockProducts);
router.put("/products/:id/threshold", protect, admin, updateStockThreshold);

module.exports = router;