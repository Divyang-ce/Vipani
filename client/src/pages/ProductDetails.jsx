import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById, addReview } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { addToWishlist } from "../api/wishlistApi";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";  // Bug fix: import missing hatu

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { cartCount, setCartCount } = useCart();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => { fetchProduct(); }, []);

    const fetchProduct = async () => {
        try {
            const response = await getProductById(id);
            setProduct(response.data);
        } catch (error) { console.log(error); }
    };

    const handleAddToCart = async () => {
        try {
            await addToCart(product._id, 1);
            setCartCount(cartCount + 1);
            toast.success("Added to cart!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    };

    const handleWishlist = async () => {
        try {
            await addToWishlist(product._id);
            toast.success("Added to wishlist!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add to wishlist");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await addReview(product._id, { rating, comment });
            toast.success("Review submitted!");
            setRating(5); setComment("");
            fetchProduct();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        }
    };

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-400 animate-pulse">Loading product...</p>
        </div>
    );

    const stars = (count) => "★".repeat(count) + "☆".repeat(5 - count);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Product Top Section */}
                <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col lg:flex-row gap-10">

                    {/* Images */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-gray-100 rounded-xl overflow-hidden h-80">
                            <img
                                src={`http://localhost:5000/uploads/${product.image?.[activeImage]}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.image?.length > 1 && (
                            <div className="flex gap-2 mt-3">
                                {product.image.map((img, i) => (
                                    <button key={i} onClick={() => setActiveImage(i)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${activeImage === i ? "border-indigo-500" : "border-transparent"}`}>
                                        <img src={`http://localhost:5000/uploads/${img}`} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                            {product.category}
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900 mt-3">{product.name}</h1>

                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-yellow-400 text-lg">{stars(Math.round(product.averageRating || 0))}</span>
                            <span className="text-gray-500 text-sm">{product.averageRating?.toFixed(1) || "0"} ({product.numReviews} reviews)</span>
                        </div>

                        <p className="text-3xl font-bold text-indigo-600 mt-4">₹{product.price}</p>

                        <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

                        <div className="mt-4">
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                {product.stock > 0 ? `✓ In Stock (${product.stock})` : "✗ Out of Stock"}
                            </span>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button onClick={handleAddToCart} disabled={product.stock === 0}
                                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                                Add to Cart
                            </button>
                            <button onClick={handleWishlist}
                                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500 transition font-medium">
                                ♡ Wishlist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-8 grid lg:grid-cols-2 gap-8">

                    {/* Write Review */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-5">Write a Review</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <select value={rating} onChange={(e) => setRating(e.target.value)}
                                    className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    {[5,4,3,2,1].map(n => (
                                        <option key={n} value={n}>{stars(n)} {n} Star{n > 1 ? "s" : ""}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                <textarea placeholder="Share your experience..." value={comment}
                                    onChange={(e) => setComment(e.target.value)} rows={4}
                                    className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                            </div>
                            <button onClick={handleReviewSubmit}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                                Submit Review
                            </button>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-5">
                            Reviews ({product.numReviews})
                        </h2>
                        {product.reviews.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <p className="text-3xl mb-2">💬</p>
                                <p>No reviews yet. Be the first!</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                                {product.reviews.map((review) => (
                                    <div key={review._id} className="border border-gray-100 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-yellow-400">{stars(review.rating)}</span>
                                            <span className="text-gray-400 text-xs">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductDetails;
