import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

const Contact = () => {
    return (
        <div id="contact" className="page active">
            <div className="bg-gray-800 py-12">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl font-bold text-white">Get In Touch</h1>
                    <p className="text-gray-400 mt-2">We'd love to hear from you. For custom orders, questions, or just to say hello.</p>
                </div>
            </div>
            <div className="container mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-16">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300">Full Name</label>
                            <input type="text" id="contact-name" className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                        <div>
                            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300">Email Address</label>
                            <input type="email" id="contact-email" className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                            <textarea id="message" rows="4" className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"></textarea>
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 transition-colors">
                                Send Message
                            </button>
                        </div>
                    </form>
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3"><MapPin className="text-amber-400" />Address</h3>
                            <p className="text-gray-400 mt-2">New Sangvi, Pimple Gurva, Pune Maharastra 411027</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3"><Mail className="text-amber-400" />Email</h3>
                            <p className="text-gray-400 mt-2">contact@3dforge.com</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3"><Phone className="text-amber-400" />Phone</h3>
                            <p className="text-gray-400 mt-2">+91 9657111331</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
