import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Products = () => {
  const { user, token, refreshCounts } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    maxPrice: '',
  });

  const categories = [
    'Cow Feed',
    'Goat Feed',
    'Dog Food',
    'Cat Food',
    'Bird Food',
    'Medicine',
    'Accessories'
  ];

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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      maxPrice: '',
    });
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const response = await fetch('http://localhost:5000/api/wishlist', {
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
      const response = await fetch('http://localhost:5000/api/cart', {
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

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products Marketplace</h1>
          <p className="text-gray-500 mt-1">Quality assured feed, medicine, and accessories for animal care.</p>
        </div>
        {user && (
          <Link
            to="/add-product"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl transition shadow-xs inline-flex items-center gap-2 self-start md:self-center cursor-pointer"
          >
            <span>➕</span> Sell a Product
          </Link>
        )}
      </div>

      {/* Sidebar + Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs self-start lg:sticky lg:top-20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
              <span>🔍</span> Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-5">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Search Keywords</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="e.g. Feed, Vitamin, Collar"
                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Max Price (₹)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="e.g. 5000"
                min="0"
                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-xs">
              <span className="text-5xl block mb-4">📦</span>
              <h3 className="text-xl font-bold text-gray-900 mb-1">No Products Found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => {
                const icon = categoryIcons[product.category] || categoryIcons.Default;
                const imageUrl = product.image
                  ? (product.image.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`)
                  : null;

                const isOutOfStock = product.stock <= 0;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-200 flex flex-col justify-between group animate-fadeIn"
                  >
                    {/* Image Container */}
                    <div className="h-48 bg-gray-50 relative flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-6xl mb-2">{icon}</span>
                          <span className="text-xs font-semibold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-md">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
                        {product.category}
                      </div>

                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                          <span className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-lg tracking-wider uppercase">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-950 text-base group-hover:text-emerald-700 transition line-clamp-2 min-h-[3rem]">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mt-3 text-xs font-semibold">
                          <span className="text-gray-400">Availability</span>
                          {isOutOfStock ? (
                            <span className="text-red-600">No stock</span>
                          ) : (
                            <span className="text-emerald-600">{product.stock} units left</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="text-gray-955 font-black text-lg">
                            ₹{parseFloat(product.price).toLocaleString('en-IN')}
                          </div>
                          <Link
                            to={`/products/${product.id}`}
                            className="text-xs font-bold text-gray-600 bg-gray-150 hover:bg-gray-200 border border-gray-200 px-3 py-2 rounded-lg transition cursor-pointer"
                          >
                            Details
                          </Link>
                        </div>
                        
                        {user && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleAddToWishlist(product.id)}
                              className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              Wishlist
                            </button>
                            <button
                              onClick={() => handleAddToCart(product.id)}
                              disabled={isOutOfStock}
                              className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:bg-slate-50 disabled:border-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              Cart
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Products;
