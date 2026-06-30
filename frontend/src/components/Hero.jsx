import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-[#fafcfa] py-24 lg:py-36 font-sans">
      {/* Background Organic Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-100/50 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-amber-100/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 border border-white/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] backdrop-blur-xl mb-10 transition-transform hover:scale-105">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase">The Premier Pet & Farm Network</span>
        </div>
        
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-800 tracking-tight leading-[1.1] mb-8 max-w-4xl">
          Find Your Perfect <br className="hidden sm:block" />
          <span className="relative inline-block sm:whitespace-nowrap mt-2 sm:mt-0">
            <span className="relative z-10 text-emerald-600 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">Animal Companion</span>
            <svg className="absolute -bottom-2 left-0 w-full h-4 text-emerald-200/50 z-0" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          </span>
        </h1>
        
        {/* Subtext */}
        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl leading-relaxed mb-12">
          Connect with trusted breeders and farmers. Discover healthy livestock, pets, and premium agricultural products in a secure, transparent marketplace.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto">
          <Link to="/animals" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-emerald-600 rounded-2xl overflow-hidden transition-all shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.5)] hover:-translate-y-1">
            <span className="relative z-10 flex items-center gap-2">
              Browse Animals
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </span>
          </Link>
          <Link to="/products" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 bg-white/80 border border-slate-200/60 backdrop-blur-xl rounded-2xl transition-all shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-1">
            Shop Products
          </Link>
        </div>

        {/* Floating Glassmorphic Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl w-full perspective-1000">
          {[
            { icon: '🐄', count: '12k+', label: 'Farm Animals', delay: '0' },
            { icon: '🐕', count: '8k+', label: 'Pets Listed', delay: '100' },
            { icon: '📦', count: '15k+', label: 'Products Sold', delay: '200' },
            { icon: '⭐', count: '4.9/5', label: 'User Rating', delay: '300' }
          ].map((stat, idx) => (
            <div key={idx} className="relative group p-[1px] rounded-3xl overflow-hidden transition-transform duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_-10px_rgba(0,0,0,0.05)] rounded-[23px] p-6 text-left flex flex-col justify-between">
                <div className="text-4xl mb-4 drop-shadow-sm group-hover:scale-110 transition-transform duration-300 origin-bottom-left">{stat.icon}</div>
                <div>
                  <div className="text-2xl font-black text-slate-800 tracking-tight">{stat.count}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;