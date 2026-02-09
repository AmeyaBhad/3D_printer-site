import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Mock initial products
    useEffect(() => {
        const mockProducts = [
            { id: 1, name: "Articulated Dragon", category: "Toys", price: 45.00, image: "https://placehold.co/400x400/2d3748/ffffff?text=Dragon", stock: 10, isArchived: false, description: "A fully articulated dragon model, perfect for play or display. Features intricate details and smooth joint movement.", analytics: { views: 1200, salesData: [10, 15, 8, 20, 25, 30, 45], revenue: 4500, unitsSold: 100 } },
            { id: 2, name: "Voronoi Vase", category: "Home Decor", price: 25.00, image: "https://placehold.co/400x400/2d3748/ffffff?text=Vase", stock: 5, isArchived: false, description: "A stunning Voronoi-style vase that adds a modern touch to any room. 3D printed with high-quality PLA.", analytics: { views: 800, salesData: [5, 8, 12, 10, 15, 18, 22], revenue: 2000, unitsSold: 80 } },
            { id: 3, name: "Mechanical Clock", category: "Gadgets", price: 120.00, image: "https://placehold.co/400x400/2d3748/ffffff?text=Clock", stock: 0, isArchived: false, description: "A functional mechanical clock showcasing the beauty of gears and engineering. Assembly required.", analytics: { views: 2500, salesData: [0, 2, 1, 5, 3, 8, 10], revenue: 1200, unitsSold: 10 } },
            { id: 4, name: "Lithophane Lamp", category: "Home Decor", price: 60.00, image: "https://placehold.co/400x400/2d3748/ffffff?text=Lamp", stock: 2, isArchived: false, description: "Customizable lithophane lamp that reveals a hidden image when lit. Perfect for personalized gifts.", analytics: { views: 1500, salesData: [2, 5, 4, 8, 10, 12, 15], revenue: 3000, unitsSold: 50 } },
            { id: 5, name: "Phone Stand", category: "Accessories", price: 15.00, image: "https://placehold.co/400x400/2d3748/ffffff?text=Stand", stock: 20, isArchived: false, description: "Ergonomic phone stand suitable for all smartphones. Great for video calls and watching media.", analytics: { views: 500, salesData: [20, 25, 30, 28, 35, 40, 50], revenue: 1500, unitsSold: 100 } },
            { id: 6, name: "Custom Keychain", category: "Accessories", price: 8.00, image: "https://placehold.co/400x400/2d3748/ffffff?text=Keychain", stock: 50, isArchived: false, description: "Durable and stylish custom keychains. Available in various colors and designs.", analytics: { views: 300, salesData: [10, 12, 15, 20, 25, 30, 35], revenue: 800, unitsSold: 100 } },
            { id: 7, name: "Planter Pot", category: "Home Decor", price: 18.00, image: "https://placehold.co/400x400/2d3748/ffffff?text=Pot", stock: 15, isArchived: false, description: "Geometric planter pot designed for succulents and small plants. Includes drainage holes.", analytics: { views: 600, salesData: [5, 10, 8, 12, 15, 20, 25], revenue: 1800, unitsSold: 100 } },
            { id: 8, name: "Headphone Stand", category: "Gadgets", price: 35.00, image: "https://placehold.co/400x400/2d3748/ffffff?text=Headphone+Stand", stock: 8, isArchived: false, description: "Sleek headphone stand to keep your desk organized. Compatible with all over-ear headphones.", analytics: { views: 1000, salesData: [8, 10, 12, 15, 18, 20, 25], revenue: 3500, unitsSold: 100 } }
        ];
        setProducts(mockProducts);
    }, []);

    const login = (email, password) => {
        // Mock login logic
        if (email === 'admin@3dforge.com' && password === 'admin123') {
            setCurrentUser({ role: 'admin', email, displayName: 'Admin' });
            return true;
        } else if (email === 'user@3dforge.com' && password === 'password') {
            setCurrentUser({ role: 'user', email, displayName: 'User' });
            return true;
        } else {
            return false;
        }
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const addToCart = (product) => {
        setCart(prev => [...prev, product]);
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const addProduct = (newProduct) => {
        const product = {
            ...newProduct,
            id: Date.now(), // Generate ID
            isArchived: false,
            description: newProduct.description || "No description provided.",
            analytics: { views: 0, salesData: [], revenue: 0, unitsSold: 0 } // Initialize analytics
        };
        setProducts(prev => [...prev, product]);
    };

    const toggleProductStatus = (productId) => {
        setProducts(prev => prev.map(p =>
            p.id === productId ? { ...p, isArchived: !p.isArchived } : p
        ));
    };

    return (
        <ShopContext.Provider value={{
            products, setProducts,
            cart, addToCart, removeFromCart,
            isCartOpen, setIsCartOpen, toggleCart,
            currentUser, login, logout,
            addProduct, toggleProductStatus
        }}>
            {children}
        </ShopContext.Provider>
    );
};
