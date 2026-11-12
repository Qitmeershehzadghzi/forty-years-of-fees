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
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Programmes', path: '/programmes', icon: BookOpen },
  { name: 'Fee Records', path: '/fees', icon: Receipt },
  { name: 'Add Fee Record', path: '/fees/new', icon: PlusCircle },
  { name: 'Inflation Data', path: '/inflation', icon: TrendingUp },
  { name: 'Data Import (CSV)', path: '/import', icon: UploadCloud },
  { name: 'Sources & Citations', path: '/sources', icon: Bookmark },
  { name: 'Research Articles', path: '/research', icon: FileText },
  { name: 'AI Research Assistant', path: '/ai', icon: Sparkles, highlight: true },
  { name: 'Campus Sites', path: '/sites', icon: MapPin },
  { name: 'User Management', path: '/users', icon: Users, role: 'SUPER_ADMIN' },
  { name: 'Audit Logs', path: '/audit', icon: History, role: 'ADMIN' },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const AdminSidebar = ({ mobileOpen, onClose }) => {
  const { user, hasRole } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-[#101C2C] text-[#F5F1E8] border-r border-[#1A2B40] flex flex-col z-50 transition-transform duration-200 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-[#1A2B40] gap-3">
          <div className="w-9 h-9 rounded bg-[#D6AD60] text-[#101C2C] flex items-center justify-center font-serif font-black text-lg">
            40
          </div>
          <div>
            <div className="font-serif font-bold text-sm tracking-tight text-white leading-tight">
              FORTY YEARS OF FEES
            </div>
            <div className="text-[10px] font-mono text-[#D6AD60] uppercase tracking-wider">
              Administration Portal
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-xs">
          {MENU_ITEMS.map((item) => {
            if (item.role && !hasRole(item.role)) return null;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-[#D6AD60] text-[#101C2C] font-semibold shadow-sm'
                      : item.highlight
                      ? 'text-[#D6AD60] hover:bg-[#1A2B40]'
                      : 'text-[#F5F1E8]/75 hover:bg-[#1A2B40] hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / User Profile & Public Site link */}
        <div className="p-4 border-t border-[#1A2B40] bg-[#0c1521] space-y-3">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded bg-[#1A2B40] text-[#D6AD60] hover:bg-[#253952] text-xs font-mono transition-colors"
          >
            <span>View Public Platform</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2.5 px-1 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#D6AD60]/20 text-[#D6AD60] font-mono font-bold flex items-center justify-center border border-[#D6AD60]/40">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate">{user?.name}</div>
              <div className="text-[10px] font-mono text-[#788391] uppercase">{user?.role}</div>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;
