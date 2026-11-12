import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, ExternalLink } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Overview', path: '/' },
  { name: 'Historical Fees', path: '/fees' },
  { name: 'Comparison', path: '/comparison' },
  { name: 'Inflation', path: '/inflation' },
  { name: 'AI Insights', path: '/ai-insights', highlight: true },
  { name: 'Education Funding', path: '/funding' },
  { name: 'Methodology', path: '/methodology' },
  { name: 'Sources', path: '/sources' },
  { name: 'About', path: '/about' },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-[#101C2C]/95 backdrop-blur-md border-b border-[#1A2B40] text-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Initiative */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#D6AD60] text-[#101C2C] flex items-center justify-center font-serif font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              40
            </div>
            <div>
              <div className="font-serif font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-[#D6AD60] transition-colors leading-tight">
                FORTY YEARS OF FEES
              </div>
              <div className="text-[11px] font-mono tracking-widest text-[#D6AD60] uppercase">
                Greenwich University · Journey 40 (1987–2026)
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#1A2B40] text-[#D6AD60] shadow-sm font-semibold'
                      : link.highlight
                      ? 'text-[#D6AD60] hover:bg-[#1A2B40] flex items-center gap-1 font-semibold'
                      : 'text-[#F5F1E8]/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 text-[#D6AD60]" />}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Admin link & Mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium font-mono text-[#101C2C] bg-[#D6AD60] hover:bg-[#c49b4c] transition-colors shadow-sm"
              title="Open Administration Panel"
            >
              <span>Admin Panel</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 rounded-md text-[#F5F1E8] hover:bg-[#1A2B40] focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-[#101C2C] border-b border-[#1A2B40] px-4 pt-2 pb-6 space-y-1">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium ${
                  active
                    ? 'bg-[#1A2B40] text-[#D6AD60] font-semibold'
                    : 'text-[#F5F1E8]/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#1A2B40]">
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-mono font-semibold text-[#101C2C] bg-[#D6AD60]"
            >
              <span>Admin Panel</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
