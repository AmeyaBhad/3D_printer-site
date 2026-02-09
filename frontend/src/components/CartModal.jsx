import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { X } from 'lucide-react';

const CartModal = () => {
    const { isCartOpen, setIsCartOpen, cart, removeFromCart } = useContext(ShopContext);

    if (!isCartOpen) return null;

    const subtotal = cart.reduce((total, item) => total + item.price, 0);

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex justify-center items-center backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-gray-800 w-11/12 md:w-2/3 lg:w-1/2 max-w-4xl rounded-lg shadow-2xl relative max-h-[90vh] flex flex-col transform scale-100 opacity-100 transition-all duration-300">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white">Your Cart</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                        <X className="h-8 w-8" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    {cart.length === 0 ? (
                        <p className="text-gray-400 text-center">Your cart is empty.</p>
                    ) : (
                        cart.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="flex items-center justify-between mb-4 border-b border-gray-700 pb-4 last:border-0">
                                <div className="flex items-center space-x-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                    <div>
                                        <h3 className="font-bold text-white">{item.name}</h3>
                                        <p className="text-gray-400">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-gray-700 mt-auto flex-shrink-0">
                    <div className="flex justify-between items-center text-lg font-bold mb-4">
                        <span className="text-gray-300">Subtotal:</span>
                        <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartModal;
