import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";

function Home() {
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("");   // Bug fix: was setKeyword before
    const [sort, setSort] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchProducts(); }, [keyword, category, sort, minPrice, maxPrice, page]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getProducts({ keyword, category, sort, minPrice, maxPrice, page });
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
                    <p className="text-gray-500 mt-1">Discover our latest collection</p>
                </div>

                {/* Filters Bar */}
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-wrap gap-3">
                    <input type="text" placeholder="🔍 Search products..." value={keyword}
                        onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                        className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 min-w-40" />

                    <input type="text" placeholder="Category" value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36" />

                    <input type="number" placeholder="Min ₹" value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-28" />

                    <input type="number" placeholder="Max ₹" value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-28" />

                    <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
                        className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        <option value="">Sort By</option>
                        <option value="price_asc">Price: Low → High</option>
                        <option value="price_desc">Price: High → Low</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="text-gray-500 text-lg">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} id={product._id}
                                name={product.name} price={product.price}
                                category={product.category} image={product.image?.[0]} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}
                            className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
                            ← Previous
                        </button>
                        <span className="text-gray-600 text-sm font-medium">
                            Page {page} of {totalPages}
                        </span>
                        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
                            className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Home;
