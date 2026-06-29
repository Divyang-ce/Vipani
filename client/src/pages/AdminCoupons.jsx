import { useEffect, useState } from "react";
import { getAllCoupons, createCoupon, deleteCoupon, toggleCoupon } from "../api/couponApi";
import { toast } from "react-toastify";

// Helper — date string thhi readable format
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
    });
};

// Helper — coupon expire thayo chhe ke nai
const isExpired = (dateStr) => new Date(dateStr) < new Date();

function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        expiryDate: "",
        minOrderAmount: "",
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => { fetchCoupons(); }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const response = await getAllCoupons();
            setCoupons(response.data);
        } catch (error) {
            toast.error("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        if (!formData.code || !formData.discountValue || !formData.expiryDate) {
            toast.error("Please fill all required fields");
            return;
        }
        try {
            setCreating(true);
            await createCoupon({
                ...formData,
                // code uppercase ma — backend pan kare chhe but frontend thhi pan karo
                code: formData.code.toUpperCase(),
                discountValue: Number(formData.discountValue),
                minOrderAmount: Number(formData.minOrderAmount) || 0,
            });
            toast.success("Coupon created!");
            // Form reset
            setFormData({ code: "", discountType: "percentage", discountValue: "", expiryDate: "", minOrderAmount: "" });
            setShowForm(false);
            fetchCoupons();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create coupon");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id, code) => {
        if (!window.confirm(`Delete coupon "${code}"?`)) return;
        try {
            await deleteCoupon(id);
            toast.success("Coupon deleted");
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to delete coupon");
        }
    };

    const handleToggle = async (id, currentStatus) => {
        try {
            await toggleCoupon(id);
            // Optimistic update — API call na response ni wait kiya vagar UI update karo
            // paghi fetchCoupons() thhi actual data aavse
            toast.success(`Coupon ${currentStatus ? "deactivated" : "activated"}`);
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to update coupon");
        }
    };

    // Today ni date — min date for expiry input
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
                    <p className="text-gray-400 text-sm mt-1">{coupons.length} total coupons</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                    {showForm ? "✕ Cancel" : "+ Create Coupon"}
                </button>
            </div>

            {/* Create Coupon Form */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border-2 border-indigo-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-5">New Coupon</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Coupon Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="code"
                                placeholder="e.g. SAVE20"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>

                        {/* Discount Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discount Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>

                        {/* Discount Value */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discount Value <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400 font-medium">
                                    {formData.discountType === "percentage" ? "%" : "₹"}
                                </span>
                                <input
                                    type="number"
                                    name="discountValue"
                                    placeholder={formData.discountType === "percentage" ? "e.g. 20" : "e.g. 100"}
                                    value={formData.discountValue}
                                    onChange={handleChange}
                                    min="1"
                                    max={formData.discountType === "percentage" ? "100" : undefined}
                                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                />
                            </div>
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                min={today}  // Past date select na thay
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>

                        {/* Min Order Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min Order Amount <span className="text-gray-400">(optional)</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400 font-medium">₹</span>
                                <input
                                    type="number"
                                    name="minOrderAmount"
                                    placeholder="e.g. 500"
                                    value={formData.minOrderAmount}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                />
                            </div>
                            <p className="text-gray-400 text-xs mt-1">Leave 0 for no minimum</p>
                        </div>

                    </div>

                    {/* Preview */}
                    {formData.code && formData.discountValue && (
                        <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                            <p className="text-sm text-indigo-700">
                                <span className="font-mono font-bold">{formData.code || "CODE"}</span>
                                {" — "}
                                {formData.discountType === "percentage"
                                    ? `${formData.discountValue}% off`
                                    : `₹${formData.discountValue} off`}
                                {formData.minOrderAmount > 0 && ` on orders above ₹${formData.minOrderAmount}`}
                                {formData.expiryDate && ` · Expires ${formatDate(formData.expiryDate)}`}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleCreate}
                        disabled={creating}
                        className="mt-5 w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                        {creating ? "Creating..." : "Create Coupon"}
                    </button>
                </div>
            )}

            {/* Coupons List */}
            {loading ? (
                <div className="text-center py-20 text-gray-400 animate-pulse">Loading coupons...</div>
            ) : coupons.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-20 text-center">
                    <p className="text-5xl mb-4">🎟️</p>
                    <p className="text-xl font-semibold text-gray-700 mb-2">No coupons yet</p>
                    <p className="text-gray-400">Click "Create Coupon" to add your first one</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {coupons.map((coupon) => {
                        const expired = isExpired(coupon.expiryDate);

                        return (
                            <div key={coupon._id}
                                className={`bg-white rounded-2xl shadow-sm p-5 border-2 transition ${
                                    expired ? "border-gray-200 opacity-60"
                                    : coupon.isActive ? "border-green-200"
                                    : "border-gray-200"
                                }`}>

                                {/* Top row — Code + Status */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xl font-bold font-mono text-gray-900 tracking-wide">
                                            {coupon.code}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-0.5">
                                            Created {formatDate(coupon.createdAt)}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                        expired ? "bg-gray-100 text-gray-500"
                                        : coupon.isActive ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-600"
                                    }`}>
                                        {expired ? "Expired" : coupon.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                {/* Discount Info */}
                                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                    <p className="text-2xl font-bold text-indigo-600">
                                        {coupon.discountType === "percentage"
                                            ? `${coupon.discountValue}% OFF`
                                            : `₹${coupon.discountValue} OFF`}
                                    </p>
                                    {coupon.minOrderAmount > 0 && (
                                        <p className="text-gray-500 text-xs mt-1">
                                            Min order: ₹{coupon.minOrderAmount}
                                        </p>
                                    )}
                                </div>

                                {/* Expiry */}
                                <p className={`text-sm mb-4 font-medium ${expired ? "text-red-500" : "text-gray-500"}`}>
                                    {expired ? "⚠️ Expired on" : "📅 Expires"} {formatDate(coupon.expiryDate)}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {/* Toggle — expired coupon toggle na kari shake */}
                                    {!expired && (
                                        <button
                                            onClick={() => handleToggle(coupon._id, coupon.isActive)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition border-2 ${
                                                coupon.isActive
                                                    ? "border-orange-200 text-orange-600 hover:bg-orange-50"
                                                    : "border-green-200 text-green-600 hover:bg-green-50"
                                            }`}>
                                            {coupon.isActive ? "Deactivate" : "Activate"}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(coupon._id, coupon.code)}
                                        className="flex-1 py-2 rounded-lg text-sm font-medium border-2 border-red-200 text-red-500 hover:bg-red-50 transition">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AdminCoupons;
