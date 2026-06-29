import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // emailSent = true thay tyare success message dikhe
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async () => {
        if (!email) { toast.error("Please enter your email"); return; }

        try {
            setLoading(true);
            await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
            setEmailSent(true); // success state
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Email sent thaya pachhi success screen dikho
    if (emailSent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">
                    <div className="text-6xl mb-4">📧</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email!</h2>
                    <p className="text-gray-500 mb-2">
                        We sent a password reset link to
                    </p>
                    <p className="text-indigo-600 font-semibold mb-6">{email}</p>
                    <p className="text-gray-400 text-sm mb-6">
                        Link will expire in <strong>15 minutes</strong>. Check your spam folder too.
                    </p>
                    <Link to="/login"
                        className="inline-block text-indigo-600 font-semibold hover:underline text-sm">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

                <div className="mb-8 text-center">
                    <div className="text-4xl mb-3">🔑</div>
                    <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Enter your email and we'll send you a reset link
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Remember your password?{" "}
                    <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default ForgotPassword;
