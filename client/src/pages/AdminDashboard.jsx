import { useEffect, useState } from "react";
import { getDashboardStats, getLowStockProducts, updateStockThreshold } from "../api/adminApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const PIE_COLORS = ["#f59e0b", "#6366f1", "#8b5cf6", "#10b981"];

function StatCard({ label, value, icon, alert }) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 ${alert ? "border-2 border-red-300" : ""}`}>
            <div className="text-3xl">{icon}</div>
            <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className={`text-2xl font-bold ${alert ? "text-red-600" : "text-gray-900"}`}>{value}</p>
            </div>
        </div>
    );
}

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loadingLowStock, setLoadingLowStock] = useState(true);

    // Threshold edit karvano state — kya product edit kari rahya chhe
    const [editingThreshold, setEditingThreshold] = useState(null);
    const [newThreshold, setNewThreshold] = useState("");

    useEffect(() => {
        getDashboardStats().then(r => setStats(r.data)).catch(console.log);
        fetchLowStock();
    }, []);

    const fetchLowStock = async () => {
        try {
            setLoadingLowStock(true);
            const response = await getLowStockProducts();
            setLowStockProducts(response.data.products);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingLowStock(false);
        }
    };

    const handleThresholdUpdate = async (productId) => {
        if (!newThreshold && newThreshold !== 0) {
            toast.error("Please enter a threshold value");
            return;
        }
        try {
            await updateStockThreshold(productId, Number(newThreshold));
            toast.success("Threshold updated!");
            setEditingThreshold(null);
            setNewThreshold("");
            fetchLowStock();
        } catch (error) {
            toast.error("Failed to update threshold");
        }
    };

    if (!stats) return (
        <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 animate-pulse">Loading dashboard...</p>
        </div>
    );

    const revenueData = stats?.monthlyRevenue?.map(item => ({
        month: `Month ${item._id.month}`,
        revenue: item.revenue,
    })) || [];

    const statusData = [
        { name: "Pending", value: stats.pendingOrders },
        { name: "Processing", value: stats.processingOrders },
        { name: "Shipped", value: stats.shippedOrders },
        { name: "Delivered", value: stats.deliveredOrders },
    ].filter(d => d.value > 0);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="flex gap-3">
                    <Link to="/admin/orders" className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                        Orders
                    </Link>
                    <Link to="/admin/coupons" className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                        Coupons
                    </Link>
                    <Link to="/admin/products" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                        Products
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Users" value={stats.totalUsers} icon="👤" />
                <StatCard label="Total Products" value={stats.totalProducts} icon="📦" />
                <StatCard label="Total Orders" value={stats.totalOrders} icon="🛒" />
                <StatCard label="Total Revenue" value={`₹${stats.totalRevenue?.toLocaleString()}`} icon="💰" />
            </div>

            {/* Low Stock Alert Banner — stats ma lowStockCount > 0 hoy to j dikhe */}
            {stats.lowStockCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="font-semibold text-red-700">
                            {stats.lowStockCount} product{stats.lowStockCount > 1 ? "s are" : " is"} running low on stock!
                        </p>
                        <p className="text-red-500 text-sm">Check the Low Stock section below and restock soon.</p>
                    </div>
                </div>
            )}

            {/* Order Status Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Pending", value: stats.pendingOrders, color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
                    { label: "Processing", value: stats.processingOrders, color: "bg-blue-50 border-blue-200 text-blue-700" },
                    { label: "Shipped", value: stats.shippedOrders, color: "bg-purple-50 border-purple-200 text-purple-700" },
                    { label: "Delivered", value: stats.deliveredOrders, color: "bg-green-50 border-green-200 text-green-700" },
                ].map(({ label, value, color }) => (
                    <div key={label} className={`border rounded-2xl p-4 ${color}`}>
                        <p className="text-xs font-medium opacity-70">{label}</p>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Revenue</h2>
                    {revenueData.length === 0 ? (
                        <div className="flex items-center justify-center h-48 text-gray-400">No revenue data yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(v) => `₹${v}`} />
                                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status</h2>
                    {statusData.length === 0 ? (
                        <div className="flex items-center justify-center h-48 text-gray-400">No orders yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* ⚠️ LOW STOCK SECTION */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900">⚠️ Low Stock Products</h2>
                        {lowStockProducts.length > 0 && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                                {lowStockProducts.length}
                            </span>
                        )}
                    </div>
                    <Link to="/admin/products"
                        className="text-indigo-600 text-sm font-medium hover:underline">
                        Manage All Products →
                    </Link>
                </div>

                {loadingLowStock ? (
                    <p className="text-gray-400 text-center py-8 animate-pulse">Checking stock levels...</p>
                ) : lowStockProducts.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-3xl mb-2">✅</p>
                        <p className="text-gray-500 font-medium">All products have sufficient stock!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {lowStockProducts.map((product) => (
                            <div key={product._id}
                                className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">

                                {/* Product Image */}
                                <img
                                    src={`http://localhost:5000/uploads/${product.image?.[0]}`}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                                />

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                                    <p className="text-gray-400 text-sm">{product.category}</p>
                                </div>

                                {/* Stock Badge */}
                                <div className="text-center flex-shrink-0">
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                                        product.stock === 0
                                            ? "bg-red-200 text-red-700"
                                            : "bg-orange-100 text-orange-700"
                                    }`}>
                                        {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
                                    </span>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Alert at ≤{product.lowStockThreshold}
                                    </p>
                                </div>

                                {/* Threshold Edit */}
                                <div className="flex-shrink-0">
                                    {editingThreshold === product._id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={newThreshold}
                                                onChange={(e) => setNewThreshold(e.target.value)}
                                                placeholder="New threshold"
                                                className="w-28 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                min="0"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleThresholdUpdate(product._id)}
                                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                                                Save
                                            </button>
                                            <button
                                                onClick={() => { setEditingThreshold(null); setNewThreshold(""); }}
                                                className="text-gray-400 hover:text-gray-600 text-sm px-2 py-1.5">
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingThreshold(product._id);
                                                    setNewThreshold(product.lowStockThreshold);
                                                }}
                                                className="text-gray-500 hover:text-indigo-600 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:border-indigo-300 transition">
                                                Set Alert
                                            </button>
                                            <Link
                                                to={`/admin/products/${product._id}`}
                                                className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium">
                                                Restock
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
                {stats.recentOrders?.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No recent orders</p>
                ) : (
                    <div className="space-y-3">
                        {stats.recentOrders?.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-medium text-gray-900">{order.user?.name}</p>
                                    <p className="text-gray-400 text-xs font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">₹{order.finalAmount}</p>
                                    <span className="text-xs capitalize text-gray-400">{order.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
