import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, User, LogOut, BookmarkCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#1F3D2B] text-[#F7F4EC] shadow-md border-b border-[#2E5940]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border-2 border-[#A8541F] flex items-center justify-center bg-[#2E5940] group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 text-[#F7F4EC]" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-wider text-[#F7F4EC] group-hover:text-amber-200 transition-colors">
            NATOURS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/tours"
            className={`font-mono text-sm tracking-wide uppercase transition-colors hover:text-amber-200 ${
              isActive('/tours') ? 'text-amber-300 font-semibold border-b-2 border-amber-300 pb-1' : 'text-[#F7F4EC]/90'
            }`}
          >
            All Expeditions
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-bookings"
                className={`font-mono text-sm tracking-wide uppercase flex items-center gap-1.5 transition-colors hover:text-amber-200 ${
                  isActive('/my-bookings') ? 'text-amber-300 font-semibold border-b-2 border-amber-300 pb-1' : 'text-[#F7F4EC]/90'
                }`}
              >
                <BookmarkCheck className="w-4 h-4 text-[#A8541F]" />
                <span>My Bookings</span>
              </Link>

              <div className="flex items-center gap-4 pl-4 border-l border-[#2E5940]">
                <Link
                  to="/me"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2E5940] border border-[#A8541F]/40 hover:border-[#A8541F] transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#A8541F] flex items-center justify-center text-xs font-mono font-bold text-white uppercase">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-sm font-medium text-[#F7F4EC] truncate max-w-[120px]">
                    {user?.name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-[#F7F4EC]/80 hover:text-red-300 hover:bg-[#2E5940] transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="font-mono text-sm uppercase px-4 py-2 rounded text-[#F7F4EC] hover:text-amber-200 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-[#A8541F] hover:bg-[#8C4318] text-white text-sm font-mono uppercase px-5 py-2.5 rounded-lg shadow transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded text-[#F7F4EC] hover:bg-[#2E5940]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1F3D2B] border-t border-[#2E5940] px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/tours"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-mono text-sm uppercase text-[#F7F4EC] hover:text-amber-200"
          >
            All Expeditions
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 font-mono text-sm uppercase text-[#F7F4EC] hover:text-amber-200"
              >
                My Bookings
              </Link>
              <Link
                to="/me"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 font-mono text-sm uppercase text-[#F7F4EC] hover:text-amber-200"
              >
                Profile ({user?.name})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 font-mono text-sm uppercase text-red-300"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 font-mono text-sm uppercase border border-[#2E5940] rounded text-[#F7F4EC]"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 font-mono text-sm uppercase bg-[#A8541F] rounded text-white font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
