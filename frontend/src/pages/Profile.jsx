import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { Package, MapPin, Settings } from 'lucide-react';
import { api } from '../api';

const Profile = () => {
    const { currentUser } = useContext(ShopContext);
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState('');

    useEffect(() => {
        if (!currentUser || activeTab !== 'orders') return;
        let cancelled = false;
        const load = async () => {
            setOrdersLoading(true);
            setOrdersError('');
            try {
                const data = await api.listMyOrders();
                if (!cancelled) setOrders(data || []);
            } catch (err) {
                if (!cancelled) setOrdersError(err.message || 'Failed to load orders');
            } finally {
                if (!cancelled) setOrdersLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [currentUser, activeTab]);

    if (!currentUser) return <div className="text-center text-white py-20">Please login to view your profile.</div>;

    const renderOrders = () => {
        if (ordersLoading) return <p className="text-gray-400 text-center">Loading orders...</p>;
        if (ordersError) return <p className="text-red-400 text-center">{ordersError}</p>;
        if (orders.length === 0) return <p className="text-gray-400 text-center">No orders yet.</p>;
        return orders.map(order => (
            <div key={order.id} className="border border-gray-700 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-white">Order #{order.id}</p>
                        <p className="text-sm text-gray-400">
                            Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                        </p>
                        <p className="text-sm text-gray-400">Total: ${order.totalAmount?.toFixed(2)}</p>
                    </div>
                    <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {order.status}
                    </span>
                </div>
                <div className="mt-4 border-t border-gray-700 pt-4 space-y-3">
                    {(order.items || []).map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                            <img
                                src={item.product?.image}
                                alt={item.product?.name}
                                className="w-16 h-16 rounded-md object-cover"
                            />
                            <div className="flex-grow">
                                <p className="font-semibold text-white">{item.product?.name}</p>
                                <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-gray-300">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        ));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return (
                    <div className="bg-gray-800 rounded-lg p-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-white mb-4">Order History</h2>
                        {renderOrders()}
                    </div>
                );
            case 'addresses':
                return (
                    <div className="bg-gray-800 rounded-lg p-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-white mb-4">My Addresses</h2>
                        <div className="border border-gray-700 rounded-lg p-4 mb-4">
                            <p className="font-semibold text-white">Primary Address</p>
                            <p className="text-gray-400">123 Innovation Drive, Tech City, 54321</p>
                        </div>
                        <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Add New Address</button>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-gray-800 rounded-lg p-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Full Name</label>
                                <input type="text" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" defaultValue={currentUser.displayName} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Email Address</label>
                                <input type="email" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" defaultValue={currentUser.email} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">New Password</label>
                                <input type="password" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                            </div>
                            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Save Changes</button>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div id="profile" className="page active">
            <div className="bg-gray-800 py-12">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-bold text-white">Welcome, {currentUser.displayName}!</h1>
                    <p className="text-gray-400 mt-2">Manage your orders, addresses, and account details.</p>
                </div>
            </div>
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-1/4">
                        <div className="bg-gray-800 rounded-lg p-4">
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className={`w-full flex items-center gap-3 p-3 rounded-md transition-all duration-200 ${activeTab === 'orders' ? 'bg-gray-700 text-amber-400 translate-x-1' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                    >
                                        <Package size={20} /> My Orders
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('addresses')}
                                        className={`w-full flex items-center gap-3 p-3 rounded-md transition-all duration-200 ${activeTab === 'addresses' ? 'bg-gray-700 text-amber-400 translate-x-1' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                    >
                                        <MapPin size={20} /> My Addresses
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('settings')}
                                        className={`w-full flex items-center gap-3 p-3 rounded-md transition-all duration-200 ${activeTab === 'settings' ? 'bg-gray-700 text-amber-400 translate-x-1' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                    >
                                        <Settings size={20} /> Account Settings
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </aside>
                    {/* Main Content */}
                    <main className="w-full md:w-3/4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Profile;
