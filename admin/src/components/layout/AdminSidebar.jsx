import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Receipt,
  PlusCircle,
  TrendingUp,
  UploadCloud,
  FileText,
  Bookmark,
  Sparkles,
  MapPin,
  Users,
  History,
  Settings,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const NAVIGATION_GROUPS = [
  {
    group: 'ARCHIVAL REPOSITORY',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Fee Records', path: '/fees', icon: Receipt },
      { name: 'Add Fee Record', path: '/fees/new', icon: PlusCircle },
      { name: 'Programmes', path: '/programmes', icon: BookOpen },
      { name: 'Inflation & CPI', path: '/inflation', icon: TrendingUp },
    ],
  },
  {
    group: 'DATA MANAGEMENT',
    items: [
      { name: 'Data Import (CSV)', path: '/import', icon: UploadCloud },
      { name: 'Sources & Citations', path: '/sources', icon: Bookmark },
      { name: 'Research Articles', path: '/research', icon: FileText },
      { name: 'Campus Sites', path: '/sites', icon: MapPin },
    ],
  },
  {
    group: 'INTELLIGENCE & AUDIT',
    items: [
      { name: 'AI Assistant', path: '/ai', icon: Sparkles, highlight: true },
      { name: 'Audit Logs', path: '/audit', icon: History, role: 'ADMIN' },
      { name: 'User Management', path: '/users', icon: Users, role: 'SUPER_ADMIN' },
      { name: 'Platform Settings', path: '/settings', icon: Settings },
    ],
  },
];

export const AdminSidebar = ({ mobileOpen, onClose }) => {
  const { user, hasRole } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#101C2C] text-[#F8FAFC] border-r border-[#1A2B40] flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 sm:h-20 flex items-center px-6 border-b border-[#1A2B40] gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6AD60] to-[#966B1A] text-[#101C2C] flex items-center justify-center font-serif font-black text-xl shadow-md shrink-0">
            40
          </div>
          <div className="min-w-0">
            <div className="font-serif font-bold text-sm tracking-tight text-white leading-tight truncate">
              JOURNEY 40
            </div>
            <div className="text-[10px] font-mono text-[#D6AD60] uppercase tracking-wider truncate">
              Admin Command Console
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto text-xs">
          {NAVIGATION_GROUPS.map((sec, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-mono font-bold tracking-wider text-[#94A3B8]/60 uppercase">
                {sec.group}
              </div>

              {sec.items.map((item) => {
                if (item.role && !hasRole(item.role)) return null;
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-[#D6AD60] text-[#101C2C] font-semibold shadow-sm'
                          : item.highlight
                          ? 'text-[#D6AD60] hover:bg-[#1A2B40]'
                          : 'text-[#94A3B8] hover:bg-[#1A2B40] hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.highlight && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6AD60] animate-pulse" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer / User Profile & Public Site link */}
        <div className="p-4 border-t border-[#1A2B40] bg-[#0C1521] space-y-3">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#1A2B40] text-[#D6AD60] hover:bg-[#253952] text-xs font-mono transition-colors border border-white/5"
          >
            <span>View Public Platform</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-3 px-1 text-xs">
            <div className="w-9 h-9 rounded-full bg-[#D6AD60]/20 text-[#D6AD60] font-mono font-bold flex items-center justify-center border border-[#D6AD60]/40 shrink-0">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] font-mono text-[#94A3B8] uppercase truncate">
                {user?.role?.replace('_', ' ') || 'SYSTEM ADMIN'}
              </div>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;
