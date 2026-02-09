import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(ShopContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        const success = login(email, password);

        if (success) {
            // Redirect based on role
            if (email === 'admin@3dforge.com') {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div id="login" className="page active">
            <div className="container mx-auto px-6 py-20 flex justify-center items-center min-h-[60vh]">
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Member Login</h1>
                        <p className="text-gray-400 mb-8">Enter your credentials to continue.</p>
                        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">{error}</div>}
                        <div className="space-y-6 text-left">
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
                            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors">Login</button>
                        </div>
                        <div className="my-4 text-gray-400">OR</div>
                        <a href="http://localhost:3000/auth/google" className="w-full bg-white text-gray-800 font-semibold py-3 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <svg className="w-6 h-6 mr-2" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                            Sign in with Google
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
