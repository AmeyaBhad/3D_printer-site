import React, { useEffect, useRef, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min'; // Using NET to match original site
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

const heroContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const heroItem = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const Home = () => {
    const vantaRef = useRef(null);
    const scrollerRef = useRef(null);
    const { products, productsLoading, productsError } = useContext(ShopContext);

    // Filter out archived products for display
    const visibleProducts = products.filter(p => !p.isArchived);
    const [isHoveringScroller, setIsHoveringScroller] = useState(false);

    useEffect(() => {
        let vantaEffect = null;
        if (vantaRef.current) {
            try {
                vantaEffect = NET({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    points: 12.00,
                    maxDistance: 21.00,
                    spacing: 14.00,
                    backgroundColor: 0x111827,
                    color: 0xfbbf24 // amber-400
                });
            } catch (error) {
                console.error("Failed to initialize Vanta effect:", error);
            }
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, []);

    // Scroller Logic
    useEffect(() => {
        let scrollerInterval = null;

        const startScroller = () => {
            scrollerInterval = setInterval(() => {
                if (isHoveringScroller || !scrollerRef.current) return;

                const scroller = scrollerRef.current;
                const card = scroller.querySelector('.product-card');
                if (!card) return;

                const cardWidth = card.offsetWidth + 24; // 24px gap (gap-6 is 1.5rem = 24px)

                let newScrollLeft = scroller.scrollLeft + cardWidth;

                // If we are near the end, scroll back to start
                if (newScrollLeft >= scroller.scrollWidth - scroller.clientWidth - 10) { // -10 buffer
                    newScrollLeft = 0;
                    scroller.scrollTo({ left: 0, behavior: 'smooth' }); // Snap back
                } else {
                    scroller.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
                }
            }, 3000); // 3 seconds interval
        };

        if (!isHoveringScroller) {
            startScroller();
        }

        return () => {
            if (scrollerInterval) clearInterval(scrollerInterval);
        };
    }, [isHoveringScroller, products]);

    return (
        <div id="home" className="page active">
            {/* Hero Section */}
            <section ref={vantaRef} id="hero-section" className="hero-section h-[60vh] md:h-[90vh] flex items-center justify-center text-center text-white relative overflow-hidden">
                <motion.div
                    variants={heroContainer}
                    initial="hidden"
                    animate="show"
                    className="bg-black/50 p-8 md:p-12 rounded-xl z-10 mx-4"
                >
                    <motion.h1 variants={heroItem} className="text-4xl md:text-7xl font-extrabold mb-4 leading-tight">
                        Bringing Imagination to Life
                    </motion.h1>
                    <motion.p variants={heroItem} className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300">
                        Discover unique, high-quality 3D printed models, miniatures, and more.
                    </motion.p>
                    <motion.div variants={heroItem}>
                        <Link
                            to="/products"
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 inline-block shadow-lg shadow-amber-500/20"
                        >
                            Explore Products
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-gray-800">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="container mx-auto px-6"
                >
                    <h2 className="text-3xl font-bold text-center mb-2 text-white">Featured Products</h2>
                    <p className="text-center text-gray-400 mb-12">Handpicked items you're sure to love.</p>

                    <div
                        ref={scrollerRef}
                        className="flex gap-8 overflow-x-auto pb-4 px-4 scrollbar-hide"
                        onMouseEnter={() => setIsHoveringScroller(true)}
                        onMouseLeave={() => setIsHoveringScroller(false)}
                    >
                        {productsLoading ? (
                            <p className="text-gray-400 w-full text-center py-12">Loading products...</p>
                        ) : productsError ? (
                            <p className="text-red-400 w-full text-center py-12">
                                Unable to load products: {productsError}
                            </p>
                        ) : visibleProducts.length > 0 ? (
                            visibleProducts.map(product => (
                                <div key={product.id} className="min-w-[300px] flex-shrink-0">
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 w-full text-center">No featured products available.</p>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* Search and CTA Section */}
            <section className="py-10 bg-gray-900">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/products" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-10 rounded-full text-xl transition-transform transform hover:scale-105 inline-flex items-center shadow-lg shadow-amber-500/20">
                            <Search className="mr-2 -mt-1" />
                            Search Our Collection
                        </Link>
                    </motion.div>
                    <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            { title: 'Have an Idea?', body: 'Want to make a custom made product? We can bring your vision to life.', cta: 'Contact Us', to: '/contact', external: false, color: 'bg-blue-500 hover:bg-blue-600' },
                            { title: 'Explore More', body: 'Find something that you may like from a vast library of models.', cta: 'Visit Printables.com', to: 'https://www.printables.com', external: true, color: 'bg-green-500 hover:bg-green-600' },
                        ].map((card, idx) => (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: idx * 0.15, ease: 'easeOut' }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-gray-800 p-8 rounded-lg text-center flex flex-col shadow-lg hover:shadow-amber-500/10 transition-shadow"
                            >
                                <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                                <p className="text-gray-400 mb-6 flex-grow">{card.body}</p>
                                {card.external ? (
                                    <a href={card.to} target="_blank" rel="noopener noreferrer" className={`mt-auto ${card.color} text-white font-semibold py-2 px-6 rounded-full transition-colors inline-block`}>
                                        {card.cta}
                                    </a>
                                ) : (
                                    <Link to={card.to} className={`mt-auto ${card.color} text-white font-semibold py-2 px-6 rounded-full transition-colors inline-block`}>
                                        {card.cta}
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
