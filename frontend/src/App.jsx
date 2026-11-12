import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { FilterProvider } from './context/FilterContext.jsx';
import MainLayout from './components/layout/MainLayout.jsx';

import Home from './pages/Home.jsx';
import HistoricalFees from './pages/HistoricalFees.jsx';
import ProgrammeComparison from './pages/ProgrammeComparison.jsx';
import InflationAnalysis from './pages/InflationAnalysis.jsx';
import AIInsights from './pages/AIInsights.jsx';
import EducationFunding from './pages/EducationFunding.jsx';
import Methodology from './pages/Methodology.jsx';
import DataSources from './pages/DataSources.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

import './styles/app.css';

export default function App() {
  return (
    <FilterProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="fees" element={<HistoricalFees />} />
            <Route path="comparison" element={<ProgrammeComparison />} />
            <Route path="inflation" element={<InflationAnalysis />} />
            <Route path="ai-insights" element={<AIInsights />} />
            <Route path="funding" element={<EducationFunding />} />
            <Route path="methodology" element={<Methodology />} />
            <Route path="sources" element={<DataSources />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FilterProvider>
  );
}
