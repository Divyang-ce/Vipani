import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCart } from "../api/cartApi";
import { useCart } from "../context/CartContext";

function Navbar() {
    const { cartCount, setCartCount } = useCart();
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem("role") === "admin");

    // 👇 Key fix: "authChange" event listen karo — login/logout thay tyare instantly update thay
    useEffect(() => {
        const handleAuthChange = () => {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");
            setIsLoggedIn(!!token);
            setIsAdmin(role === "admin");
            if (token) fetchCartCount();
            else setCartCount(0);
        };

        // Login.jsx / Register.jsx ma authChange dispatch thay chhe
        window.addEventListener("authChange", handleAuthChange);

        // Cleanup — memory leak thi bachavase
        return () => window.removeEventListener("authChange", handleAuthChange);
    }, []);

    useEffect(() => {
        if (isLoggedIn) fetchCartCount();
    }, [isLoggedIn]);

    const fetchCartCount = async () => {
        try {
            const response = await getCart();
            const count = response.data.items.reduce(
                (total, item) => total + item.quantity, 0
            );
            setCartCount(count);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setIsAdmin(false);
        setCartCount(0);

        // Logout pan authChange fire karo (agar koi bijo component listen kare to)
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
                    <span className="text-indigo-600">Vipani</span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition">
                        Home
                    </Link>

                    {isLoggedIn && (
                        <>
                            <Link to="/cart" className="relative text-gray-600 hover:text-gray-900 font-medium transition">
                                Cart
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <Link to="/wishlist" className="text-gray-600 hover:text-gray-900 font-medium transition">
                                Wishlist
                            </Link>

                            <Link to="/my-orders" className="text-gray-600 hover:text-gray-900 font-medium transition">
                                My Orders
                            </Link>

                            <Link to="/profile" className="text-gray-600 hover:text-gray-900 font-medium transition">
                                Profile
                            </Link>

                            {isAdmin && (
                                <Link to="/admin/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium transition">
                                    Admin
                                </Link>
                            )}

                            <button onClick={handleLogout}
                                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition">
                                Logout
                            </button>
                        </>
                    )}

                    {!isLoggedIn && (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition">
                                Login
                            </Link>
                            <Link to="/register"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
