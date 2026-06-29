import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById, updateProduct } from "../api/productApi";
import { toast } from "react-toastify";  // Bug fix: import missing hatu

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "", stock: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProductById(id).then(r => {
            const p = r.data;
            setFormData({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock });
        }).catch(console.log);
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateProduct(id, formData);
            toast.success("Product updated!");
            navigate("/admin/products");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-6 py-10">
                <div className="flex items-center gap-3 mb-8">
                    <Link to="/admin/products" className="text-gray-400 hover:text-gray-600 transition">←</Link>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
                    {[
                        { label: "Product Name", name: "name", type: "text" },
                        { label: "Price (₹)", name: "price", type: "number" },
                        { label: "Category", name: "category", type: "text" },
                        { label: "Stock Quantity", name: "stock", type: "number" },
                    ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            <input type={type} name={name} value={formData[name]} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" />
                    </div>
                    <button onClick={handleSubmit} disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
export default EditProduct;
