const express = require('express');
const cors = require("cors");

const app = express();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");
const wishlistRoutes = require("./routes/wishlistRoutes");
const couponRoutes = require("./routes/couponRoutes")

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// use auth routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin",adminRoutes);
app.use("/uploads", express.static(path.join(__dirname,"../uploads")));
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes)


// test route

app.get("/", (req,res) =>{
    res.json({
        success: true,
        message:"E-commerce API Running"
    })
})

module.exports = app;