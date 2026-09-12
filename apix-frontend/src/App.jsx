import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

import OverviewPage from './pages/OverviewPage';
import IndexMethodologyPage from './pages/IndexMethodologyPage';
import RouteAnalysisPage from './pages/RouteAnalysisPage';
import FareExplorerPage from './pages/FareExplorerPage';
import DataSourcesPage from './pages/DataSourcesPage';
import ApiAccessPage from './pages/ApiAccessPage';
import AboutPage from './pages/AboutPage';

import { triggerRefresh } from './services/api';

import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');

  async function handleRefresh() {
    try {
      setIsRefreshing(true);
      await triggerRefresh();
      const now = new Date();
      setLastUpdated(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
      window.dispatchEvent(new Event('apix-data-refreshed'));
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  }

  function handleSelectRoute(routeId) {
    setSelectedRouteId(routeId);
    if (activeSection !== 'routes') {
      setActiveSection('routes');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Top Header */}
      <Header
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={(sec) => {
            setActiveSection(sec);
            setSelectedRouteId(null);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <ErrorBoundary>
            {activeSection === 'overview' && (
              <OverviewPage
                onSelectRoute={handleSelectRoute}
                onNavigate={(sec) => setActiveSection(sec)}
              />
            )}

            {activeSection === 'index' && <IndexMethodologyPage />}

            {activeSection === 'routes' && (
              <RouteAnalysisPage
                selectedRouteId={selectedRouteId}
                onSelectRoute={(id) => setSelectedRouteId(id)}
                onCloseModal={() => setSelectedRouteId(null)}
              />
            )}

            {activeSection === 'explorer' && <FareExplorerPage />}

            {activeSection === 'sources' && <DataSourcesPage />}

            {activeSection === 'api' && <ApiAccessPage />}

            {activeSection === 'about' && <AboutPage />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
