import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Database, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { fetchStats, fetchIndexHistory, fetchRoutes } from '../services/api';

export default function OverviewPage({ onSelectRoute, onNavigate }) {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [timeRange, setTimeRange] = useState('30D');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  async function loadData() {
    try {
      setLoading(true);
      const [sData, hData, rData] = await Promise.all([
        fetchStats(),
        fetchIndexHistory(timeRange),
        fetchRoutes()
      ]);
      setStats(sData);
      setHistory(hData);
      setRoutes(rData);
    } catch (err) {
      console.error("Error loading overview data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Top movers (highest 7D increase)
  const topMovers = [...routes].sort((a, b) => b.change_7d - a.change_7d).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Title Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Real-time Airfare Price Index</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Tracking domestic airfare movements across representative Indian routes.
        </p>
      </div>

      {/* Dynamic KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Airfare Price Index */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Airfare Price Index</span>
            <span className="text-[11px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-200">Base = 100</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {stats ? stats.airfare_price_index.toFixed(1) : '118.6'}
            </span>
            <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              (stats?.index_change_pct || 0) >= 0 
                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {(stats?.index_change_pct || 0) >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{stats ? (stats.index_change_pct >= 0 ? `+${stats.index_change_pct}%` : `${stats.index_change_pct}%`) : '+4.2%'}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">vs. Jan 2026 baseline</p>
        </div>

        {/* KPI 2: Routes Tracked */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium mb-1">Routes Tracked</div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {stats ? stats.routes_tracked : '24'}
            </span>
            <div className="p-1.5 bg-slate-100 rounded text-slate-600">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Major Metro & Tier-2 Sectors</p>
        </div>

        {/* KPI 3: Fare Observations */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium mb-1">Fare Observations</div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {stats ? stats.total_observations.toLocaleString() : '18,420'}
            </span>
            <div className="p-1.5 bg-slate-100 rounded text-slate-600">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Across 5 Airlines & 6 OTAs</p>
        </div>

        {/* KPI 4: Average Domestic Fare */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium mb-1">Average Domestic Fare</div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              ₹{stats ? Math.round(stats.average_domestic_fare).toLocaleString('en-IN') : '6,840'}
            </span>
            <div className="p-1.5 bg-slate-100 rounded text-slate-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Economy Economy Standard</p>
        </div>
      </div>

      {/* Main Index Chart Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Airfare Price Index Trend</h3>
            <p className="text-xs text-slate-500 mt-0.5">Weighted composite index (Base period Jan 2026 = 100.0)</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200 text-xs">
            {['7D', '30D', '90D', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  timeRange === range 
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Financial Line Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickFormatter={(val) => val.slice(5)}
              />
              <YAxis 
                domain={['dataMin - 2', 'dataMax + 2']} 
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fontSize: 11, fill: '#64748B' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded shadow-lg text-xs space-y-1">
                        <div className="font-semibold text-slate-300 border-b border-slate-700 pb-1">{data.date}</div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Overall Index:</span>
                          <span className="font-bold text-sky-400">{data.overall_index}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Metro Routes Index:</span>
                          <span className="font-medium text-slate-200">{data.metro_index}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Avg Domestic Fare:</span>
                          <span className="font-medium text-slate-200">₹{Math.round(data.avg_fare).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={100} stroke="#94A3B8" strokeDasharray="4 4" label={{ value: 'Base (100.0)', position: 'insideBottomLeft', fill: '#64748B', fontSize: 10 }} />
              <Line 
                type="monotone" 
                dataKey="overall_index" 
                stroke="#0284C7" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#0284C7' }} 
                activeDot={{ r: 6, stroke: '#0284C7', strokeWidth: 2, fill: '#FFFFFF' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Top Movers & Sector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Route Price Increases */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Highest 7-Day Route Fare Increases</h3>
            <button 
              onClick={() => onNavigate('routes')}
              className="text-xs text-sky-700 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All 24 Routes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Route</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Current Fare</th>
                  <th className="py-2.5 px-3">7D Change</th>
                  <th className="py-2.5 px-3">Index</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topMovers.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {r.origin_name} ({r.origin_code}) → {r.destination_name} ({r.destination_code})
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        r.category === 'Metro' ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {r.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      ₹{Math.round(r.current_fare).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-0.5 font-bold ${
                        r.change_7d > 5 ? 'text-rose-700' : r.change_7d > 0 ? 'text-amber-700' : 'text-emerald-700'
                      }`}>
                        {r.change_7d > 0 ? `+${r.change_7d}%` : `${r.change_7d}%`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                      {r.index_value}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onSelectRoute(r.id)}
                        className="text-sky-700 hover:text-sky-900 font-semibold hover:underline cursor-pointer"
                      >
                        Analyze →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Index Methodology Quick Context */}
        <div className="bg-slate-900 text-white rounded-lg p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs mb-2">
              <Info className="w-4 h-4" />
              <span>APIx Methodology Summary</span>
            </div>
            <h4 className="text-base font-bold mb-2">Laspeyres Price Index</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Calculated using weighted relative price changes across 24 representative domestic routes relative to base period $t_0 = 100$.
            </p>

            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>Weighting:</strong> Based on seat capacity and passenger volume share.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>Normalization:</strong> Standardized for advance purchase horizons (T+1 to T+45).</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">SIH 2026 • PS 26056</span>
            <button 
              onClick={() => onNavigate('index')}
              className="text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
            >
              Full Methodology →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
