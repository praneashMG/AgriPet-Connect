import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Wishlist = () => {
  const { token, refreshCounts } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchWishlist = async () => {
    try {
      const response = await fetch('https://agripet-connect.onrender.com/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  const handleRemove = async (id) => {
    try {
      const response = await fetch(`https://agripet-connect.onrender.com/api/wishlist/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setWishlistItems(wishlistItems.filter((item) => item.id !== id));
        refreshCounts();
      } else {
        alert('Failed to remove item from wishlist');
      }
    } catch (error) {
      console.error('Remove wishlist error:', error);
    }
  };

  const handleAddToCart = async (productId, animalId, wishlistItemId) => {
    try {
      const payload = {};
      if (productId) payload.product_id = productId;
      if (animalId) payload.animal_id = animalId;
      payload.quantity = 1;

      const response = await fetch('https://agripet-connect.onrender.com/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert('Added to cart successfully!');
        // Optionally, remove from wishlist after adding to cart
        await handleRemove(wishlistItemId);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">My Saved Wishlist</h1>
      <p className="text-gray-500 mb-8">Items you saved for later purchase or comparison.</p>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-xs">
          <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5 shadow-sm border border-rose-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Your wishlist is empty</h3>
          <p className="text-sm text-gray-500 mb-6">Browse products and click the heart icon to save products here.</p>
          <Link to="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl transition inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
          {wishlistItems.map((item) => {
            const icon = categoryIcons[item.category] || categoryIcons.Default;
            const imageUrl = item.image
              ? (item.image.startsWith('http') ? item.image : `https://agripet-connect.onrender.com/uploads/${item.image}`)
              : null;
            const isOutOfStock = item.stock <= 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Photo */}
                <div className="h-44 bg-gray-50 relative flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">{icon}</span>
                  )}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-red-50 text-red-550 border border-gray-100 flex items-center justify-center transition shadow-sm cursor-pointer"
                    title="Remove from wishlist"
                  >
                    ✖
                  </button>
                </div>

                {/* Body details */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-gray-950 text-base mt-2 line-clamp-2 min-h-[2.5rem]">
                      {item.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-gray-950 font-black text-base">
                      ₹{parseFloat(item.price).toLocaleString('en-IN')}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        to={item.animal_id ? `/animals/${item.animal_id}` : `/products/${item.product_id}`}
                        className="text-xs font-semibold bg-gray-100 hover:bg-gray-250 text-gray-700 px-3 py-1.5 rounded-lg transition border border-gray-250 cursor-pointer"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(item.product_id, item.animal_id, item.id)}
                        disabled={isOutOfStock}
                        className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
                      >
                        🛒 Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
