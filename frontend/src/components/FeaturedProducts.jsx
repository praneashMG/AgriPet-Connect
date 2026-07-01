import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products?limit=4');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.slice(0, 4)); // Display top 4
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-24 bg-[#fafcfa] relative border-t border-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Essential Supplies</h2>
            <p className="text-slate-500 mt-4 text-lg">Top-rated feed, medicine, and care products for optimal animal health.</p>
          </div>
          <Link to="/products" className="group inline-flex items-center justify-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-7 py-3.5 rounded-full hover:bg-emerald-100 transition-colors">
            Shop All Products
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {loading ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          ) : products.map((prod, idx) => (
            <div key={prod.id || idx} className="group bg-white rounded-[28px] border border-slate-100 p-2 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2">
              <div className="h-48 bg-slate-50 rounded-[20px] flex items-center justify-center mb-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/5 z-10 pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
                <img 
                  src={prod.image ? (prod.image.startsWith('http') ? prod.image : `http://localhost:5000/uploads/${prod.image}`) : 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800&q=80'} 
                  alt={prod.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black uppercase text-slate-700 tracking-widest shadow-sm z-20">
                  {prod.category}
                </span>
              </div>
              <div className="px-3 pb-4">
                <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-1 group-hover:text-emerald-600 transition-colors tracking-tight">{prod.name}</h3>
                <p className="text-xs font-semibold text-slate-400 mb-5">{prod.stock > 0 ? `${prod.stock} in stock` : 'Out of Stock'}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xl font-black text-emerald-600 tracking-tight">₹{parseFloat(prod.price).toLocaleString('en-IN')}</span>
                  <Link to={`/products/${prod.id}`} className="bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors shadow-sm cursor-pointer">
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
