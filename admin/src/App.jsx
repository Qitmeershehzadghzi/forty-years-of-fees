import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Programmes from './pages/Programmes.jsx';
import FeeRecords from './pages/FeeRecords.jsx';
import AddFeeRecord from './pages/AddFeeRecord.jsx';
import InflationData from './pages/InflationData.jsx';
import DataImport from './pages/DataImport.jsx';
import Sources from './pages/Sources.jsx';
import ResearchManagement from './pages/ResearchManagement.jsx';
import AIResearchAssistant from './pages/AIResearchAssistant.jsx';
import Users from './pages/Users.jsx';
import Sites from './pages/Sites.jsx';
import AuditLogs from './pages/AuditLogs.jsx';
import Settings from './pages/Settings.jsx';

import './styles/app.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="programmes" element={<Programmes />} />
            <Route path="fees" element={<FeeRecords />} />
            <Route path="fees/new" element={<AddFeeRecord />} />
            <Route path="inflation" element={<InflationData />} />
            <Route path="import" element={<DataImport />} />
            <Route path="sources" element={<Sources />} />
            <Route path="research" element={<ResearchManagement />} />
            <Route path="ai" element={<AIResearchAssistant />} />
            <Route path="users" element={<Users />} />
            <Route path="sites" element={<Sites />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
