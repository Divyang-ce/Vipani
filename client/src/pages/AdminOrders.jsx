import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../api/adminApi";
import { toast } from "react-toastify";  // Bug fix: import missing hatu

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
};

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const response = await getAllOrders();
            setOrders(response.data);
        } catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            toast.success("Order status updated!");
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 animate-pulse">Loading orders...</p>
        </div>
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center text-gray-400">No orders yet</div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl shadow-sm p-5">
                            <div className="flex items-start justify-between flex-wrap gap-3">
                                <div>
                                    <p className="font-mono text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
                                    <p className="font-semibold text-gray-900 mt-1">{order.user?.name}</p>
                                    <p className="text-gray-400 text-sm">{order.items.length} items · ₹{order.finalAmount || order.totalAmount}</p>
                                </div>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-500"}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <label className="text-sm font-medium text-gray-700 mr-3">Update Status:</label>
                                <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                                    {["pending","processing","shipped","delivered","cancelled"].map(s => (
                                        <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default AdminOrders;
