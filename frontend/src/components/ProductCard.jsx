import React, { useContext, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(ShopContext);
    const cardRef = useRef(null);
    const [isPopping, setIsPopping] = useState(false);
    const navigate = useNavigate();

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--x', `${x}px`);
        cardRef.current.style.setProperty('--y', `${y}px`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
    };

    const handleCardClick = (e) => {
        // Prevent triggering if clicked on add to cart button (handled by stopPropagation, but good to be safe)
        if (e.target.closest('button')) return;

        setIsPopping(true);
        setTimeout(() => {
            setIsPopping(false);
            navigate(`/product/${product.id}`);
        }, 300);
    };

    const stockStatus = product.stock > 0
        ? <span className="text-xs font-bold text-green-400">{product.stock} in stock</span>
        : <span className="text-xs font-bold text-yellow-400">Made to Order</span>;

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onClick={handleCardClick}
            className={`product-card bg-gray-900 rounded-lg overflow-hidden cursor-pointer shadow-lg group relative ${isPopping ? 'animate-pop' : ''}`}
        >
            {/* Gradient Border Effect */}
            <div
                className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                style={{
                    boxSizing: 'border-box',
                    padding: '2px', // Border width
                    background: 'radial-gradient(600px at var(--x, 0px) var(--y, 0px), rgba(251, 191, 36, 0.7), transparent 75%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            ></div>

            <div className="overflow-hidden relative z-10">
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/2d3748/ffffff?text=Image+Error'; }} />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {product.stock > 0 ? (
                    <button onClick={handleAddToCart} className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 z-20">
                        Add to Cart
                    </button>
                ) : (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 w-auto group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-20">
                        <p className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full whitespace-nowrap">
                            View Details
                        </p>
                    </div>
                )}
            </div>
            <div className="p-5 z-10 relative bg-gray-900 h-full">
                <h3 className="text-xl font-bold text-white truncate">{product.name}</h3>
                <p className="text-gray-400 mb-3">{product.category}</p>
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-400">${product.price.toFixed(2)}</span>
                    {stockStatus}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
