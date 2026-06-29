const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    createCoupon,
    getAllCoupons,
    deleteCoupon,
    toggleCoupon,
    validateCoupon,
} = require("../controllers/couponController");

// Admin only routes
router.post("/", protect, admin, createCoupon);
router.get("/", protect, admin, getAllCoupons);
router.delete("/:id", protect, admin, deleteCoupon);
router.put("/:id/toggle", protect, admin, toggleCoupon);

// User route — cart ma coupon validate karvate
router.post("/validate", protect, validateCoupon);

module.exports = router;