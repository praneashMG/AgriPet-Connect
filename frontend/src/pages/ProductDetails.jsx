import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { user, token, refreshCounts } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryIcons = {
    'Cow Feed': '🌾',
    'Goat Feed': '🌿',
    'Dog Food': '🍖',
    'Cat Food': '🐟',
    'Bird Food': '🐦',
    'Medicine': '💊',
    'Accessories': '🪮',
    'Default': '📦'
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://agripet-connect.onrender.com/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product details could not be loaded.');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToWishlist = async (productId) => {
    try {
      const response = await fetch('https://agripet-connect.onrender.com/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Added to wishlist successfully!');
        refreshCounts();
      } else {
        alert(data.message || 'Failed to add to wishlist');
      }
    } catch (err) {
      console.error(err);
      alert('Network error adding to wishlist');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch('https://agripet-connect.onrender.com/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Added to cart successfully!');
        refreshCounts();
      } else {
        alert(data.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error(err);
      alert('Network error adding to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-12 max-w-xl mx-auto px-4 text-center">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-5xl block mb-4">😿</span>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Details Not Found</h3>
          <p className="text-sm text-gray-500 mb-6">{error || 'This listing does not exist.'}</p>
          <Link to="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl transition">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const icon = categoryIcons[product.category] || categoryIcons.Default;
  const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `https://agripet-connect.onrender.com/uploads/${product.image}`) : null;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Back Link */}
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 mb-6 transition cursor-pointer">
        <span>←</span> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Side: Photo Display */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs p-3">
          <div className="aspect-video lg:aspect-square bg-gray-50 rounded-xl relative flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="text-center">
                <span className="text-9xl block mb-2">{icon}</span>
                <span className="text-sm font-semibold text-gray-400 bg-gray-200 px-3 py-1 rounded-md">No Image Available</span>
              </div>
            )}
            <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              {product.category}
            </div>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                <span className="bg-red-600 text-white text-base font-black px-4 py-2 rounded-xl tracking-wider uppercase shadow-md">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Data Specs */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-950 tracking-tight">
              {product.name}
            </h1>
            <p className="text-emerald-600 font-bold text-2xl lg:text-3xl mt-2">
              ₹{parseFloat(product.price).toLocaleString('en-IN')}
            </p>

            {/* Spec Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                <span className="block text-xs font-semibold text-gray-400 uppercase">Category</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{product.category}</span>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                <span className="block text-xs font-semibold text-gray-400 uppercase">Availability</span>
                <span className={`font-bold mt-0.5 block ${isOutOfStock ? 'text-red-600' : 'text-gray-900'}`}>
                  {isOutOfStock ? 'Sold Out' : `${product.stock} Units Available`}
                </span>
              </div>
            </div>

            {/* Cart & Wishlist Actions */}
            {user && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={isOutOfStock}
                  className="flex-grow py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(5,150,105,0.2)] hover:shadow-[0_6px_16px_rgba(5,150,105,0.3)] hover:-translate-y-0.5 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddToWishlist(product.id)}
                  className="px-6 py-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 hover:border-rose-200 text-rose-600 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Wishlist
                </button>
              </div>
            )}

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description || 'No description provided by the seller.'}
              </p>
            </div>
          </div>

          {/* Seller Contact Card */}
          <div className="mt-8 border border-emerald-100 bg-emerald-50/50 p-6 rounded-2xl">
            <h3 className="text-base font-bold text-emerald-900 mb-4 flex items-center gap-1.5">
              <span>📞</span> Seller Information
            </h3>

            {user ? (
              <div className="space-y-2.5 text-sm">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-800">Listed By:</span>
                  <span className="text-gray-900 font-medium">{product.seller_name}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-800">Email:</span>
                  <a href={`mailto:${product.seller_email}`} className="text-emerald-700 font-bold hover:underline">
                    {product.seller_email}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-800">Phone:</span>
                  <a href={`tel:${product.seller_phone}`} className="text-emerald-700 font-bold hover:underline">
                    {product.seller_phone || 'Not provided'}
                  </a>
                </p>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500 mb-4">Please register or log in to view the seller's contact details.</p>
                <Link
                  to="/login"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition inline-block shadow-xs cursor-pointer"
                >
                  Log In to Contact Seller
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
