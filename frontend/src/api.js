const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const TOKEN_KEY = 'forge3d.token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const request = async (path, { method = 'GET', body, auth = false } = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        let message = res.statusText;
        try {
            const data = await res.json();
            message = data.message || message;
        } catch { /* ignore */ }
        const err = new Error(message);
        err.status = res.status;
        throw err;
    }

    if (res.status === 204) return null;
    return res.json();
};

export const api = {
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
    register: (email, password, displayName) =>
        request('/auth/register', { method: 'POST', body: { email, password, displayName } }),
    googleLogin: (credential) => request('/auth/google', { method: 'POST', body: { credential } }),

    listProducts: () => request('/products'),
    getProduct: (id) => request(`/products/${id}`),
    searchProducts: (query) => request(`/products/search?query=${encodeURIComponent(query)}`),
    addProduct: (product) => request('/products', { method: 'POST', body: product, auth: true }),
    updateProduct: (id, product) => request(`/products/${id}`, { method: 'PUT', body: product, auth: true }),
    toggleProductStatus: (id) => request(`/products/${id}/status`, { method: 'PATCH', auth: true }),

    placeOrder: (items) => request('/orders', { method: 'POST', body: { items }, auth: true }),
    listMyOrders: () => request('/orders', { auth: true }),

    paymentConfig: () => request('/payments/config'),
    createPayment: (orderId) => request(`/payments/orders/${orderId}`, { method: 'POST', auth: true }),
    verifyPayment: (orderId, payload) =>
        request(`/payments/verify?orderId=${orderId}`, { method: 'POST', body: payload, auth: true }),

    chat: (message) => request('/chat', { method: 'POST', body: { message } }),
};
