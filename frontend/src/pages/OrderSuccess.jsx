import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const { id } = useParams();

  // Estimate delivery 3 days from now
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center animate-fadeIn">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 mb-6">
          <svg className="h-12 w-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Successful!</h2>
        <p className="text-gray-500 mb-8">Thank you for your purchase. We've received your order and are getting it ready.</p>
        
        <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 border border-gray-100">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-500 block mb-1">Order ID</span>
            <span className="text-lg font-bold text-gray-900">#{String(id).padStart(6, '0')}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 block mb-1">Estimated Delivery</span>
            <span className="font-semibold text-gray-900">{formattedDate}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Link 
            to="/profile" 
            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition"
          >
            View My Orders
          </Link>
          <Link 
            to="/products" 
            className="w-full flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
