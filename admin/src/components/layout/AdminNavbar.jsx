import React from 'react';
import { Menu, LogOut, ShieldCheck, Database, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const AdminNavbar = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-[#E5E0D6] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-[#101C2C] hover:bg-[#F5F1E8]"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-[#23865B] animate-pulse"></span>
          <span className="font-semibold text-[#101C2C]">Connected: MongoDB Atlas Production</span>
          <span className="text-[#788391]">· Journey 40 Repository</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <div className="text-xs font-bold text-[#101C2C]">{user?.name}</div>
          <div className="text-[11px] font-mono text-[#D6AD60] font-semibold">{user?.email}</div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-[#C75A5A] hover:bg-[#C75A5A]/10 border border-[#C75A5A]/20 transition-colors cursor-pointer"
          title="Sign out of Admin Dashboard"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
