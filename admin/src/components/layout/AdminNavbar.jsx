import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, LogOut, Plus, UploadCloud, ChevronRight, Database, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const BREADCRUMB_MAP = {
  '/': 'Dashboard Overview',
  '/fees': 'Fee Records Repository',
  '/fees/new': 'Add Single Fee Record',
  '/programmes': 'Faculty & Degree Management',
  '/inflation': 'Inflation & CPI Economic Data',
  '/import': 'CSV Bulk Archival Import',
  '/sources': 'Sources & Document Citations',
  '/research': 'Research Monograph Management',
  '/ai': 'AI Research Assistant Console',
  '/sites': 'Greenwich Campus Locations',
  '/users': 'Security & User Management',
  '/audit': 'Immutable Security Audit Logs',
  '/settings': 'Platform Configuration & Health',
};

export const AdminNavbar = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const currentTitle = BREADCRUMB_MAP[location.pathname] || 'Administration';

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-[#E5E0D6] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-[#101C2C] hover:bg-[#F8FAFC] border border-[#CBD5E1]"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#64748B]">
            <span>Journey 40 Console</span>
            <ChevronRight className="w-3 h-3 text-[#CBD5E1]" />
            <span className="font-semibold text-[#101C2C]">{currentTitle}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-[#23865B] mt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#23865B] animate-pulse"></span>
            <span>Cluster Connected: MongoDB Atlas Production</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions, User Badge & Logout */}
      <div className="flex items-center gap-3">
        
        {/* Quick Add Fee Record */}
        <Link
          to="/fees/new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101C2C] text-[#F8FAFC] hover:bg-[#1A2B40] text-xs font-mono font-semibold transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#D6AD60]" />
          <span>New Record</span>
        </Link>

        {/* User Role Indicator */}
        <div className="hidden sm:block text-right border-l border-[#E5E0D6] pl-3.5">
          <div className="text-xs font-bold text-[#101C2C] leading-tight">
            {user?.name || 'Administrator'}
          </div>
          <div className="text-[10px] font-mono text-[#966B1A] font-semibold uppercase">
            {user?.role?.replace('_', ' ') || 'SUPER ADMIN'}
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-[#DC2626] hover:bg-[#FEE2E2] border border-[#DC2626]/20 transition-colors cursor-pointer"
          title="Sign out of Admin Dashboard"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

    </header>
  );
};

export default AdminNavbar;
