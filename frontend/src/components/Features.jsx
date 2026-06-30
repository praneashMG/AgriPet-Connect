import React from 'react';

const Features = () => {
  const features = [
    {
      title: 'Verified Sellers',
      description: 'Every seller undergoes a strict verification process to ensure authenticity, safety, and high standards.',
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
      )
    },
    {
      title: 'Direct Communication',
      description: 'Negotiate securely with trusted farmers and breeders through our transparent platform without middlemen.',
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
      )
    },
    {
      title: 'Premium Quality',
      description: 'Access a wide network of highly-rated, healthy animals and top-tier agricultural products.',
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
      )
    }
  ];

  return (
    <section className="relative py-28 bg-white overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">Our Promise</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Why Choose PGR Market?</h3>
          <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We provide a transparent, safe, and highly efficient marketplace designed to simplify your agricultural and pet needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="group relative p-8 rounded-[32px] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent rounded-[32px] pointer-events-none"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100/50 flex items-center justify-center mb-8 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-500 ease-out">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
