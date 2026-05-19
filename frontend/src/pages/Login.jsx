import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login, register } = useContext(ShopContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password || (mode === 'register' && !displayName)) {
            setError('Please fill in all fields.');
            return;
        }

        setSubmitting(true);
        const result = mode === 'login'
            ? await login(email, password)
            : await register(email, password, displayName);
        setSubmitting(false);

        if (!result.ok) {
            setError(result.message || 'Authentication failed.');
            return;
        }

        if (email === 'admin@3dforge.com') {
            navigate('/admin');
        } else {
            navigate('/profile');
        }
    };

    return (
        <div id="login" className="page active">
            <div className="container mx-auto px-6 py-20 flex justify-center items-center min-h-[60vh]">
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {mode === 'login' ? 'Member Login' : 'Create Account'}
                        </h1>
                        <p className="text-gray-400 mb-8">
                            {mode === 'login' ? 'Enter your credentials to continue.' : 'Sign up to start shopping.'}
                        </p>
                        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">{error}</div>}
                        <div className="space-y-6 text-left">
                            {mode === 'register' && (
                                <div>
                                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">Display Name</label>
                                    <input
                                        type="text"
                                        id="displayName"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        required
                                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                        </div>
                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                {submitting
                                    ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                                    : (mode === 'login' ? 'Login' : 'Create Account')}
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => { setError(''); setMode(mode === 'login' ? 'register' : 'login'); }}
                            className="mt-4 text-sm text-gray-400 hover:text-amber-400 transition-colors"
                        >
                            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
