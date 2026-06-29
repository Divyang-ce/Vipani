import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../api/wishlistApi";
import { addToCart } from "../api/cartApi";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { cartCount, setCartCount } = useCart();

    useEffect(() => { fetchWishlist(); }, []);

    const fetchWishlist = async () => {
        try {
            const response = await getWishlist();
            setWishlist(response.data.products || []);
        } catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    const handleRemove = async (productId) => {
        try {
            await removeFromWishlist(productId);
            await fetchWishlist();
            toast.success("Removed from wishlist");
        } catch (error) { toast.error("Failed to remove"); }
    };

    const handleMoveToCart = async (productId) => {
        try {
            await addToCart(productId, 1);
            await removeFromWishlist(productId);
            setCartCount(cartCount + 1);
            await fetchWishlist();
            toast.success("Moved to cart!");
        } catch (error) { toast.error("Failed to move to cart"); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-400 animate-pulse">Loading wishlist...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-20 text-center">
                        <p className="text-5xl mb-4">♡</p>
                        <p className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</p>
                        <p className="text-gray-400 mb-6">Save products you love for later</p>
                        <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((product) => (
                            <div key={product._id} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
                                <Link to={`/product/${product._id}`}>
                                    <div className="h-48 bg-gray-100 overflow-hidden">
                                        <img src={`http://localhost:5000/uploads/${product.image?.[0]}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <h2 className="font-semibold text-gray-900 truncate">{product.name}</h2>
                                    <p className="text-indigo-600 font-bold text-lg mt-1">₹{product.price}</p>
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={() => handleMoveToCart(product._id)}
                                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                                            Add to Cart
                                        </button>
                                        <button onClick={() => handleRemove(product._id)}
                                            className="px-3 py-2 rounded-lg border-2 border-gray-200 text-red-400 hover:border-red-400 hover:text-red-500 transition text-sm">
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
export default Wishlist;
