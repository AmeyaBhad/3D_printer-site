import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

const Products = () => {
    const { products } = useContext(ShopContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('trending');

    // Filter out archived products first
    const visibleProducts = products.filter(p => !p.isArchived);

    const filteredProducts = visibleProducts
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortOption === 'price-low') return a.price - b.price;
            if (sortOption === 'price-high') return b.price - a.price;
            // Add other sort options as needed
            return 0;
        });

    return (
        <div id="products" className="page active">
            <div className="bg-gray-800 py-12">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl font-bold text-white">Our Collection</h1>
                    <p className="text-gray-400 mt-2">Browse through our ever-growing library of 3D printed wonders.</p>
                </div>
            </div>
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center space-x-4 bg-gray-800 p-2 rounded-lg">
                        <span className="text-gray-400">Sort by:</span>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="bg-gray-700 text-white border-gray-600 rounded-md focus:ring-amber-500 focus:border-amber-500 outline-none p-1"
                        >
                            <option value="trending">Trending</option>
                            <option value="views">Most Viewed</option>
                            <option value="likes">Most Liked</option>
                            <option value="rating">Highest Rated</option>
                            <option value="newest">Newest Uploads</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white focus:ring-amber-500 focus:border-amber-500 outline-none pl-10"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-500"><Search className="h-5 w-5" /></span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {filteredProducts.length === 0 && (
                    <p className="text-center text-gray-400 mt-8">No products found.</p>
                )}
            </div>
        </div>
    );
};

export default Products;
