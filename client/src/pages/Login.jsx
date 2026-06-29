import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { toast } from "react-toastify";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) { toast.error("Please fill in all fields"); return; }
        try {
            setLoading(true);
            const response = await loginUser(email, password);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            window.dispatchEvent(new Event("authChange"));
            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2 text-sm">Login to your Vipani account</p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" placeholder="Enter your email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" placeholder="Enter your password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>

                {/* Forgot Password link — password field ni niche */}
                <div className="text-right mb-6">
                    <Link to="/forgot-password"
                        className="text-sm text-indigo-600 hover:underline font-medium">
                        Forgot Password?
                    </Link>
                </div>

                <button onClick={handleLogin} disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}
export default Login;
