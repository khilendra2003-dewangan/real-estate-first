import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import VerifyOtp from './pages/auth/VerifyOtp';
import PropertyListing from './pages/property/PropertyListing';
import PropertyDetails from './pages/property/PropertyDetails';
import Agents from './pages/Agents';
import AgentProfile from './pages/AgentProfile';

// User Dashboard
import UserDashboard from './pages/user/UserDashboard';
import Wishlist from './pages/user/Wishlist';
import MyInquiries from './pages/user/MyInquiries';
import MyVisits from './pages/user/MyVisits';

// Agent Dashboard
import AgentDashboard from './pages/agent/AgentDashboard';
import MyProperties from './pages/agent/MyProperties';
import AddProperty from './pages/agent/AddProperty';
import AgentInquiries from './pages/agent/AgentInquiries';
import AgentVisits from './pages/agent/AgentVisits';

// Admin Dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAgents from './pages/admin/ManageAgents';
import ManageProperties from './pages/admin/ManageProperties';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';

import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';

function App() {
    const location = useLocation();
    const isAuthPage = ['/login', '/signup', '/verify-otp'].includes(location.pathname) || location.pathname.startsWith('/verify/');

    return (
        <SmoothScroll>
            <CustomCursor />
            <div className="min-h-screen bg-dark-900 text-white">
                {!isAuthPage && <Navbar />}
                <main>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/verify/:token" element={<VerifyEmail />} />
                        <Route path="/verify-otp" element={<VerifyOtp />} />
                        <Route path="/properties" element={<PropertyListing />} />
                        <Route path="/properties" element={<PropertyListing />} />
                        <Route path="/buy" element={<PropertyListing listingType="sale" />} />
                        <Route path="/rent" element={<PropertyListing listingType="rent" />} />
                        <Route path="/property/:id" element={<PropertyDetails />} />
                        <Route path="/agents" element={<Agents />} />
                        <Route path="/agents/:id" element={<AgentProfile />} />

                        {/* User Routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <UserDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard/wishlist" element={
                            <ProtectedRoute>
                                <Wishlist />
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard/inquiries" element={
                            <ProtectedRoute>
                                <MyInquiries />
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard/visits" element={
                            <ProtectedRoute>
                                <MyVisits />
                            </ProtectedRoute>
                        } />

                        {/* Agent Routes */}
                        <Route path="/agent" element={
                            <ProtectedRoute allowedRoles={['agent']}>
                                <AgentDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/agent/properties" element={
                            <ProtectedRoute allowedRoles={['agent']}>
                                <MyProperties />
                            </ProtectedRoute>
                        } />
                        <Route path="/agent/properties/new" element={
                            <ProtectedRoute allowedRoles={['agent']}>
                                <AddProperty />
                            </ProtectedRoute>
                        } />
                        <Route path="/agent/properties/:id/edit" element={
                            <ProtectedRoute allowedRoles={['agent']}>
                                <AddProperty />
                            </ProtectedRoute>
                        } />
                        <Route path="/agent/inquiries" element={
                            <ProtectedRoute allowedRoles={['agent']}>
                                <AgentInquiries />
                            </ProtectedRoute>
                        } />
                        <Route path="/agent/visits" element={
                            <ProtectedRoute allowedRoles={['agent']}>
                                <AgentVisits />
                            </ProtectedRoute>
                        } />

                        {/* Admin Routes */}
                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/agents" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ManageAgents />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/properties" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ManageProperties />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
                {!isAuthPage && <Footer />}
            </div>
        </SmoothScroll>
    );
}

export default App;
