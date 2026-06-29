const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        const recentOrders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        const monthlyRevenue = await Order.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    revenue: { $sum: "$finalAmount" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { "_id.month": 1 } },
        ]);

        const pendingOrders = await Order.countDocuments({ status: "pending" });
        const processingOrders = await Order.countDocuments({ status: "processing" });
        const shippedOrders = await Order.countDocuments({ status: "shipped" });
        const deliveredOrders = await Order.countDocuments({ status: "delivered" });

        // Low stock count pan dashboard stats ma include kariye
        // $expr — MongoDB ma 2 fields compare karvanu — stock < lowStockThreshold
        const lowStockCount = await Product.countDocuments({
            $expr: { $lte: ["$stock", "$lowStockThreshold"] }
        });

        return res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            pendingOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            recentOrders,
            monthlyRevenue,
            lowStockCount,  // navu field
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// ─── LOW STOCK PRODUCTS ───────────────────────────────────────────
// GET /api/admin/low-stock
// Je products nu stock lowStockThreshold thhi ochhu hoy te badha return karo

const getLowStockProducts = async (req, res) => {
    try {
        // MongoDB $expr operator — same document na 2 fields compare kari shake
        // $lte = "less than or equal to"
        // matlab: stock <= lowStockThreshold hoy tevi products
        const products = await Product.find({
            $expr: { $lte: ["$stock", "$lowStockThreshold"] }
        })
        .select("name stock lowStockThreshold category image")  // sirf jaruri fields
        .sort({ stock: 1 });  // sabse ochha stock first

        return res.status(200).json({
            count: products.length,
            products,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// ─── UPDATE LOW STOCK THRESHOLD ───────────────────────────────────
// PUT /api/admin/products/:id/threshold
// Admin specific product no threshold badali shake

const updateStockThreshold = async (req, res) => {
    try {
        const { id } = req.params;
        const { lowStockThreshold } = req.body;

        if (lowStockThreshold < 0) {
            return res.status(400).json({ message: "Threshold cannot be negative" });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { lowStockThreshold },
            { new: true }  // updated document return karo
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Threshold updated",
            product,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats, getLowStockProducts, updateStockThreshold };