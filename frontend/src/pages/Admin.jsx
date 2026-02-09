import React, { useContext, useEffect, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ArrowLeft, Plus, Trash2, RefreshCcw, Package } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Admin = () => {
    const { products, currentUser, addProduct, toggleProductStatus } = useContext(ShopContext);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showArchived, setShowArchived] = useState(false);

    // New Product State
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: 'Toys',
        description: '',
        image: 'https://placehold.co/400x400/2d3748/ffffff?text=New+Product',
        stock: 0
    });

    if (!currentUser || currentUser.role !== 'admin') {
        return <div className="text-center text-white py-20">Access Denied. Admins only.</div>;
    }

    const activeProducts = products.filter(p => !p.isArchived);
    const archivedProducts = products.filter(p => p.isArchived);

    const totalViews = products.reduce((sum, p) => sum + (p.analytics?.views || 0), 0);
    const totalRevenue = products.reduce((sum, p) => sum + (p.analytics?.revenue || 0), 0);
    const totalUnitsSold = products.reduce((sum, p) => sum + (p.analytics?.unitsSold || 0), 0);

    const handleAddProduct = (e) => {
        e.preventDefault();
        addProduct({
            ...newProduct,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock)
        });
        setNewProduct({
            name: '',
            price: '',
            category: 'Toys',
            description: '',
            image: 'https://placehold.co/400x400/2d3748/ffffff?text=New+Product',
            stock: 0
        });
        alert('Product added successfully!');
    };

    const renderDashboard = () => (
        <div className="space-y-12 animate-fadeIn">
            {/* Analytics Section */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Site-Wide Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-700 p-5 rounded-lg"><h3 className="text-gray-400 text-sm font-medium">Total Views</h3><p className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</p></div>
                    <div className="bg-gray-700 p-5 rounded-lg"><h3 className="text-gray-400 text-sm font-medium">Total Sales</h3><p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
                    <div className="bg-gray-700 p-5 rounded-lg"><h3 className="text-gray-400 text-sm font-medium">Units Sold</h3><p className="text-3xl font-bold text-white">{totalUnitsSold.toLocaleString()}</p></div>
                    <div className="bg-gray-700 p-5 rounded-lg"><h3 className="text-gray-400 text-sm font-medium">Active Products</h3><p className="text-3xl font-bold text-white">{activeProducts.length}</p></div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-6">Product Performance</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {activeProducts.map(product => (
                        <div key={product.id} className="bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200" onClick={() => setSelectedProduct(product)}>
                            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white truncate">{product.name}</h3>
                                <p className="text-sm text-gray-400">Click to view details</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Management Section */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Package className="text-amber-500" /> Product Management
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Product Form */}
                    <div className="bg-gray-700 p-6 rounded-lg lg:col-span-1">
                        <h3 className="text-xl font-bold text-white mb-4">Add New Product</h3>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Product Name"
                                required
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white focus:outline-none focus:border-amber-500"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    placeholder="Price"
                                    required
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white focus:outline-none focus:border-amber-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    required
                                    value={newProduct.stock}
                                    onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                    className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>
                            <select
                                value={newProduct.category}
                                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white focus:outline-none focus:border-amber-500"
                            >
                                <option value="Toys">Toys</option>
                                <option value="Home Decor">Home Decor</option>
                                <option value="Gadgets">Gadgets</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                            <textarea
                                placeholder="Description"
                                value={newProduct.description}
                                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-white focus:outline-none focus:border-amber-500 h-24"
                            />
                            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2">
                                <Plus size={18} /> Add Product
                            </button>
                        </form>
                    </div>

                    {/* Inventory List */}
                    <div className="bg-gray-700 p-6 rounded-lg lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Inventory Control</h3>
                            <button
                                onClick={() => setShowArchived(!showArchived)}
                                className="text-sm text-amber-400 hover:text-amber-300 underline"
                            >
                                {showArchived ? 'Show Active Products' : 'Show Removed Products'}
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {(showArchived ? archivedProducts : activeProducts).length === 0 && (
                                <p className="text-gray-400 text-center py-4">No {showArchived ? 'removed' : 'active'} products found.</p>
                            )}

                            {(showArchived ? archivedProducts : activeProducts).map(product => (
                                <div key={product.id} className="flex items-center justify-between bg-gray-800 p-3 rounded hover:bg-gray-600 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                        <div>
                                            <p className="font-medium text-white">{product.name}</p>
                                            <p className="text-xs text-gray-400">${product.price} • {product.stock} in stock</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleProductStatus(product.id)}
                                        className={`p-2 rounded-full transition-colors ${showArchived ? 'text-green-400 hover:bg-green-400/10' : 'text-red-400 hover:bg-red-400/10'}`}
                                        title={showArchived ? "Restore Product" : "Remove Product"}
                                    >
                                        {showArchived ? <RefreshCcw size={18} /> : <Trash2 size={18} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProductDetail = () => {
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'Units Sold',
                    data: selectedProduct.analytics.salesData,
                    borderColor: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    tension: 0.4,
                },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af' } },
                x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af' } }
            },
            plugins: { legend: { display: false } }
        };

        return (
            <div className="bg-gray-800 rounded-lg p-6 animate-fadeIn">
                <button onClick={() => setSelectedProduct(null)} className="text-amber-400 hover:text-amber-500 mb-6 flex items-center"><ArrowLeft className="mr-2" size={20} /> Back to Dashboard</button>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-1/3">
                        <img src={selectedProduct.image} alt={selectedProduct.name} className="rounded-lg shadow-lg w-full" />
                        <h2 className="text-3xl font-bold text-white mt-4">{selectedProduct.name}</h2>
                        <p className="text-gray-400 text-lg">${selectedProduct.price.toFixed(2)}</p>
                    </div>
                    <div className="w-full md:w-2/3">
                        <h3 className="text-2xl font-bold text-white mb-4">Analytics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-700 p-4 rounded-lg text-center"><h4 className="text-gray-400 text-sm">Views</h4><p className="text-2xl font-bold text-white">{selectedProduct.analytics.views.toLocaleString()}</p></div>
                            <div className="bg-gray-700 p-4 rounded-lg text-center"><h4 className="text-gray-400 text-sm">Units Sold</h4><p className="text-2xl font-bold text-white">{selectedProduct.analytics.unitsSold.toLocaleString()}</p></div>
                            <div className="bg-gray-700 p-4 rounded-lg text-center"><h4 className="text-gray-400 text-sm">Revenue</h4><p className="text-2xl font-bold text-white">${selectedProduct.analytics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Sales Trend</h3>
                        <div className="bg-gray-700 p-4 rounded-lg h-64">
                            <Line data={data} options={options} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div id="admin" className="page active">
            <div className="bg-gray-800 py-12">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-2">Site overview and management.</p>
                </div>
            </div>
            <div className="container mx-auto px-6 py-12">
                {selectedProduct ? renderProductDetail() : renderDashboard()}
            </div>
        </div>
    );
};

export default Admin;
