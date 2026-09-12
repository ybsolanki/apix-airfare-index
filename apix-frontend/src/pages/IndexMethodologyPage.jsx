import React, { useState, useEffect } from 'react';
import { TrendingUp, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { fetchIndexHistory, fetchIndexCurrent } from '../services/api';

export default function IndexMethodologyPage() {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [h, c] = await Promise.all([fetchIndexHistory('30D'), fetchIndexCurrent()]);
        setHistory(h);
        setCurrentIndex(c);
      } catch (err) {
        console.error("Failed to load index methodology data", err);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Airfare Price Index Analytics</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Detailed sector breakdowns and transparent mathematical index methodology.
        </p>
      </div>

      {/* Sector Comparison Chart */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900">Sector Index Movements: Metro vs Tier-2 Routes</h3>
          <p className="text-xs text-slate-500 mt-0.5">Comparing dynamic fare inflation across high-density metro corridors and tier-2 regional routes.</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(v) => v.slice(5)} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" name="Overall Index" dataKey="overall_index" stroke="#0284C7" strokeWidth={2.5} dot={false} />
              <Line type="monotone" name="Metro Routes Index" dataKey="metro_index" stroke="#DC2626" strokeWidth={2} dot={false} />
              <Line type="monotone" name="Tier-2 Routes Index" dataKey="tier2_index" stroke="#0D9488" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-semibold uppercase text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
            APIx Prototype Index Methodology
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-2">Transparent Price Index Calculation Specification</h3>
          <p className="text-xs text-slate-600 mt-1">
            This methodology establishes a standardized, reproducible procedure for measuring airfare inflation across domestic Indian routes for economic analysis (MoSPI, RBI).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          {/* Step 1 */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 bg-sky-600 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
              <span>Base Period & Normalization ($t_0 = 100.0$)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Base period fares ($P_{r,0}$) are fixed at the January 2026 baseline. Individual observation fares are normalized for economy cabin class, 15kg baggage allowance, and currency (INR).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 bg-sky-600 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
              <span>Route-Level Price Relatives ($I_{r,t}$)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              For each route $r$ on date $t$, the route price index is the ratio of current average normalized fare $P_{r,t}$ to base fare $P_{r,0}$:
            </p>
            <div className="bg-white p-2 rounded border border-slate-200 text-center font-mono font-bold text-sky-800">
              I_{"{r,t}"} = ( P_{"{r,t}"} / P_{"{r,0}"} ) × 100
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 bg-sky-600 text-white rounded-full flex items-center justify-center text-[10px]">3</span>
              <span>Weighted Laspeyres Aggregation</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Route indices are aggregated into the national Airfare Price Index ($I_{total,t}$) using fixed annual seat capacity weights ($w_r$):
            </p>
            <div className="bg-white p-2 rounded border border-slate-200 text-center font-mono font-bold text-sky-800">
              I_{"{total,t}"} = ∑ ( w_r × I_{"{r,t}"} )  [∑ w_r = 1.0]
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 bg-sky-600 text-white rounded-full flex items-center justify-center text-[10px]">4</span>
              <span>Advance Purchase Window Standardizing</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Fares are collected across 6 advance booking horizons ($T+1, T+3, T+7, T+15, T+30, T+45$) to isolate pure price inflation from dynamic yield management.
            </p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Disclaimer on Official Index Classification:</span>
            <p className="mt-0.5 text-amber-800">
              This index represents the <strong>APIx Prototype Index Methodology</strong> for SIH 2026. It is designed to demonstrate high-frequency CPI integration feasibility for MoSPI and RBI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
