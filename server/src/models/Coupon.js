const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },

        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },

        discountValue: {
            type: Number,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        expiryDate: {
            type: Date,
            required: true,
        },

        // Minimum order amount — e.g. ₹500 thhi upar order hoy to j coupon lage
        minOrderAmount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);