import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    deliveryOption: 'Standard',
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('https://agripet-connect.onrender.com/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.length === 0) {
        navigate('/cart');
      } else {
        setCartItems(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    setPlacingOrder(true);
    try {
      const payload = {
        items: cartItems,
        shippingDetails,
        paymentMethod,
        totalAmount: total
      };

      const res = await axios.post('https://agripet-connect.onrender.com/api/orders', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      navigate(`/order-success/${res.data.orderId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error placing order');
      setPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
  const deliveryCharge = shippingDetails.deliveryOption === 'Express' ? 150 : 50;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + deliveryCharge + tax;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Shipping Address */}
            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-700 w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
                Shipping Address
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="fullName" required value={shippingDetails.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="text" name="phone" required value={shippingDetails.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" name="address" required value={shippingDetails.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500" placeholder="123 Farm Lane, Suite 100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" name="city" required value={shippingDetails.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500" placeholder="Springfield" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" name="state" required value={shippingDetails.state} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500" placeholder="IL" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                  <input type="text" name="pinCode" required value={shippingDetails.pinCode} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500" placeholder="62701" />
                </div>
              </div>
            </div>

            {/* 2. Delivery Options */}
            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-700 w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
                Delivery Option
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`border rounded-xl p-4 cursor-pointer transition-all ${shippingDetails.deliveryOption === 'Standard' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="deliveryOption" value="Standard" checked={shippingDetails.deliveryOption === 'Standard'} onChange={handleChange} className="text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Standard Delivery</h4>
                      <p className="text-sm text-gray-500">3-5 Business Days (₹50)</p>
                    </div>
                  </div>
                </label>
                <label className={`border rounded-xl p-4 cursor-pointer transition-all ${shippingDetails.deliveryOption === 'Express' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="deliveryOption" value="Express" checked={shippingDetails.deliveryOption === 'Express'} onChange={handleChange} className="text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Express Delivery</h4>
                      <p className="text-sm text-gray-500">1-2 Business Days (₹150)</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-700 w-8 h-8 flex items-center justify-center rounded-full text-sm">3</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['UPI', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery (COD)', 'Wallet'].map((method) => (
                  <label key={method} className={`border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === method ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} className="text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                      <span className="font-medium text-gray-900">{method}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">{item.name} <span className="text-gray-400">x{item.quantity || 1}</span></span>
                    <span className="font-medium text-gray-900 shrink-0">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">₹{deliveryCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (5%)</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-emerald-600">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className={`w-full py-4 px-4 rounded-xl text-white font-bold text-lg shadow-sm transition-all ${placingOrder ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]'}`}
              >
                {placingOrder ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
