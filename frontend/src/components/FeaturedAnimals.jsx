import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FeaturedAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/animals?limit=3');
        if (response.ok) {
          const data = await response.json();
          setAnimals(data.slice(0, 3)); // Display top 3
        }
      } catch (error) {
        console.error('Error fetching animals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimals();
  }, []);

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Featured Livestock & Pets</h2>
            <p className="text-slate-500 mt-4 text-lg">Handpicked selection of premium animals verified by our expert team.</p>
          </div>
          <Link to="/animals" className="group inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-slate-900 px-7 py-3.5 rounded-full hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-500/30">
            View All Collection
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {loading ? (
            <div className="col-span-3 flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          ) : animals.map((animal, idx) => (
            <div key={animal.id || idx} className="group flex flex-col bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-64 md:h-72 bg-slate-100 overflow-hidden m-2 rounded-[24px]">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-10 pointer-events-none"></div>
                <img 
                  src={animal.image ? (animal.image.startsWith('http') ? animal.image : `http://localhost:5000/uploads/${animal.image}`) : 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&q=80'} 
                  alt={animal.animal_name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase text-slate-800 tracking-widest shadow-sm z-20">
                  {animal.category}
                </div>
              </div>
              
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xl md:text-2xl mb-5 group-hover:text-emerald-600 transition-colors tracking-tight line-clamp-1">{animal.animal_name}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 mb-6">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <span className="text-sm">🎂</span> {animal.age ? `${animal.age} Yrs` : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <span className="text-sm">📍</span> {animal.location || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-100/80">
                  <div className="text-2xl font-black text-slate-900">₹{parseFloat(animal.price).toLocaleString('en-IN')}</div>
                  <Link to={`/animals/${animal.id}`} className="h-12 w-12 bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300 cursor-pointer">
                    <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
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

export default FeaturedAnimals;
