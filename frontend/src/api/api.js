import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://real-estate-backend-k87x.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post(`${API_URL}/user/refresh-token`, {}, { withCredentials: true });
                localStorage.setItem('accessToken', data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    signup: (data) => api.post('/user/signup', data),
    verifyEmail: (token) => api.post(`/user/verify/${token}`),
    login: (data) => api.post('/user/login', data),
    verifyOtp: (data) => api.post('/user/verify-otp', data),
    resendOtp: (data) => api.post('/user/resend-otp', data),
    getProfile: () => api.get('/user/me'),
    updateProfile: (data) => api.put('/user/update-profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    logout: () => api.post('/user/logout'),
    refreshToken: () => api.post('/user/refresh-token'),
    getPublicAgents: (params) => api.get('/user/agents', { params }),
    getAgentPublicProfile: (id) => api.get(`/user/agents/${id}`),
};

// Property APIs
export const propertyAPI = {
    getAll: (params) => api.get('/property', { params }),
    getFeatured: (limit = 6) => api.get('/property/featured', { params: { limit } }),
    getById: (id) => api.get(`/property/${id}`),
    getByCategory: (slug, params) => api.get(`/property/category/${slug}`, { params }),
    create: (data) => api.post('/property', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.put(`/property/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/property/${id}`),
    getAgentProperties: (params) => api.get('/property/agent/my-properties', { params }),
    getAgentDashboard: () => api.get('/property/agent/dashboard'),
    getPropertiesByAgentId: (agentId, params) => api.get(`/property/agent-properties/${agentId}`, { params }),
};

// Category APIs
export const categoryAPI = {
    getAll: () => api.get('/category'),
    getBySlug: (slug) => api.get(`/category/${slug}`),
    create: (data) => api.post('/category', data),
    update: (id, data) => api.put(`/category/${id}`, data),
    delete: (id) => api.delete(`/category/${id}`),
    seed: () => api.post('/category/seed'),
};

// Wishlist APIs
export const wishlistAPI = {
    get: () => api.get('/wishlist'),
    add: (propertyId) => api.post('/wishlist', { propertyId }),
    remove: (propertyId) => api.delete(`/wishlist/${propertyId}`),
    check: (propertyId) => api.get(`/wishlist/check/${propertyId}`),
    clear: () => api.delete('/wishlist'),
};

// Inquiry APIs
export const inquiryAPI = {
    create: (data) => api.post('/inquiry', data),
    getUserInquiries: (params) => api.get('/inquiry/my-inquiries', { params }),
    getAgentInquiries: (params) => api.get('/inquiry/agent/inquiries', { params }),
    respond: (id, response) => api.put(`/inquiry/${id}/respond`, { response }),
    close: (id) => api.put(`/inquiry/${id}/close`),
    getById: (id) => api.get(`/inquiry/${id}`),
};

// Visit APIs
export const visitAPI = {
    schedule: (data) => api.post('/visit', data),
    getUserVisits: (params) => api.get('/visit/my-visits', { params }),
    getAgentVisits: (params) => api.get('/visit/agent/visits', { params }),
    updateStatus: (id, data) => api.put(`/visit/${id}/status`, data),
    cancel: (id, reason) => api.put(`/visit/${id}/cancel`, { reason }),
    reschedule: (id, data) => api.put(`/visit/${id}/reschedule`, data),
    getById: (id) => api.get(`/visit/${id}`),
};

// Admin APIs
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getAgents: (params) => api.get('/admin/agents', { params }),
    approveAgent: (id) => api.put(`/admin/agents/${id}/approve`),
    rejectAgent: (id, reason) => api.put(`/admin/agents/${id}/reject`, { reason }),
    getProperties: (params) => api.get('/admin/properties', { params }),
    getPendingProperties: (params) => api.get('/admin/properties/pending', { params }),
    approveProperty: (id) => api.put(`/admin/properties/${id}/approve`),
    approveProperty: (id) => api.put(`/admin/properties/${id}/approve`),
    rejectProperty: (id, reason) => api.put(`/admin/properties/${id}/reject`, { reason }),
};

// Location APIs
export const locationAPI = {
    getAll: () => api.get('/location'),
    getFeatured: () => api.get('/location/featured'),
};

export default api;
