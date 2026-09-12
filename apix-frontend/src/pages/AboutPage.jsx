import React from 'react';
import { Info, Target, Award, ShieldAlert, BarChart3, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">About APIx — Real-time Airfare Price Index</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          High-frequency economic analytics engine developed for Smart India Hackathon 2026.
        </p>
      </div>

      {/* Main Vision Banner */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>Core Mission & Objective</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          <strong>APIx</strong> is a specialized economic analytics prototype that collects airfare observations across major airline portals and Online Travel Agencies (OTAs), normalizes fare structures, stores historical pricing data, and computes a standardized high-frequency <strong>Airfare Price Index (APIx)</strong>.
        </p>
      </div>

      {/* SIH 2026 Context Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Award className="w-4 h-4 text-sky-600" />
            <span>SIH 2026 Problem Statement</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            <strong>Problem Statement ID:</strong> 26056<br />
            <strong>Title:</strong> Real-time Airfare Price Index (APIx)<br />
            <strong>Focus:</strong> Modernizing transportation CPI monitoring by capturing high-frequency dynamic pricing across domestic aviation corridors.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <BarChart3 className="w-4 h-4 text-sky-600" />
            <span>Economic Utility</span>
          </div>
          <ul className="text-slate-600 space-y-1.5 list-disc list-inside">
            <li>Enhances airfare inflation tracking for <strong>MoSPI</strong> & <strong>RBI</strong>.</li>
            <li>Eliminates lag in static monthly consumer price surveys.</li>
            <li>Isolates dynamic surge pricing via 6 advance purchase horizons ($T+1$ to $T+45$).</li>
          </ul>
        </div>
      </div>

      {/* Transparent Disclaimer */}
      <div className="bg-amber-50 p-5 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>Hackathon Prototype Disclaimer</span>
        </div>
        <p className="text-amber-900 leading-relaxed">
          APIx is a working hackathon prototype demonstrating proposed data pipeline architecture and Laspeyres index methodology. While the application executes real index calculations, historical observations are generated via internally consistent demonstration adapters. APIx is not currently an official government publication of MoSPI or RBI.
        </p>
      </div>
    </div>
  );
}
