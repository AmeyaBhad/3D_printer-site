import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import { ShopProvider } from './context/ShopContext';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {[
          { path: '/', element: <Home /> },
          { path: '/products', element: <Products /> },
          { path: '/product/:id', element: <ProductDetails /> },
          { path: '/about', element: <About /> },
          { path: '/contact', element: <Contact /> },
          { path: '/login', element: <Login /> },
          { path: '/profile', element: <Profile /> },
          { path: '/admin', element: <Admin /> },
        ].map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={(
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {element}
              </motion.div>
            )}
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ShopProvider>
      <Router>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Router>
    </ShopProvider>
  );
}

export default App;
