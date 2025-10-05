// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const location = useLocation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: '~/$ home', path: '/' },
    { name: '~/projects', path: '/projects' },
    { name: '~/contact', path: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full bg-black/90 backdrop-blur-md z-50 border-b border-green-500/30 font-mono"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with binary counter */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 flex items-center space-x-4"
          >
            <Link to="/" className="text-xl font-bold terminal-text">
              root@arnab:~#
            </Link>
            <div className="text-xs text-green-500 hidden sm:block">
              <div className="flex items-center space-x-2">
                <span>STATUS: [ONLINE]</span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div>TIME: {currentTime}</div>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-300 border border-transparent ${
                    location.pathname === item.path
                      ? 'text-green-500 bg-green-500/10 border-green-500/50 glow-primary'
                      : 'text-gray-400 hover:text-green-400 hover:bg-green-500/5 hover:border-green-500/30'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-green-400 focus:outline-none border border-green-500/30 px-3 py-2 rounded"
            >
              <span className="text-xs">[MENU]</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden bg-black border border-green-500/30 rounded-lg mt-2 p-4"
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded text-base font-medium border transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'text-green-500 bg-green-500/10 border-green-500/50'
                      : 'text-gray-400 border-green-500/20 hover:text-green-400 hover:border-green-500/40'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;