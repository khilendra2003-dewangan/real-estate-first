import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiSave, FiBriefcase, FiEdit2, FiX, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const InputField = ({ label, name, type = "text", value, icon: Icon, required, placeholder, onChange, isEditing }) => (
    <div className="group">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
        <div className={`relative flex items-center bg-black/20 border border-white/5 rounded-xl overflow-hidden transition-all duration-300 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 focus-within:bg-black/30 ${!isEditing && 'opacity-75'}`}>
            {Icon && <div className="pl-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors"><Icon /></div>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={!isEditing}
                required={required}
                placeholder={placeholder || (isEditing ? `Enter ${label}` : 'Not provided')}
                className={`w-full bg-transparent text-white px-4 py-3 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed transition-colors ${!Icon && 'pl-4'}`}
            />
        </div>
    </div>
);

const ProfileSection = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        name: '', contact: '', address: '', city: '', state: '', country: '', pincode: '',
        agencyName: '', experience: '', bio: '', specialization: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                contact: user.contact || '',
                address: user.address || '',
                city: user.city || '',
                state: user.state || '',
                country: user.country || '',
                pincode: user.pincode || '',
                agencyName: user.agencyName || '',
                experience: user.experience || '',
                bio: user.bio || '',
                specialization: user.specialization ? user.specialization.join(', ') : '',
            });
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => data.append(key, value));
            if (profileImage) data.append('profileImage', profileImage);

            const response = await authAPI.updateProfile(data);
            updateUser(response.data.user);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Background Decoration */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
                {/* Header Actions */}
                <div className="absolute top-6 right-6 z-10">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isEditing
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30'
                            }`}
                    >
                        {isEditing ? <><FiX /> Cancel</> : <><FiEdit2 /> Edit Profile</>}
                    </button>
                    {isEditing && (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={handleSubmit}
                            disabled={loading}
                            className="mt-3 w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave /> Save Changes</>}
                        </motion.button>
                    )}
                </div>

                <div className="p-8 md:p-10">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col md:flex-row gap-10">
                            {/* Profile Image Section */}
                            <div className="flex flex-col items-center md:items-start space-y-4">
                                <div className="relative group">
                                    <div className="w-40 h-40 rounded-3xl overflow-hidden bg-dark-900 ring-4 ring-white/5 group-hover:ring-cyan-500/30 transition-all duration-500 shadow-2xl">
                                        {previewImage ? (
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        ) : user?.profileImage?.url ? (
                                            <img src={user.profileImage.url} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                                                <span className="text-5xl font-bold text-cyan-500">{user?.name?.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer rounded-3xl backdrop-blur-sm">
                                            <div className="flex flex-col items-center gap-2 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                <FiCamera className="text-3xl" />
                                                <span className="text-xs font-medium">Change Photo</span>
                                            </div>
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                                    <p className="text-cyan-400 text-sm font-medium">{user?.email}</p>
                                    <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${user?.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            user?.role === 'agent' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Form Fields */}
                            <div className="flex-1 space-y-8">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400"><FiUser /></span>
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField label="Full Name" name="name" value={formData.name} icon={FiUser} required onChange={handleChange} isEditing={isEditing} />
                                        <InputField label="Phone Number" name="contact" type="tel" value={formData.contact} icon={FiPhone} required onChange={handleChange} isEditing={isEditing} />
                                    </div>
                                </div>

                                {/* Location Details */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-t border-white/5 pt-8">
                                        <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400"><FiMapPin /></span>
                                        Location Details
                                    </h3>
                                    <div className="space-y-6">
                                        <InputField label="Street Address" name="address" value={formData.address} onChange={handleChange} isEditing={isEditing} />
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <InputField label="City" name="city" value={formData.city} onChange={handleChange} isEditing={isEditing} />
                                            <InputField label="State" name="state" value={formData.state} onChange={handleChange} isEditing={isEditing} />
                                            <InputField label="Country" name="country" value={formData.country} onChange={handleChange} isEditing={isEditing} />
                                            <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} isEditing={isEditing} />
                                        </div>
                                    </div>
                                </div>

                                {/* Agent Specifics */}
                                {user?.role === 'agent' && (
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-t border-white/5 pt-8">
                                            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400"><FiBriefcase /></span>
                                            Professional Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <InputField label="Agency Name" name="agencyName" value={formData.agencyName} placeholder="Independent Agent" onChange={handleChange} isEditing={isEditing} />
                                            <InputField label="Experience (Years)" name="experience" type="number" value={formData.experience} onChange={handleChange} isEditing={isEditing} />
                                            <div className="md:col-span-2">
                                                <InputField
                                                    label="Specializations (comma separated)"
                                                    name="specialization"
                                                    value={formData.specialization}
                                                    placeholder="e.g. Residential, Commercial, Luxury"
                                                    onChange={handleChange}
                                                    isEditing={isEditing}
                                                />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">About Me</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder={isEditing ? "Tell potential clients about your experience and expertise..." : "No bio provided"}
                                                rows={4}
                                                className={`w-full bg-black/20 border border-white/5 rounded-xl p-4 text-white outline-none placeholder:text-gray-600 transition-all duration-300 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 resize-none ${!isEditing && 'opacity-75 cursor-not-allowed'}`}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileSection;
