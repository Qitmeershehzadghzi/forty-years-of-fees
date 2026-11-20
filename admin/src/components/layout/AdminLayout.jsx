import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminNavbar from './AdminNavbar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-mono text-xs text-[#64748B] space-y-3">
        <div className="w-8 h-8 border-2 border-[#D6AD60]/30 border-t-[#D6AD60] rounded-full animate-spin" />
        <span>Authenticating administrator credentials...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-[#101C2C]">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminNavbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
        <footer className="py-4 px-6 sm:px-8 border-t border-[#E5E0D6] bg-white text-xs text-[#64748B] font-mono flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
          <span>Greenwich University Karachi · Journey 40 Enterprise Administration</span>
          <span className="flex items-center gap-1.5 text-[#23865B]">
            <span className="w-2 h-2 rounded-full bg-[#23865B]" />
            <span>Role-Based Archival Protection Active</span>
          </span>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
