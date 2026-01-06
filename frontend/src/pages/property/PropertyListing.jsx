import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiGrid, FiList, FiMapPin, FiHome, FiDollarSign, FiSliders, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
import { propertyAPI, categoryAPI } from '../../api/api';
import PropertyCard from '../../components/property/PropertyCard';

const PropertyListing = ({ listingType }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProperties: 0 });
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        city: searchParams.get('city') || '',
        category: searchParams.get('category') || '',
        propertyType: listingType || searchParams.get('type') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        bedrooms: searchParams.get('bedrooms') || '',
        sort: searchParams.get('sort') || 'newest',
    });

    useEffect(() => { fetchCategories(); }, []);
    useEffect(() => { if (listingType) setFilters(prev => ({ ...prev, propertyType: listingType })); }, [listingType]);
    useEffect(() => { fetchProperties(); }, [searchParams, listingType]);

    const fetchCategories = async () => {
        try {
            const { data } = await categoryAPI.getAll();
            setCategories(data.categories || []);
        } catch (error) { console.error('Error fetching categories:', error); }
    };

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const params = Object.fromEntries(searchParams);
            if (listingType) params.propertyType = listingType;
            const { data } = await propertyAPI.getAll({ ...params, limit: 12 });
            setProperties(data.properties || []);
            setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalProperties: 0 });
        } catch (error) { console.error('Error fetching properties:', error); } finally { setLoading(false); }
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
        if (listingType && !params.get('propertyType')) params.set('propertyType', listingType);
        setSearchParams(params);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({ search: '', city: '', category: '', propertyType: listingType || '', minPrice: '', maxPrice: '', bedrooms: '', sort: 'newest' });
        setSearchParams(listingType ? { type: listingType } : {});
    };

    const handlePageChange = (page) => {
        searchParams.set('page', page);
        setSearchParams(searchParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageTitle = () => {
        if (listingType === 'sale') return 'Luxury Estates for Sale';
        if (listingType === 'rent') return 'Exclusive Rentals';
        return 'Premium Collection';
    };

    const activeFiltersCount = Object.entries(filters).filter(([key, value]) => value && key !== 'sort' && key !== 'propertyType').length;

    const HERO_BG = listingType === 'rent'
        ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" // Luxury Pool Villa
        : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"; // Modern Mansion

    return (
        <div className="min-h-screen bg-dark-950 text-white font-sans selection:bg-amber-500/30">
            {/* Parallax Hero */}
            <div ref={heroRef} className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                    <img src={HERO_BG} alt="Hero" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-950/30 via-dark-950/50 to-dark-950" />
                </motion.div>

                <div className="relative z-10 text-center px-4 pt-16">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-gray-200 text-xs font-bold tracking-[0.2em] uppercase mb-6">
                            {listingType === 'sale' ? 'Invest in your future' : 'Live your best life'}
                        </span>
                        <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            {getPageTitle()}
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8 pb-32">
                <div className="max-w-7xl mx-auto">
                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl mb-12 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative group">
                                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    placeholder="Search by address, city, or zip..."
                                    className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:bg-black/40 focus:border-amber-500/30 transition-all font-light"
                                />
                            </div>

                            <button onClick={applyFilters} className="bg-gradient-to-r from-amber-400 to-yellow-600 text-dark-900 font-bold py-4 px-10 rounded-2xl shadow-lg hover:shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-wider text-sm">
                                Search
                            </button>

                            <button onClick={() => setShowFilters(!showFilters)} className={`px-6 py-4 rounded-2xl border transition-all flex items-center gap-2 font-medium ${showFilters ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>
                                <FiSliders /> Filters
                            </button>
                        </div>

                        <AnimatePresence>
                            {showFilters && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-6 pt-6 border-t border-white/5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* Filters Content */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                                            <div className="relative">
                                                <select
                                                    value={filters.category}
                                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                                    className="w-full appearance-none bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/30 font-light"
                                                >
                                                    <option className="bg-dark-900" value="">All Categories</option>
                                                    {categories.map((c) => <option key={c._id} className="bg-dark-900" value={c._id}>{c.name}</option>)}
                                                </select>
                                                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                            </div>
                                        </div>
                                        {/* Add other filters here similarly styled */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price Range</label>
                                            <div className="flex gap-2">
                                                <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-amber-500/30 outline-none" />
                                                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-amber-500/30 outline-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bedrooms</label>
                                            <div className="relative">
                                                <select value={filters.bedrooms} onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })} className="w-full appearance-none bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-amber-500/30 outline-none">
                                                    <option className="bg-dark-900" value="">Any</option>
                                                    {[1, 2, 3, 4, 5].map(n => <option key={n} className="bg-dark-900" value={n}>{n}+ Beds</option>)}
                                                </select>
                                                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-6 mt-6 border-t border-white/5">
                                        <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-white flex items-center gap-2"><FiX /> Clear All</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Results */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => <div key={i} className="h-[500px] bg-white/5 rounded-[2rem] animate-pulse" />)}
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-white/5">
                            <FiHome className="text-6xl text-gray-600 mx-auto mb-6" />
                            <h3 className="text-3xl font-serif text-white mb-2">No Properties Found</h3>
                            <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {properties.map((property) => (
                                    <motion.div key={property._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                        <PropertyCard property={property} />
                                    </motion.div>
                                ))}
                            </motion.div>
                            {/* Pagination (Simplified for aesthetics) */}
                            {pagination.totalPages > 1 && (
                                <div className="mt-20 flex justify-center gap-2">
                                    <button disabled={pagination.currentPage === 1} onClick={() => handlePageChange(pagination.currentPage - 1)} className="w-12 h-12 rounded-full border border-white/10 hover:bg-white/10 text-white flex items-center justify-center disabled:opacity-30"><FiChevronLeft /></button>
                                    <span className="flex items-center px-6 font-serif text-lg text-amber-500 font-bold bg-white/5 rounded-full border border-white/5">
                                        {pagination.currentPage} / {pagination.totalPages}
                                    </span>
                                    <button disabled={pagination.currentPage === pagination.totalPages} onClick={() => handlePageChange(pagination.currentPage + 1)} className="w-12 h-12 rounded-full border border-white/10 hover:bg-white/10 text-white flex items-center justify-center disabled:opacity-30"><FiChevronRight /></button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyListing;
