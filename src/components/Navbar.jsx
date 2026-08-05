import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLanding = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold gradient-text">Mixy</span>
            <span className="text-2xl font-light gradient-text">Pet Shop</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <ThemeToggle />
            {isLanding && (
              <>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
                <a href="#products" className="text-gray-300 hover:text-white transition-colors">Products</a>
                <a href="#grooming" className="text-gray-300 hover:text-white transition-colors">Grooming</a>
              </>
            )}
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/dashboard/products" className="text-gray-300 hover:text-white transition-colors">Products</Link>
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard/cart" className="relative">
                    <ShoppingCart className="w-5 h-5 text-gray-300 hover:text-white" />
                  </Link>
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-300" />
                    <span className="text-gray-300">{user?.name}</span>
                  </div>
                  <button onClick={handleLogout} className="text-gray-300 hover:text-white transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-dark">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isLanding && (
              <>
                <a href="#about" className="block px-3 py-2 text-gray-300 hover:text-white">About</a>
                <a href="#services" className="block px-3 py-2 text-gray-300 hover:text-white">Services</a>
                <a href="#products" className="block px-3 py-2 text-gray-300 hover:text-white">Products</a>
                <a href="#grooming" className="block px-3 py-2 text-gray-300 hover:text-white">Grooming</a>
              </>
            )}
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-gray-300 hover:text-white">Dashboard</Link>
                <Link to="/dashboard/products" className="block px-3 py-2 text-gray-300 hover:text-white">Products</Link>
                <Link to="/dashboard/cart" className="block px-3 py-2 text-gray-300 hover:text-white">Cart</Link>
                <button onClick={handleLogout} className="block px-3 py-2 text-gray-300 hover:text-white w-full text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-300 hover:text-white">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-gray-300 hover:text-white">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
