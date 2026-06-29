import { useEffect, useState } from "react";
import { getMyOrders, createPaymentOrder, verifyPayment } from "../api/orderApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
};

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const response = await getMyOrders();
            setOrders(response.data);
        } catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    const handlePayment = async (e, orderId) => {
        e.preventDefault(); // prevent Link navigation
        try {
            const response = await createPaymentOrder(orderId);
            const razorpayOrder = response.data.razorpayOrder;
            const options = {
                key: "rzp_test_T4G9B76MUJ2pQ7",
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Vipani",
                description: "Order Payment",
                order_id: razorpayOrder.id,
                handler: async (paymentResponse) => {
                    await verifyPayment(orderId, paymentResponse);
                    toast.success("Payment successful!");
                    fetchOrders();
                },
            };
            new window.Razorpay(options).open();
        } catch (error) {
            toast.error("Payment failed. Please try again.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-400 animate-pulse">Loading orders...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-20 text-center">
                        <p className="text-5xl mb-4">📦</p>
                        <p className="text-xl font-semibold text-gray-700 mb-2">No orders yet</p>
                        <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
                        <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Link to={`/order/${order._id}`} key={order._id}>
                                <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
                                    <div className="flex items-start justify-between flex-wrap gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-gray-600 text-sm mt-1">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-400">Total Amount</p>
                                            <p className="text-xl font-bold text-gray-900">₹{order.finalAmount || order.totalAmount}</p>
                                            {order.discountAmount > 0 && (
                                                <p className="text-green-600 text-xs">Saved ₹{order.discountAmount}</p>
                                            )}
                                        </div>
                                        {order.status === "pending" && (
                                            <button onClick={(e) => handlePayment(e, order._id)}
                                                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
export default MyOrders;
