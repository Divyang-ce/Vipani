import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/authApi";
import { toast } from "react-toastify";

function Profile() {
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProfile().then(r => setFormData({ name: r.data.user.name, email: r.data.user.email }))
            .catch(console.log);
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateProfile(formData);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-lg mx-auto px-6 py-10">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    {/* Avatar */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-3xl font-bold text-indigo-600">
                            {formData.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mt-3">{formData.name}</h1>
                        <p className="text-gray-400 text-sm">{formData.email}</p>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 mb-5">Edit Profile</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                        </div>
                        <button onClick={handleSubmit} disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mt-2 disabled:opacity-50">
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Profile;
