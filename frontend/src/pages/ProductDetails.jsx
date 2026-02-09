import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart } = useContext(ShopContext);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const foundProduct = products.find(p => p.id === parseInt(id));
        if (foundProduct) {
            setProduct(foundProduct);
        } else {
            // Handle not found locally, might need to wait for fetch in real app
        }
    }, [id, products]);

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                    <Link to="/products" className="text-amber-400 hover:text-amber-300 underline">Return to Products</Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </button>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl animate-fade-in">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-auto object-cover rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-500"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/2d3748/ffffff?text=Image+Error'; }}
                        />
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-center animate-slide-in-right">
                        <span className="text-amber-400 font-semibold tracking-wider uppercase mb-2">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>

                        {/* Rating (Mock) */}
                        <div className="flex items-center mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < (product.analytics?.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                            ))}
                            <span className="ml-2 text-gray-400 text-sm">({product.analytics?.views || 0} reviews)</span>
                        </div>

                        <p className="text-3xl font-bold text-white mb-6">${product.price.toFixed(2)}</p>

                        <div className="prose prose-invert max-w-none text-gray-300 mb-8">
                            <p>{product.description || "No description available for this product."}</p>
                        </div>

                        {/* Stock & Action */}
                        <div className="border-t border-gray-700 pt-8 mt-auto">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-gray-400">Availability:</span>
                                {product.stock > 0 ? (
                                    <span className="text-green-400 font-bold flex items-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                        In Stock ({product.stock})
                                    </span>
                                ) : (
                                    <span className="text-yellow-400 font-bold flex items-center">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                                        Made to Order
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0 && false} // Allow requesting made-to-order? For now let's assume yes or use logic from card
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {product.stock > 0 ? "Add to Cart" : "Request Order"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
