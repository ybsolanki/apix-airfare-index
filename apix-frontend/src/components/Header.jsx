import React, { useState } from 'react';
import { RefreshCw, Activity, ShieldAlert, Menu } from 'lucide-react';

export default function Header({ lastUpdated, onRefresh, isRefreshing, onToggleSidebar }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left side title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">APIx</h1>
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium border border-slate-200">
                PS 26056
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Real-time Airfare Price Index • Domestic Indian Routes
            </p>
          </div>
        </div>

        {/* Right side indicators */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Demo Data Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Prototype • Demonstration Data</span>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
            </span>
            <span>Data updated {lastUpdated ? lastUpdated : '2 min ago'}</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-md font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
