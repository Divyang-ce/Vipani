import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../api/productApi";
import { toast } from "react-toastify";  // Bug fix: import missing hatu

function AddProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "", stock: "" });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = new FormData();
            Object.entries(formData).forEach(([k, v]) => data.append(k, v));
            if (image) data.append("image", image);
            await createProduct(data);
            toast.success("Product created successfully!");
            navigate("/admin/products");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create product");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-6 py-10">
                <div className="flex items-center gap-3 mb-8">
                    <Link to="/admin/products" className="text-gray-400 hover:text-gray-600 transition">←</Link>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-400 transition cursor-pointer"
                            onClick={() => document.getElementById("img-input").click()}>
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-xl mx-auto" />
                            ) : (
                                <div>
                                    <p className="text-3xl mb-2">📷</p>
                                    <p className="text-gray-400 text-sm">Click to upload image</p>
                                </div>
                            )}
                        </div>
                        <input id="img-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>

                    {[
                        { label: "Product Name", name: "name", type: "text", placeholder: "e.g. Cotton T-Shirt" },
                        { label: "Price (₹)", name: "price", type: "number", placeholder: "e.g. 499" },
                        { label: "Category", name: "category", type: "text", placeholder: "e.g. Clothing" },
                        { label: "Stock Quantity", name: "stock", type: "number", placeholder: "e.g. 50" },
                    ].map(({ label, name, type, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            <input type={type} name={name} placeholder={placeholder} value={formData[name]} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" placeholder="Product description..." value={formData.description} onChange={handleChange} rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" />
                    </div>

                    <button onClick={handleSubmit} disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                        {loading ? "Creating..." : "Create Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}
export default AddProduct;
