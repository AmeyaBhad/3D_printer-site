/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { api, setToken, clearToken, getToken } from '../api';

export const ShopContext = createContext();

const USER_KEY = 'forge3d.user';

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const raw = localStorage.getItem(USER_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState(null);

    const refreshProducts = useCallback(async () => {
        setProductsLoading(true);
        setProductsError(null);
        try {
            const list = await api.listProducts();
            setProducts(list);
        } catch (err) {
            setProductsError(err.message || 'Failed to load products');
        } finally {
            setProductsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        } else {
            localStorage.removeItem(USER_KEY);
        }
    }, [currentUser]);

    const login = async (email, password) => {
        try {
            const res = await api.login(email, password);
            setToken(res.token);
            setCurrentUser({
                id: res.id,
                email: res.email,
                displayName: res.displayName,
                role: res.role === 'ADMIN' ? 'admin' : 'user',
            });
            return { ok: true };
        } catch (err) {
            return { ok: false, message: err.message || 'Login failed' };
        }
    };

    const register = async (email, password, displayName) => {
        try {
            const res = await api.register(email, password, displayName);
            setToken(res.token);
            setCurrentUser({
                id: res.id,
                email: res.email,
                displayName: res.displayName,
                role: res.role === 'ADMIN' ? 'admin' : 'user',
            });
            return { ok: true };
        } catch (err) {
            return { ok: false, message: err.message || 'Registration failed' };
        }
    };

    const googleLogin = async (credential) => {
        try {
            const res = await api.googleLogin(credential);
            setToken(res.token);
            setCurrentUser({
                id: res.id,
                email: res.email,
                displayName: res.displayName,
                role: res.role === 'ADMIN' ? 'admin' : 'user',
            });
            return { ok: true };
        } catch (err) {
            return { ok: false, message: err.message || 'Google sign-in failed' };
        }
    };

    const logout = () => {
        clearToken();
        setCurrentUser(null);
        setCart([]);
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateCartQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => setCart([]);

    const toggleCart = () => setIsCartOpen(prev => !prev);

    const addProduct = async (newProduct) => {
        const payload = {
            ...newProduct,
            isArchived: false,
            analytics: { views: 0, likes: 0, rating: 0, revenue: 0, unitsSold: 0, salesData: [] },
        };
        const saved = await api.addProduct(payload);
        setProducts(prev => [...prev, saved]);
        return saved;
    };

    const toggleProductStatus = async (productId) => {
        const updated = await api.toggleProductStatus(productId);
        setProducts(prev => prev.map(p => (p.id === productId ? updated : p)));
        return updated;
    };

    const placeOrder = async () => {
        if (cart.length === 0) throw new Error('Cart is empty');
        const items = cart.map(item => ({ productId: item.id, quantity: item.quantity }));
        const order = await api.placeOrder(items);
        clearCart();
        await refreshProducts();
        return order;
    };

    // If we have a stored user but no token, clear stale state.
    useEffect(() => {
        if (currentUser && !getToken()) {
            setCurrentUser(null);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ShopContext.Provider value={{
            products, setProducts, refreshProducts, productsLoading, productsError,
            cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
            isCartOpen, setIsCartOpen, toggleCart,
            currentUser, login, register, googleLogin, logout,
            addProduct, toggleProductStatus,
            placeOrder,
        }}>
            {children}
        </ShopContext.Provider>
    );
};
