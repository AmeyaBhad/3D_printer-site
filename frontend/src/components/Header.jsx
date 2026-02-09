import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cart, currentUser, isCartOpen, setIsCartOpen, logout } = useContext(ShopContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'text-amber-400 after:w-full' : 'text-gray-300 hover:text-white';

    return (
        <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/20">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-3xl font-bold text-white nav-link">
                    <span className="text-amber-400">3D</span>Forge
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className={`nav-item text-lg relative transition-colors duration-300 ${isActive('/')}`}>Home</Link>
                    <Link to="/products" className={`nav-item text-lg relative transition-colors duration-300 ${isActive('/products')}`}>Products</Link>
                    <Link to="/about" className={`nav-item text-lg relative transition-colors duration-300 ${isActive('/about')}`}>About</Link>
                    <Link to="/contact" className={`nav-item text-lg relative transition-colors duration-300 ${isActive('/contact')}`}>Contact</Link>
                    {currentUser && currentUser.role === 'user' && (
                        <Link to="/profile" className={`nav-item text-lg relative transition-colors duration-300 ${isActive('/profile')}`}>Profile</Link>
                    )}
                    {currentUser && currentUser.role === 'admin' && (
                        <Link to="/admin" className={`nav-item text-lg relative transition-colors duration-300 ${isActive('/admin')}`}>Admin</Link>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={() => setIsCartOpen(true)} className="relative text-gray-300 hover:text-amber-400 transition-colors">
                        <ShoppingCart />
                        <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cart.length}
                        </span>
                    </button>

                    {currentUser ? (
                        <button onClick={handleLogout} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                            Login
                        </Link>
                    )}

                    <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-800 absolute w-full left-0 top-full">
                    <Link to="/" className="block py-2 px-4 text-sm hover:bg-gray-700 text-white" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/products" className="block py-2 px-4 text-sm hover:bg-gray-700 text-white" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
                    <Link to="/about" className="block py-2 px-4 text-sm hover:bg-gray-700 text-white" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                    <Link to="/contact" className="block py-2 px-4 text-sm hover:bg-gray-700 text-white" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                    {currentUser && currentUser.role === 'user' && (
                        <Link to="/profile" className="block py-2 px-4 text-sm hover:bg-gray-700 text-white" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                    )}
                    {currentUser && currentUser.role === 'admin' && (
                        <Link to="/admin" className="block py-2 px-4 text-sm hover:bg-gray-700 text-white" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
