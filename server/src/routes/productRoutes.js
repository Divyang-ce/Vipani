const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware')
const admin = require('../middleware/adminMiddleware')

const { createProduct, getProducts, getProductsById, updateProduct , deleteProduct} = require('../controllers/productController');

router.post("/", protect, admin, createProduct);
router.get("/", getProducts);
router.get("/:id", getProductsById);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;