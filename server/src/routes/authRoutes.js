const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const { registerUser, loginUser, getMe, updateProfile } = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/passwordController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

// Forgot / Reset Password — no auth needed (user logged out hoy chhe)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;