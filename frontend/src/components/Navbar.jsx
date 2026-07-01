import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, wishlistCount, cartCount } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLoggedIn = !!user;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const activeClass = ({ isActive }) => 
    `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-emerald-600' : 'text-gray-600 hover:text-gray-900'}`;

  const mobileActiveClass = ({ isActive }) =>
    `block px-4 py-2.5 text-sm font-medium transition-colors duration-200 rounded-lg ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200' : 'bg-white border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-1.5 group">
              <span className="text-emerald-600">PGR</span> Market
            </Link>
            
            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8">
              <NavLink to="/" className={activeClass}>Home</NavLink>
              <NavLink to="/animals" className={activeClass}>Animals</NavLink>
              <NavLink to="/products" className={activeClass}>Products</NavLink>
              <NavLink to="/about" className={activeClass}>About</NavLink>
            </div>
          </div>

          {/* Desktop Auth/Actions */}
          <div className="hidden lg:flex items-center gap-6">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2 rounded-full transition-all hover:shadow-md hover:-translate-y-0.5">
                  Create Account
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-5">
                {user.role === 'admin' ? (
                  <NavLink to="/admin-dashboard" className="text-sm font-bold text-white bg-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors shadow-sm">
                    Admin Dashboard
                  </NavLink>
                ) : (
                  <>
                    <NavLink to="/wishlist" className="relative group text-gray-400 hover:text-rose-500 transition-colors p-1 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {wishlistCount > 0 && (
                        <span className="absolute -top-0.5 -right-1 bg-rose-500 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center border border-white shadow-xs">
                          {wishlistCount}
                        </span>
                      )}
                    </NavLink>
                    <NavLink to="/cart" className="relative group text-gray-400 hover:text-emerald-600 transition-colors p-1 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {cartCount > 0 && (
                        <span className="absolute -top-0.5 -right-1 bg-emerald-500 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center border border-white shadow-xs">
                          {cartCount}
                        </span>
                      )}
                    </NavLink>
                  </>
                )}
                
                <div className="h-4 w-px bg-gray-200 mx-1"></div>
                
                <NavLink to="/profile" className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-colors flex items-center justify-center bg-emerald-100 text-emerald-700 text-xs font-bold ring-2 ring-transparent shadow-sm">
                  {user.profile_image ? (
                    <img src={`https://agripet-connect.onrender.com/uploads/${user.profile_image}`} alt="Profile" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </NavLink>
                <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-rose-600 transition-colors cursor-pointer">
                  Log out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-4">
            {isLoggedIn && (
              <div className="flex items-center gap-4 mr-2">
                <NavLink to="/wishlist" className="relative text-gray-400 hover:text-rose-500 transition-colors p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-1 bg-rose-500 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center border border-white">
                      {wishlistCount}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/cart" className="relative text-gray-400 hover:text-emerald-600 transition-colors p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-1 bg-emerald-500 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </div>
            )}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors focus:outline-hidden"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`lg:hidden absolute w-full bg-white shadow-xl border-b border-gray-100 transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
        <div className="px-4 py-5 max-w-7xl mx-auto flex flex-col gap-1">
          <NavLink to="/" className={mobileActiveClass}>Home</NavLink>
          <NavLink to="/animals" className={mobileActiveClass}>Animals</NavLink>
          <NavLink to="/products" className={mobileActiveClass}>Products</NavLink>
          <NavLink to="/about" className={mobileActiveClass}>About</NavLink>

          <div className="h-px bg-gray-100 my-3"></div>

          {!isLoggedIn ? (
            <div className="flex flex-col gap-2 pt-1 pb-2">
              <Link to="/login" className="block w-full text-center py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="block w-full text-center py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors">
                Create Account
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-1 pb-2">
              <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-lg mb-2">
                <div className="relative h-9 w-9 shrink-0 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold uppercase overflow-hidden">
                  {user.profile_image ? (
                    <img src={`https://agripet-connect.onrender.com/uploads/${user.profile_image}`} alt="Profile" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <NavLink to="/profile" className={mobileActiveClass}>Profile Dashboard</NavLink>
              <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mt-1">
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;