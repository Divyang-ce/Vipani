import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/orderApi";

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];
const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
};

function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        getOrderById(id).then(r => setOrder(r.data)).catch(console.log);
    }, []);

    if (!order) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-400 animate-pulse">Loading order...</p>
        </div>
    );

    const currentStep = STATUS_STEPS.indexOf(order.status);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <Link to="/my-orders" className="text-indigo-600 text-sm font-medium hover:underline mb-6 inline-block">
                    ← Back to Orders
                </Link>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                        <p className="text-gray-400 text-sm font-mono mt-1">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <span className={`text-sm font-semibold px-4 py-2 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                    </span>
                </div>

                {/* Order Progress Tracker */}
                {order.status !== "cancelled" && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                        <h2 className="text-sm font-semibold text-gray-700 mb-5">Order Progress</h2>
                        <div className="flex items-center">
                            {STATUS_STEPS.map((step, i) => (
                                <div key={step} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${i <= currentStep ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"}`}>
                                            {i < currentStep ? "✓" : i + 1}
                                        </div>
                                        <span className={`text-xs mt-1 capitalize font-medium ${i <= currentStep ? "text-indigo-600" : "text-gray-400"}`}>
                                            {step}
                                        </span>
                                    </div>
                                    {i < STATUS_STEPS.length - 1 && (
                                        <div className={`flex-1 h-1 mx-2 rounded ${i < currentStep ? "bg-indigo-600" : "bg-gray-200"}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Order Items */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Items Ordered</h2>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item._id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                                <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={`http://localhost:5000/uploads/${item.product?.image?.[0]}`}
                                        alt={item.product?.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{item.product?.name}</p>
                                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-gray-900">₹{item.price}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Summary */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Price Summary</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Original Total</span><span>₹{order.totalAmount}</span>
                        </div>
                        {order.discountAmount > 0 && (
                            <div className="flex justify-between text-green-600 font-medium">
                                <span>Discount Applied</span><span>− ₹{order.discountAmount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-900 font-bold text-xl border-t pt-3 mt-3">
                            <span>Final Amount</span><span>₹{order.finalAmount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default OrderDetails;
