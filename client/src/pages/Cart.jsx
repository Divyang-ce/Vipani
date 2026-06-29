import { useEffect, useState } from "react";
import { getCart, removeCartItem, updateCartItem } from "../api/cartApi";
import { createOrder } from "../api/orderApi";
import { useCart } from "../context/CartContext";
import { validateCoupon } from "../api/couponApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const { cartCount, setCartCount } = useCart();
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { fetchCart(); }, []);

    const fetchCart = async () => {
        try {
            const response = await getCart();
            setCart(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await removeCartItem(productId);
            setCartCount(Math.max(cartCount - 1, 0));
            fetchCart();
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item");
        }
    };

    const handleQuantityChange = async (productId, quantity) => {
        if (quantity < 1) return;
        try {
            await updateCartItem(productId, quantity);
            await fetchCart();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity");
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) { toast.error("Please enter a coupon code"); return; }
        try {
            const response = await validateCoupon(couponCode);
            const coupon = response.data.coupon;
            let discountAmount = coupon.discountType === "percentage"
                ? (totalAmount * coupon.discountValue) / 100
                : coupon.discountValue;
            setDiscount(discountAmount);
            setCouponApplied(true);
            toast.success(`Coupon applied! You saved ₹${discountAmount}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid coupon code");
        }
    };

    const handleCheckout = async () => {
        try {
            setCheckoutLoading(true);
            await createOrder(couponCode);
            toast.success("Order placed successfully!");
            setCartCount(0);
            await fetchCart();
            navigate("/my-orders");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-400 text-lg animate-pulse">Loading cart...</p>
        </div>
    );

    const totalAmount = cart?.items?.reduce(
        (total, item) => total + item.product.price * item.quantity, 0
    ) || 0;
    const finalAmount = totalAmount - discount;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Cart</h1>

                {cart?.items?.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-20 text-center">
                        <p className="text-6xl mb-4">🛒</p>
                        <p className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</p>
                        <p className="text-gray-400 mb-6">Add some products to get started</p>
                        <a href="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
                            Browse Products
                        </a>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Cart Items */}
                        <div className="flex-1 space-y-4">
                            {cart.items.map((item) => (
                                <div key={item.product._id} className="bg-white rounded-2xl shadow-sm p-5 flex gap-4 items-center">
                                    <img
                                        src={`http://localhost:5000/uploads/${item.product.image?.[0]}`}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-semibold text-gray-900 truncate">{item.product.name}</h2>
                                        <p className="text-indigo-600 font-bold text-lg">₹{item.product.price}</p>
                                        <p className="text-gray-400 text-sm">Subtotal: ₹{item.product.price * item.quantity}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition">−</button>
                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition">+</button>
                                    </div>

                                    <button onClick={() => handleRemove(item.product._id)}
                                        className="text-red-400 hover:text-red-600 transition text-sm font-medium flex-shrink-0">
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-80">
                            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>

                                {/* Coupon */}
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter code"
                                            value={couponCode}
                                            onChange={(e) => {
                                                setCouponCode(e.target.value.toUpperCase());
                                                if (couponApplied) { setDiscount(0); setCouponApplied(false); }
                                            }}
                                            disabled={couponApplied}
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                                        />
                                        <button onClick={handleApplyCoupon} disabled={couponApplied}
                                            className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50">
                                            {couponApplied ? "✓" : "Apply"}
                                        </button>
                                    </div>
                                    {couponApplied && <p className="text-green-600 text-xs mt-1 font-medium">✓ Coupon applied!</p>}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span><span>₹{totalAmount}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600 font-medium">
                                            <span>Discount</span><span>− ₹{discount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-900 font-bold text-lg border-t pt-3">
                                        <span>Total</span><span>₹{finalAmount}</span>
                                    </div>
                                </div>

                                <button onClick={handleCheckout} disabled={checkoutLoading}
                                    className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    {checkoutLoading ? "Placing Order..." : "Proceed to Checkout"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
