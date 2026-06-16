const express = require('express');
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// test route

app.get("/", (req,res) =>{
    res.json({
        success: true,
        message:"E-commerce API Running"
    })
})

module.exports = app;