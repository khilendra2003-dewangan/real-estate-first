import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiHome } from 'react-icons/fi';
import { authAPI } from '../../api/api';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        verifyEmail();
    }, [token]);

    const verifyEmail = async () => {
        try {
            const { data } = await authAPI.verifyEmail(token);
            setStatus('success');
            setMessage(data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
            <div className="text-center">
                {/* Logo */}
                <Link to="/" className="inline-flex items-center gap-2 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                        <FiHome className="text-white text-2xl" />
                    </div>
                </Link>

                {status === 'verifying' && (
                    <div>
                        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-6"></div>
                        <h1 className="text-2xl font-heading font-bold text-white mb-2">Verifying Email</h1>
                        <p className="text-dark-400">Please wait while we verify your email address...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-fade-in">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCheckCircle className="text-green-500 text-4xl" />
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-white mb-2">Email Verified!</h1>
                        <p className="text-dark-400 mb-6">{message}</p>
                        <p className="text-dark-500 text-sm">Redirecting to login...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-fade-in">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiXCircle className="text-red-500 text-4xl" />
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-white mb-2">Verification Failed</h1>
                        <p className="text-dark-400 mb-6">{message}</p>
                        <Link to="/signup" className="btn-primary inline-block">
                            Try Again
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
