import React from 'react';

const Categories = () => {
  const categories = [
    { name: 'Cow', icon: '🐄', count: '120+ Listed', bg: 'bg-blue-50', hover: 'group-hover:bg-blue-100/50', border: 'border-blue-100/50', text: 'text-blue-700' },
    { name: 'Goat', icon: '🐐', count: '85+ Listed', bg: 'bg-amber-50', hover: 'group-hover:bg-amber-100/50', border: 'border-amber-100/50', text: 'text-amber-700' },
    { name: 'Dog', icon: '🐕', count: '210+ Listed', bg: 'bg-emerald-50', hover: 'group-hover:bg-emerald-100/50', border: 'border-emerald-100/50', text: 'text-emerald-700' },
    { name: 'Cat', icon: '🐈', count: '140+ Listed', bg: 'bg-purple-50', hover: 'group-hover:bg-purple-100/50', border: 'border-purple-100/50', text: 'text-purple-700' },
    { name: 'Birds', icon: '🐦', count: '95+ Listed', bg: 'bg-sky-50', hover: 'group-hover:bg-sky-100/50', border: 'border-sky-100/50', text: 'text-sky-700' },
    { name: 'Rabbit', icon: '🐇', count: '40+ Listed', bg: 'bg-pink-50', hover: 'group-hover:bg-pink-100/50', border: 'border-pink-100/50', text: 'text-pink-700' },
  ];

  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Explore by Category</h2>
            <p className="text-lg text-slate-500">Discover the perfect match tailored to your specific needs, verified by our trusted network.</p>
          </div>
          <div className="flex-shrink-0">
            <button className="text-sm font-bold text-slate-600 bg-white border border-slate-200 px-6 py-3 rounded-full hover:bg-slate-50 hover:text-emerald-600 transition-colors shadow-sm">
              View All Categories
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, index) => (
            <div key={index} className={`group relative bg-white border border-slate-100 p-6 rounded-[32px] text-center hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden z-10`}>
              {/* Background fill animation */}
              <div className={`absolute inset-0 opacity-0 ${cat.hover} transition-opacity duration-500 -z-10`}></div>
              
              <div className={`w-20 h-20 mx-auto ${cat.bg} rounded-[24px] flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner border ${cat.border}`}>
                <span className="text-4xl drop-shadow-sm">{cat.icon}</span>
              </div>
              <h3 className={`font-bold ${cat.text} text-lg mb-1 tracking-tight`}>{cat.name}</h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;