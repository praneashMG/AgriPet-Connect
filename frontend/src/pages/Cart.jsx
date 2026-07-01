import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { token, refreshCounts } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
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

  const fetchCart = async () => {
    try {
      const response = await fetch('https://agripet-connect.onrender.com/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const handleRemove = async (id) => {
    try {
      const response = await fetch(`https://agripet-connect.onrender.com/api/cart/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.id !== id));
        refreshCounts();
      } else {
        alert('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Remove cart error:', error);
    }
  };

  const handleQuantityChange = async (id, currentQty, stock, increment) => {
    const newQty = increment ? currentQty + 1 : currentQty - 1;

    if (newQty < 1) return;
    if (newQty > stock) {
      alert(`Sorry, only ${stock} units are available in stock.`);
      return;
    }

    try {
      const response = await fetch(`https://agripet-connect.onrender.com/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQty })
      });
      const resData = await response.json();

      if (response.ok) {
        setCartItems(
          cartItems.map((item) =>
            item.id === id ? { ...item, quantity: newQty } : item
          )
        );
        refreshCounts();
      } else {
        alert(resData.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
  const deliveryCharge = subtotal > 0 ? 50 : 0;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + deliveryCharge + tax;

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Shopping Cart</h1>
      <p className="text-gray-500 mb-8">Manage products you selected and complete your order.</p>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-xs max-w-xl mx-auto">
          <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-5 shadow-sm border border-emerald-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Your cart is empty</h3>
          <p className="text-sm text-gray-500 mb-6">You haven't added any products to your cart yet.</p>
          <Link to="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl transition inline-block shadow-xs">
            Shop Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn">
          
          {/* Cart items list on Left */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const icon = categoryIcons[item.category] || categoryIcons.Default;
              const imageUrl = item.image
                ? (item.image.startsWith('http') ? item.image : `https://agripet-connect.onrender.com/uploads/${item.image}`)
                : null;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">{icon}</span>
                      )}
                    </div>
                    {/* Name & price info */}
                    <div>
                      <h4 className="font-bold text-gray-950 text-base line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">{item.category}</p>
                      <p className="text-emerald-700 font-bold text-sm mt-1">
                        ₹{parseFloat(item.price).toLocaleString('en-IN')} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Qty selectors */}
                    <div className="flex items-center gap-2 border border-gray-200 bg-gray-50 p-1.5 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, item.stock, false)}
                        disabled={item.quantity <= 1 || item.animal_id}
                        className="h-7 w-7 rounded-md bg-white hover:bg-gray-150 border border-gray-200 text-gray-700 font-black flex items-center justify-center text-sm disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm text-gray-950 px-2 min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, item.stock, true)}
                        disabled={item.animal_id}
                        className="h-7 w-7 rounded-md bg-white hover:bg-gray-150 border border-gray-200 text-gray-700 font-black flex items-center justify-center text-sm disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Subtotal of item */}
                      <span className="font-extrabold text-gray-950 text-base min-w-[4rem] text-right">
                        ₹{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {/* Delete */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-400 hover:text-red-600 transition duration-150 cursor-pointer p-1"
                        title="Remove product"
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Order Summary Panel on Right */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-6 lg:sticky lg:top-20">
            <h3 className="text-lg font-bold text-gray-950 border-b border-gray-100 pb-3">Order Summary</h3>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-950 font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Delivery Charge</span>
                <span className="text-gray-950 font-bold">₹{deliveryCharge.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Estimated Tax (5%)</span>
                <span className="text-gray-950 font-bold">₹{tax.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between text-base font-black text-gray-950">
                <span>Total Amount</span>
                <span className="text-emerald-700 text-lg">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer text-center text-sm shadow-xs block"
            >
              Proceed to Checkout
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
