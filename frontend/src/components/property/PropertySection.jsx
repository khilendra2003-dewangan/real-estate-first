import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { propertyAPI } from '../../api/api';
import PropertyCard from './PropertyCard';

const PropertySection = ({ title, categorySlug }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                // limit 4 for horizontal row
                const { data } = await propertyAPI.getByCategory(categorySlug, { limit: 4 });
                setProperties(data.properties || []);
            } catch (error) {
                // console.error(`Error fetching properties for ${categorySlug}:`, error);
                // Silently fail if category doesn't exist yet
            } finally {
                setLoading(false);
            }
        };

        if (categorySlug) fetchProperties();
    }, [categorySlug]);

    if (!loading && properties.length === 0) return null;

    return (
        <section className="py-12 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">{title}</h2>
                        <p className="text-gray-400 font-light">Latest listings in {title}</p>
                    </div>
                    {properties.length >= 4 && (
                        <Link
                            to={`/properties?category=${properties[0]?.category?._id}`}
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-sm font-medium transition-colors group"
                        >
                            View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="card animate-pulse h-80 bg-dark-800 rounded-xl"></div>
                        ))}
                    </div>
                ) : (
                    <div className={`grid gap-6 ${properties.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                            properties.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
                                properties.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto' :
                                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                        }`}>
                        {properties.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PropertySection;
