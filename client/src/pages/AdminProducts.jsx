import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api/productApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";  // Bug fix: import missing hatu

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data.products);
        } catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id);
            toast.success("Product deleted");
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 animate-pulse">Loading products...</p>
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
                <Link to="/admin/products/add"
                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                    + Add Product
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center text-gray-400">No products yet</div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Product</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Category</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Price</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Stock</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={`http://localhost:5000/uploads/${product.image?.[0]}`}
                                                alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                            <span className="font-medium text-gray-900 truncate max-w-40">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">₹{product.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link to={`/admin/products/${product._id}`}
                                                className="text-indigo-600 hover:text-indigo-800 font-medium transition text-xs px-3 py-1 border border-indigo-200 rounded-lg hover:bg-indigo-50">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(product._id)}
                                                className="text-red-500 hover:text-red-700 font-medium transition text-xs px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
export default AdminProducts;
