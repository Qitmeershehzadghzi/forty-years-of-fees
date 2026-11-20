import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Overview', path: '/' },
  { name: 'Fees', path: '/fees' },
  { name: 'Compare', path: '/comparison' },
  { name: 'Inflation', path: '/inflation' },
  { name: 'Funding', path: '/funding' },
  { name: 'AI Assistant', path: '/ai-insights' },
  { name: 'Sources', path: '/sources' },
  { name: 'About', path: '/about' },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#E2E7E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#0F5C4E] text-white flex items-center justify-center text-sm font-bold">
              40
            </div>
            <div className="leading-tight">
              <span className="block text-sm sm:text-[15px] font-bold tracking-tight text-[#12231F]">
                Forty Years of Fees
              </span>
              <span className="block text-[11px] text-[#5C6B66]">
                Greenwich University · 1987–2027
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2.5 py-2 rounded-md text-[13px] transition-colors ${
                    active
                      ? 'text-[#0F5C4E] bg-[#EDF5F2] font-semibold'
                      : 'text-[#4B5B55] hover:bg-[#F3F6F3] hover:text-[#12231F]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#0F5C4E] border border-[#CFE4DD] hover:bg-[#EDF5F2] transition-colors"
            >
              <span>Admin</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-[#12231F] hover:bg-[#F3F6F3]"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E2E7E2] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-[#EDF5F2] text-[#0F5C4E] font-semibold'
                      : 'text-[#4B5B55] hover:bg-[#F3F6F3]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#0F5C4E]"
            >
              <span>Admin portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
