import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { X, Minus, Plus } from 'lucide-react';

const CartModal = () => {
    const {
        isCartOpen, setIsCartOpen, cart,
        removeFromCart, updateCartQuantity,
        currentUser, placeOrder, paymentsEnabled,
    } = useContext(ShopContext);
    const [checkoutError, setCheckoutError] = useState('');
    const [checkoutSuccess, setCheckoutSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        setCheckoutError('');
        setCheckoutSuccess('');
        if (!currentUser) {
            setCheckoutError('Please log in to place an order.');
            return;
        }
        setSubmitting(true);
        try {
            const result = await placeOrder();
            setCheckoutSuccess(result.paid
                ? `Payment successful — order #${result.order.id} confirmed.`
                : `Order #${result.order.id} placed successfully.`);
        } catch (err) {
            setCheckoutError(err.message || 'Checkout failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <motion.div
                    key="cart-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/70 z-[100] flex justify-center items-center backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsCartOpen(false); }}
                >
                    <motion.div
                        key="cart-panel"
                        initial={{ opacity: 0, scale: 0.94, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 16 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="bg-gray-800 w-11/12 md:w-2/3 lg:w-1/2 max-w-4xl rounded-lg shadow-2xl relative max-h-[90vh] flex flex-col"
                    >
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
                        <AnimatePresence>
                        {cart.map(item => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
                                transition={{ duration: 0.25 }}
                                className="flex items-center justify-between mb-4 border-b border-gray-700 pb-4 last:border-0"
                            >
                                <div className="flex items-center space-x-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                    <div>
                                        <h3 className="font-bold text-white">{item.name}</h3>
                                        <p className="text-gray-400">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-gray-700 rounded-md">
                                        <button
                                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                            className="p-1 text-gray-300 hover:text-white"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="text-white w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                            className="p-1 text-gray-300 hover:text-white"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-sm">
                                        Remove
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    )}
                </div>

                <div className="p-6 border-t border-gray-700 mt-auto flex-shrink-0">
                    {checkoutError && <div className="bg-red-500/20 text-red-400 p-2 rounded mb-3 text-sm">{checkoutError}</div>}
                    {checkoutSuccess && <div className="bg-green-500/20 text-green-400 p-2 rounded mb-3 text-sm">{checkoutSuccess}</div>}
                    <div className="flex justify-between items-center text-lg font-bold mb-4">
                        <span className="text-gray-300">Subtotal:</span>
                        <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <motion.button
                        whileHover={{ scale: cart.length === 0 || submitting ? 1 : 1.02 }}
                        whileTap={{ scale: cart.length === 0 || submitting ? 1 : 0.98 }}
                        onClick={handleCheckout}
                        disabled={submitting || cart.length === 0}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        {submitting
                            ? (paymentsEnabled ? 'Opening payment...' : 'Placing order...')
                            : (paymentsEnabled ? 'Pay with Razorpay' : 'Proceed to Checkout')}
                    </motion.button>
                    {!paymentsEnabled && cart.length > 0 && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Payment gateway is not configured — orders will be created without payment.
                        </p>
                    )}
                </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartModal;
