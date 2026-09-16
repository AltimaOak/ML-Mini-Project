import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Predict Bill', path: '/predict' },
    { name: 'History', path: '/history' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="no-print sticky top-0 z-40 bg-white border-b border-utility-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo matching reference */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-none"
          >
            <div className="text-utility-orange flex items-center justify-center">
              <Zap className="w-6 h-6 fill-utility-orange stroke-utility-orange" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-utility-charcoal tracking-tight leading-none">
                Power<span className="text-utility-orange">Estimate</span>
              </span>
              <span className="text-[10px] text-utility-muted font-medium mt-0.5">
                Smarter Energy Decisions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with active underline */}
          <div className="hidden md:flex items-center space-x-6 h-full">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center h-full px-1 text-sm font-medium transition-colors ${
                    active
                      ? 'text-utility-charcoal font-semibold'
                      : 'text-utility-secondary hover:text-utility-charcoal'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-utility-orange rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Button matching reference */}
          <div className="hidden md:flex items-center">
            <button
              type="button"
              onClick={() => navigate('/predict')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-utility-orange hover:bg-utility-orange-hover text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              <span>Predict Bill</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="p-2 rounded-lg text-utility-secondary hover:text-utility-charcoal hover:bg-cream-100 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-utility-border bg-white px-4 pt-2 pb-4 space-y-1 shadow-card">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  active
                    ? 'text-utility-orange bg-utility-orange-light font-semibold'
                    : 'text-utility-secondary hover:text-utility-charcoal hover:bg-cream-100'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/predict');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-utility-orange text-white text-sm font-medium rounded-lg"
            >
              <span>Predict Bill</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
