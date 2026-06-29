const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware')
const admin = require('../middleware/adminMiddleware');
const upload = require("../middleware/uploadMiddleware");

const { createProduct, getProducts, getProductsById, updateProduct , deleteProduct, addReview} = require('../controllers/productController');

router.post("/", protect, admin, upload.single("image"), createProduct);
router.get("/", getProducts);
router.post("/:id/reviews", protect, addReview);
router.get("/:id", getProductsById);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);


module.exports = router;