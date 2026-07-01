import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Animals from './pages/Animals';
import AnimalDetails from './pages/AnimalDetails';
import AddAnimal from './pages/AddAnimal';
import EditAnimal from './pages/EditAnimal';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { AuthProvider, AuthContext } from './context/AuthContext';

function AppContent() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const isLoggedIn = !!user;
  const isAdminDashboard = location.pathname.startsWith('/admin-dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {!isAdminDashboard && <Navbar isLoggedIn={isLoggedIn} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/animals/:id" element={<AnimalDetails />} />
          <Route path="/add-animal" element={isLoggedIn ? <AddAnimal /> : <Navigate to="/login" replace />} />
          <Route path="/edit-animal/:id" element={isLoggedIn ? <EditAnimal /> : <Navigate to="/login" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/add-product" element={isLoggedIn ? <AddProduct /> : <Navigate to="/login" replace />} />
          <Route path="/edit-product/:id" element={isLoggedIn ? <EditProduct /> : <Navigate to="/login" replace />} />
          <Route path="/wishlist" element={isLoggedIn ? <Wishlist /> : <Navigate to="/login" replace />} />
          <Route path="/cart" element={isLoggedIn ? <Cart /> : <Navigate to="/login" replace />} />
          <Route path="/checkout" element={isLoggedIn ? <Checkout /> : <Navigate to="/login" replace />} />
          <Route path="/order-success/:id" element={isLoggedIn ? <OrderSuccess /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={isLoggedIn ? (user.role === 'admin' ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/profile" replace />) : <Login />} />
          <Route path="/register" element={isLoggedIn ? (user.role === 'admin' ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/profile" replace />) : <Register />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/admin-dashboard" element={isLoggedIn && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
