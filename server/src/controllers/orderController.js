const Order = require("../models/Order");
const Cart = require("../models/Cart");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Coupon = require("../models/Coupon");

const createOrder = async (req, res) => {
    try {

        const { couponCode } = req.body || {};

        const cart = await Cart.findOne({
            user: req.user.userId,
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "cart is empty",
            });
        }

        // Stock Validation
        for (const item of cart.items) {
            if (item.quantity > item.product.stock) {
                return res.status(400).json({
                    message: `Not enough stock for ${item.product.name}`,
                });
            }
        }

        let totalAmount = 0;

        const orderItems = cart.items.map((item) => {
            totalAmount += item.product.price * item.quantity;

            return {
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            };
        });

        let discountAmount = 0;

        // Coupon Logic
        if (couponCode) {

            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                isActive: true,
            });

            if (!coupon) {
                return res.status(400).json({
                    message: "Invalid coupon",
                });
            }

            if (coupon.expiryDate < new Date()) {
                return res.status(400).json({
                    message: "Coupon expired",
                });
            }

            if (coupon.discountType === "percentage") {
                discountAmount =
                    (totalAmount * coupon.discountValue) / 100;
            } else {
                discountAmount =
                    coupon.discountValue;
            }
        }

        // ❗ FIX 1: prevent negative amount
        discountAmount = Math.min(discountAmount, totalAmount);

        const finalAmount = totalAmount - discountAmount;

        const order = await Order.create({
            user: req.user.userId,
            items: orderItems,
            totalAmount,
            discountAmount,
            finalAmount,
        });

        // Reduce Stock
        for (const item of cart.items) {
            item.product.stock -= item.quantity;
            await item.product.save();
        }

        // Clear Cart
        cart.items = [];
        await cart.save();

        return res.status(201).json({
            message: "order placed successfully",
            order,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.userId,
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.product")

        if (!order) {
            return res.status(404).json({
                message: " order not found",
            });
        }

        // security check
        if (
            order.user.toString() !== req.user.userId &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "access denied",
            });
        }

        return res.status(200).json(order);

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const validStatuses = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (
            status === "cancelled" &&
            order.status !== "cancelled"
        ) {

            const Product = require("../models/Product");

            for (const item of order.items) {

                await Product.findByIdAndUpdate(
                    item.product,
                    {
                        $inc: {
                            stock: item.quantity,
                        },
                    }
                );

            }

        }

        order.status = status;

        await order.save();

        return res.status(200).json({
            message: "Order status updated",
            order,
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        });

    }
};

const createPaymentOrder = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        const options = {
            amount: Math.round(order.finalAmount * 100), // paise
            currency: "INR",
            receipt: order._id.toString(),
        };

        const razorpayOrder =
            await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            razorpayOrder,
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        });

    }
};

const verifyPayment = async (req, res) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body.toString())
            .digest("hex");

        if (
            expectedSignature !== razorpay_signature
        ) {
            return res.status(400).json({
                message: "Invalid payment signature",
            });
        }

        const order = await Order.findById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        order.paymentStatus = "paid";
        order.paymentId = razorpay_payment_id;

        await order.save();

        return res.status(200).json({
            message: "Payment verified successfully",
            order,
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        });

    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    createPaymentOrder,
    verifyPayment,

};