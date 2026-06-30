import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-950 py-24 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-emerald-500/10 blur-[100px]"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-cyan-500/10 blur-[100px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up">
            <span className="text-xs font-bold tracking-wide text-emerald-300 uppercase">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Connecting Farms & <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Families Everywhere</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
            We are building the most trusted, transparent, and user-friendly digital marketplace for animals, livestock, and pet supplies in the country.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-gray-900 mb-2">50k+</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-black text-gray-900 mb-2">100+</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Cities Covered</div>
              </div>
              <div>
                <div className="text-4xl font-black text-gray-900 mb-2">12k+</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Verified Sellers</div>
              </div>
              <div>
                <div className="text-4xl font-black text-gray-900 mb-2">4.9</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">App Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Our Mission is to Empower Animal Caretakers</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Whether you're a commercial farmer looking to expand your herd, or a family searching for the perfect pet companion, the process should be safe, transparent, and fair.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                By bridging the gap between buyers and verified sellers, we eliminate the middlemen, ensure better prices, and promote higher standards of animal welfare across the board.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-800 font-semibold">
                  <span className="flex h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-sm">✓</span>
                  100% Verified Sellers
                </li>
                <li className="flex items-center gap-3 text-gray-800 font-semibold">
                  <span className="flex h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-sm">✓</span>
                  Secure Direct Messaging
                </li>
                <li className="flex items-center gap-3 text-gray-800 font-semibold">
                  <span className="flex h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-sm">✓</span>
                  Fair & Transparent Pricing
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200 to-cyan-200 rounded-[3rem] transform rotate-3 scale-105 opacity-50 blur-xl"></div>
              <div className="relative rounded-[3rem] aspect-square flex flex-col justify-center items-center text-white shadow-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=800" 
                  alt="Farmers building trust" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-emerald-400 font-bold tracking-widest uppercase text-xs">Our Commitment</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">Trust & <br/> Transparency</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Ready to join the community?</h2>
          <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">Create an account today to start browsing premium listings, saving your favorites, and contacting sellers directly.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold px-8 py-4 rounded-2xl transition shadow-lg hover:shadow-xl hover:-translate-y-1">
              Create Free Account
            </Link>
            <Link to="/products" className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-lg font-bold px-8 py-4 rounded-2xl transition shadow-sm hover:-translate-y-1">
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
