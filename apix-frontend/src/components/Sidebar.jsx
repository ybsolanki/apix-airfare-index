import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  MapPin, 
  Search, 
  Database, 
  Code, 
  Info,
  Plane,
  X
} from 'lucide-react';

export default function Sidebar({ activeSection, onSelectSection, isOpen, onClose }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'index', label: 'Airfare Index', icon: TrendingUp },
    { id: 'routes', label: 'Route Analysis', icon: MapPin },
    { id: 'explorer', label: 'Fare Explorer', icon: Search },
    { id: 'sources', label: 'Data Sources', icon: Database },
    { id: 'api', label: 'API Access', icon: Code },
    { id: 'about', label: 'About APIx', icon: Info },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-slate-100 flex flex-col justify-between
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        border-r border-slate-800 shrink-0
      `}>
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-base tracking-wide text-white leading-tight">APIx</h2>
                <p className="text-xs text-sky-400 font-medium">Price Index Portal</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.id);
                    if (onClose) onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium
                    transition-all duration-150 cursor-pointer text-left
                    ${isActive 
                      ? 'bg-sky-600 text-white shadow-sm font-semibold' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/50">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-300">SIH 2026</span>
            <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">PS 26056</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Real-time Airfare Inflation & Analytics Engine
          </p>
        </div>
      </aside>
    </>
  );
}
