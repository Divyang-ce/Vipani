const Coupon = require("../models/Coupon");

// ─── CREATE COUPON ────────────────────────────────────────────────
// POST /api/coupons
const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, expiryDate, minOrderAmount } = req.body;

        if (!code || !discountType || !discountValue || !expiryDate) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check duplicate code
        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        // Validation — percentage 1-100 hovu joiye
        if (discountType === "percentage" && (discountValue < 1 || discountValue > 100)) {
            return res.status(400).json({ message: "Percentage must be between 1 and 100" });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            expiryDate,
            minOrderAmount: minOrderAmount || 0,
        });

        return res.status(201).json({ message: "Coupon created", coupon });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─── GET ALL COUPONS ──────────────────────────────────────────────
// GET /api/coupons — Admin ne badha coupons dikhe (active + inactive)
const getAllCoupons = async (req, res) => {
    try {
        // Sort — sabse nava pehla
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return res.status(200).json(coupons);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─── DELETE COUPON ────────────────────────────────────────────────
// DELETE /api/coupons/:id
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        return res.status(200).json({ message: "Coupon deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─── TOGGLE COUPON (Active/Inactive) ─────────────────────────────
// PUT /api/coupons/:id/toggle
// isActive = true hoy to false karo, false hoy to true karo
const toggleCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        // Boolean flip — ! operator
        coupon.isActive = !coupon.isActive;
        await coupon.save();

        return res.status(200).json({
            message: `Coupon ${coupon.isActive ? "activated" : "deactivated"}`,
            coupon,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─── VALIDATE COUPON (User) ───────────────────────────────────────
// POST /api/coupons/validate
const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
        });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid coupon code" });
        }

        // Expiry check — expiryDate past ma chhe to expired
        if (coupon.expiryDate < new Date()) {
            return res.status(400).json({ message: "Coupon has expired" });
        }

        return res.status(200).json({ message: "Coupon valid", coupon });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { createCoupon, getAllCoupons, deleteCoupon, toggleCoupon, validateCoupon };