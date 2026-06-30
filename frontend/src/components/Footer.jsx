import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="about" className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-900 overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        {/* Brand Column */}
        <div className="md:col-span-2">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5 mb-5 w-fit">
            <span className="text-emerald-500">PGR</span> Market
          </Link>
          <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
            Connecting farmers, breeders, and pet owners worldwide for safe trading of animals and premium farm essentials with a focus on trust and quality.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-slate-100 font-bold text-sm tracking-widest mb-6 uppercase">Platform</h3>
          <ul className="space-y-3.5 text-sm font-medium">
            <li><Link to="/animals" className="text-slate-500 hover:text-emerald-500 transition-colors duration-200 block w-fit">Animals Marketplace</Link></li>
            <li><Link to="/products" className="text-slate-500 hover:text-emerald-500 transition-colors duration-200 block w-fit">Feeds & Accessories</Link></li>
            <li><Link to="/" className="text-slate-500 hover:text-emerald-500 transition-colors duration-200 block w-fit">About Our Platform</Link></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-slate-100 font-bold text-sm tracking-widest mb-6 uppercase">Connect</h3>
          <p className="text-sm font-medium text-slate-500 mb-5 hover:text-white transition-colors cursor-pointer w-fit">
            support@pgrmarket.com
          </p>
          
          <div className="flex gap-4">
            {/* Website / Global */}
            <a href="#" className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </a>
            {/* Message / Twitter */}
            <a href="#" className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </a>
            {/* Instagram / Photos */}
            <a href="#" className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800/80 text-center relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 font-medium tracking-wide">
          &copy; {new Date().getFullYear()} PGR Market App. All rights reserved.
        </p>
       
      </div>
    </footer>
  );
};

export default Footer;