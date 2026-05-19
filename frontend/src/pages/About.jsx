import React from 'react';

const About = () => {
    return (
        <div id="about" className="page active">
            <div className="bg-gray-800 py-12">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl font-bold text-white">About 3DForge</h1>
                    <p className="text-gray-400 mt-2">Where technology meets craftsmanship.</p>
                </div>
            </div>
            <div className="container mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <img src="https://placehold.co/600x400/374151/ffffff?text=Our+Workshop" alt="Our Workshop" className="rounded-lg shadow-2xl" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
                        <p className="text-gray-400 mb-4">3DForge was born from a shared passion for innovation and design. We saw the incredible potential of 3D printing to create not just prototypes, but beautiful, functional, and personalized objects.</p>
                        <h3 className="text-2xl font-bold text-white mb-4 mt-8">Our Mission</h3>
                        <p className="text-gray-400">Our mission is to make high-quality, custom 3D printed products accessible to everyone. We believe in the power of creation and aim to provide a platform where artists can showcase their work and customers can find truly unique items that resonate with them.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
