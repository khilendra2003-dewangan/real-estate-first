import { Link } from 'react-router-dom';
import { FiHome, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Buy Property', path: '/properties?type=sale' },
        { name: 'Rent Property', path: '/properties?type=rent' },
        { name: 'Find Agents', path: '/agents' },
        { name: 'List Property', path: '/agent/properties/new' },
    ];

    const propertyTypes = [
        { name: 'Houses', path: '/properties?category=house' },
        { name: 'Apartments', path: '/properties?category=flat' },
        { name: 'Villas', path: '/properties?category=villa' },
        { name: 'Plots', path: '/properties?category=plot' },
    ];

    const socialLinks = [
        { icon: FiFacebook, href: '#', label: 'Facebook' },
        { icon: FiTwitter, href: '#', label: 'Twitter' },
        { icon: FiInstagram, href: '#', label: 'Instagram' },
        { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
    ];

    return (
        <footer className="bg-dark-950 border-t border-dark-800">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                <FiHome className="text-white text-xl" />
                            </div>
                            <span className="text-xl font-heading font-bold text-white">
                                Real<span className="text-primary-400">Estate</span>Pro
                            </span>
                        </Link>
                        <p className="text-dark-400 text-sm leading-relaxed mb-6">
                            Your trusted partner in finding the perfect property. We connect buyers, sellers, and agents for seamless real estate transactions.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-dark-400 hover:bg-primary-600 hover:text-white transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="text-lg" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Property Types */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Property Types</h3>
                        <ul className="space-y-3">
                            {propertyTypes.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <FiMapPin className="text-primary-400 mt-1 flex-shrink-0" />
                                <span className="text-dark-400 text-sm">
                                    123 Business Park, Suite 100<br />
                                    Mumbai, Maharashtra 400001
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiPhone className="text-primary-400 flex-shrink-0" />
                                <a href="tel:+919876543210" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiMail className="text-primary-400 flex-shrink-0" />
                                <a href="mailto:info@realestatepro.com" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">
                                    info@realestatepro.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-dark-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-dark-500 text-sm">
                            © {currentYear} RealEstatePro. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link to="/privacy" className="text-dark-500 hover:text-dark-300 text-sm transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-dark-500 hover:text-dark-300 text-sm transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
