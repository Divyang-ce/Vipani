import { Link } from "react-router-dom";

function ProductCard({ id, name, price, category, image }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group">
            <div className="overflow-hidden h-52 bg-gray-100">
                <img
                    src={`http://localhost:5000/uploads/${image}`}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
            </div>
            <div className="p-4">
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                    {category}
                </span>
                <h2 className="text-gray-900 font-semibold mt-2 truncate">{name}</h2>
                <div className="flex items-center justify-between mt-3">
                    <p className="text-xl font-bold text-gray-900">₹{price}</p>
                    <Link to={`/product/${id}`}
                        className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default ProductCard;
