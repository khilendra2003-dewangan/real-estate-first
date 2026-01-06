import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiUpload, FiX, FiSave, FiArrowLeft, FiHome, FiMapPin, FiList, FiImage, FiCheck, FiDollarSign, FiLayout, FiGrid, FiLayers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion, useScroll, useTransform } from 'framer-motion';
import { propertyAPI, categoryAPI } from '../../api/api';

const HERO_BG_URL = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop';

const AddProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [deleteImages, setDeleteImages] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        propertyType: 'sale',
        category: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        furnishing: 'unfurnished',
        facing: '',
        floorNumber: '',
        totalFloors: '',
        ageOfProperty: '',
        location: {
            address: '',
            city: '',
            state: '',
            country: 'India',
            pincode: '',
        },
        amenities: {
            parking: false,
            lift: false,
            security: false,
            garden: false,
            gym: false,
            swimmingPool: false,
            powerBackup: false,
            waterSupply: true,
            clubhouse: false,
            playground: false,
        },
    });

    useEffect(() => {
        fetchCategories();
        if (isEditing) fetchProperty();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const { data } = await categoryAPI.getAll();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProperty = async () => {
        try {
            const { data } = await propertyAPI.getById(id);
            const p = data.property;
            setFormData({
                title: p.title,
                description: p.description,
                price: p.price,
                propertyType: p.propertyType,
                category: p.category?._id || p.category,
                bedrooms: p.bedrooms,
                bathrooms: p.bathrooms,
                area: p.area,
                furnishing: p.furnishing,
                facing: p.facing || '',
                floorNumber: p.floorNumber || '',
                totalFloors: p.totalFloors || '',
                ageOfProperty: p.ageOfProperty || '',
                location: p.location,
                amenities: p.amenities,
            });
            setExistingImages(p.images || []);
        } catch (error) {
            toast.error('Failed to load property');
            navigate('/agent/properties');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('location.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                location: { ...formData.location, [field]: value },
            });
        } else if (name.startsWith('amenities.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                amenities: { ...formData.amenities, [field]: checked },
            });
        } else {
            setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length + existingImages.length > 10) {
            toast.error('Maximum 10 images allowed');
            return;
        }
        setImages([...images, ...files]);
    };

    const removeNewImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeExistingImage = (publicId) => {
        setExistingImages(existingImages.filter((img) => img.publicId !== publicId));
        setDeleteImages([...deleteImages, publicId]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();

            // Append basic fields
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('propertyType', formData.propertyType);
            data.append('category', formData.category);
            data.append('bedrooms', formData.bedrooms);
            data.append('bathrooms', formData.bathrooms);
            data.append('area', formData.area);
            data.append('furnishing', formData.furnishing);
            if (formData.facing) data.append('facing', formData.facing);
            if (formData.floorNumber) data.append('floorNumber', formData.floorNumber);
            if (formData.totalFloors) data.append('totalFloors', formData.totalFloors);
            if (formData.ageOfProperty) data.append('ageOfProperty', formData.ageOfProperty);

            // Append nested objects as JSON
            data.append('location', JSON.stringify(formData.location));
            data.append('amenities', JSON.stringify(formData.amenities));

            // Append images
            images.forEach((img) => {
                data.append('images', img);
            });

            // Handle deleted images in edit mode
            if (isEditing && deleteImages.length > 0) {
                data.append('deleteImages', JSON.stringify(deleteImages));
            }

            if (isEditing) {
                await propertyAPI.update(id, data);
                toast.success('Property updated! Awaiting approval.');
            } else {
                await propertyAPI.create(data);
                toast.success('Property created! Awaiting approval.');
            }

            navigate('/agent/properties');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save property');
        } finally {
            setLoading(false);
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    // Reusable Input Component
    const PremiumInput = ({ label, icon: Icon, ...props }) => (
        <div className="group relative">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 ml-1">{label}</label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                        <Icon />
                    </div>
                )}
                <input
                    {...props}
                    className={`w-full bg-dark-950/50 border border-white/10 rounded-xl px-4 py-3 ${Icon ? 'pl-10' : ''} text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300`}
                />
            </div>
        </div>
    );

    const PremiumSelect = ({ label, icon: Icon, children, ...props }) => (
        <div className="group relative">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 ml-1">{label}</label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                        <Icon />
                    </div>
                )}
                <select
                    {...props}
                    className={`w-full bg-dark-950/50 border border-white/10 rounded-xl px-4 py-3 ${Icon ? 'pl-10' : ''} text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 appearance-none`}
                >
                    {children}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-950 text-white selection:bg-cyan-500/30">

            {/* Parallax Hero Header */}
            <div ref={heroRef} className="relative h-[300px] overflow-hidden">
                <motion.div
                    style={{ y: backgroundY }}
                    className="absolute inset-0 z-0"
                >
                    <img src={HERO_BG_URL} alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-950/70 via-dark-950/80 to-dark-950"></div>
                </motion.div>

                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
                    <Link to="/agent/properties" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors w-fit group">
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Listings
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-2"
                    >
                        <span className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">Property Management</span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white shadow-lg">
                            {isEditing ? 'Edit Property' : 'Create New Listing'}
                        </h1>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Basic Info Section */}
                    <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none -mr-32 -mt-32"></div>

                        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                <FiHome className="text-lg" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Basic Details</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <PremiumInput
                                label="Property Title *"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Ultra-Luxury Penthouse with Sea View"
                                required
                                minLength={10}
                            />

                            <div className="group relative">
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 ml-1">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-dark-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 resize-none"
                                    rows={4}
                                    placeholder="Describe the property's key features, location advantages, and unique selling points..."
                                    required
                                    minLength={50}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <PremiumInput
                                    label="Price (₹) *"
                                    type="number"
                                    name="price"
                                    icon={FiDollarSign}
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="50,00,000"
                                    required
                                    min={0}
                                />
                                <PremiumSelect name="propertyType" label="Property Type *" value={formData.propertyType} onChange={handleChange} required>
                                    <option value="sale">For Sale</option>
                                    <option value="rent">For Rent</option>
                                </PremiumSelect>
                                <PremiumSelect name="category" label="Category *" value={formData.category} onChange={handleChange} required>
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </PremiumSelect>
                            </div>
                        </div>
                    </motion.div>

                    {/* Features & Location Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Details */}
                        <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.1 }}
                            className="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl"
                        >
                            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                    <FiLayout className="text-lg" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Attributes</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <PremiumInput label="Bedrooms *" type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min={0} required />
                                <PremiumInput label="Bathrooms *" type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min={0} required />
                                <PremiumInput label="Area (sqft) *" type="number" name="area" value={formData.area} onChange={handleChange} min={0} required />
                                <PremiumSelect label="Furnishing" name="furnishing" value={formData.furnishing} onChange={handleChange}>
                                    <option value="unfurnished">Unfurnished</option>
                                    <option value="semi-furnished">Semi-Furnished</option>
                                    <option value="fully-furnished">Fully Furnished</option>
                                </PremiumSelect>
                                <PremiumSelect label="Facing" name="facing" value={formData.facing} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="north">North</option>
                                    <option value="south">South</option>
                                    <option value="east">East</option>
                                    <option value="west">West</option>
                                </PremiumSelect>
                                <PremiumInput label="Floor No." type="number" name="floorNumber" value={formData.floorNumber} onChange={handleChange} min={0} />
                                <PremiumInput label="Total Floors" type="number" name="totalFloors" value={formData.totalFloors} onChange={handleChange} min={0} />
                                <PremiumInput label="Age (years)" type="number" name="ageOfProperty" value={formData.ageOfProperty} onChange={handleChange} min={0} />
                            </div>
                        </motion.div>

                        {/* Location */}
                        <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                            className="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl"
                        >
                            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                    <FiMapPin className="text-lg" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Location</h2>
                            </div>

                            <div className="space-y-4">
                                <PremiumInput label="Address *" name="location.address" value={formData.location.address} onChange={handleChange} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <PremiumInput label="City *" name="location.city" value={formData.location.city} onChange={handleChange} required />
                                    <PremiumInput label="State *" name="location.state" value={formData.location.state} onChange={handleChange} required />
                                    <PremiumInput label="Country" name="location.country" value={formData.location.country} onChange={handleChange} />
                                    <PremiumInput label="Pincode *" name="location.pincode" value={formData.location.pincode} onChange={handleChange} pattern="[0-9]{6}" required />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Amenities */}
                    <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                        className="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl"
                    >
                        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                <FiList className="text-lg" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Amenities</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {Object.entries(formData.amenities).map(([key, value]) => (
                                <label key={key} className={`
                                    relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300
                                    ${value
                                        ? 'bg-emerald-500/10 border-emerald-500/50'
                                        : 'bg-dark-950/30 border-white/5 hover:border-white/20'
                                    }
                                `}>
                                    <input
                                        type="checkbox"
                                        name={`amenities.${key}`}
                                        checked={value}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${value ? 'bg-emerald-500 text-white' : 'bg-dark-800 border border-white/20'}`}>
                                        {value && <FiCheck className="text-xs" />}
                                    </div>
                                    <span className={`text-sm font-medium ${value ? 'text-emerald-400' : 'text-gray-400'}`}>
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </motion.div>

                    {/* Images */}
                    <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4 }}
                        className="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl"
                    >
                        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
                                <FiImage className="text-lg" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Gallery</h2>
                                <p className="text-gray-500 text-xs mt-1">First image will be the cover. Max 10 images.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {/* Upload Button */}
                            {(existingImages.length + images.length) < 10 && (
                                <label className="aspect-square border-2 border-dashed border-white/10 hover:border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-cyan-500/5 transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-dark-950 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                                        <FiUpload className="text-xl text-gray-400 group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                    <span className="text-gray-400 text-sm font-medium group-hover:text-cyan-400 transition-colors">Upload Photos</span>
                                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                                </label>
                            )}

                            {/* Images Preview */}
                            {[...existingImages, ...images].map((img, idx) => {
                                const isExisting = idx < existingImages.length;
                                const url = isExisting ? img.url : URL.createObjectURL(img);

                                return (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg border border-white/5">
                                        <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => isExisting ? removeExistingImage(img.publicId) : removeNewImage(idx - existingImages.length)}
                                                className="w-10 h-10 bg-red-500/90 hover:bg-red-500 rounded-xl flex items-center justify-center text-white backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                        {idx === 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1 text-center">
                                                <span className="text-xs font-bold text-white uppercase tracking-wider">Cover Image</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {!isEditing && images.length === 0 && (
                            <p className="text-amber-500 text-sm mt-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                At least one image is required to publish functionality
                            </p>
                        )}
                    </motion.div>

                    {/* Submit Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-4 pt-4"
                    >
                        <Link
                            to="/agent/properties"
                            className="flex-1 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white font-semibold text-center transition-all duration-300"
                        >
                            Cancel Operation
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || (!isEditing && images.length === 0)}
                            className="flex-[2] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <FiSave className="text-xl" />
                                    {isEditing ? 'Update Property Listing' : 'Publish New Listing'}
                                </>
                            )}
                        </button>
                    </motion.div>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;
