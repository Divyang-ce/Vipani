const crypto = require("crypto");   // Node.js built-in — install karvu nai pade
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

// ─── FORGOT PASSWORD ──────────────────────────────────────────────
// POST /api/auth/forgot-password
// User email mokle → token generate karo → email ma link moklo

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please provide your email" });
        }

        // 1. User chhe ke nai check karo
        const user = await User.findOne({ email });
        if (!user) {
            // Security tip: "user not found" na kaho — attacker ne pata na chale
            return res.status(200).json({
                message: "If this email exists, a reset link has been sent"
            });
        }

        // 2. Secure random token generate karo — crypto module vapariye
        // randomBytes(32) = 32 random bytes → hex string ma convert = 64 character token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // 3. Token DB ma save karo sathe expiry time (15 minutes)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min = 15 * 60 seconds * 1000 ms
        await user.save();

        // 4. Reset link banavo — frontend URL + token
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // 5. Email moklo — HTML template sathe
        await sendEmail({
            to: user.email,
            subject: "Vipani — Password Reset Request",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                    <h2 style="color: #4f46e5;">Password Reset Request</h2>
                    <p>Hi <strong>${user.name}</strong>,</p>
                    <p>We received a request to reset your Vipani account password.</p>
                    <p>Click the button below to reset your password. This link will expire in <strong>15 minutes</strong>.</p>
                    <a href="${resetUrl}"
                       style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
                        Reset Password
                    </a>
                    <p style="color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #aaa; font-size: 12px;">Vipani · This link expires in 15 minutes</p>
                </div>
            `,
        });

        return res.status(200).json({
            message: "Password reset link sent to your email"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// ─── RESET PASSWORD ───────────────────────────────────────────────
// POST /api/auth/reset-password/:token
// User navu password mokle → token verify karo → password update karo

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Please provide a new password" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // 1. Token vaali user shodo — ane check karo ke expire nai thayo hoy
        // $gt: Date.now() = "expire time abhi nu time thhi motu chhe" = valid token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset link. Please request a new one."
            });
        }

        // 2. Navu password hash karo — plain text kabhi store nai karvo
        user.password = await bcrypt.hash(password, 10);

        // 3. Token fields clear karo — ek vaar vaparaya pachhi delete
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        await user.save();

        return res.status(200).json({
            message: "Password reset successful! You can now login."
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { forgotPassword, resetPassword };