const express = require('express');
const cors = require("cors");

const app = express();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require("./routes/orderRoutes");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// use auth routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);



// test route

app.get("/", (req,res) =>{
    res.json({
        success: true,
        message:"E-commerce API Running"
    })
})

module.exports = app;