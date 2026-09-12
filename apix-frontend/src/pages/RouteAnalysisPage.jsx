import React, { useState, useEffect } from 'react';
import { Search, MapPin, ArrowUpRight, ArrowDownRight, Minus, X, Info } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { fetchRoutes, fetchRouteDetails } from '../services/api';

export default function RouteAnalysisPage({ selectedRouteId, onSelectRoute, onCloseModal }) {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [detailData, setDetailData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, []);

  useEffect(() => {
    if (selectedRouteId) {
      loadRouteDetails(selectedRouteId);
    } else {
      setDetailData(null);
    }
  }, [selectedRouteId]);

  async function loadRoutes() {
    try {
      setLoading(true);
      const data = await fetchRoutes();
      setRoutes(data);
    } catch (err) {
      console.error("Error loading routes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadRouteDetails(routeId) {
    try {
      setModalLoading(true);
      const data = await fetchRouteDetails(routeId);
      setDetailData(data);
    } catch (err) {
      console.error(`Error loading details for ${routeId}:`, err);
    } finally {
      setModalLoading(false);
    }
  }

  const filteredRoutes = routes.filter((r) => {
    const matchesSearch = 
      r.origin_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.destination_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.origin_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.destination_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Route Fare Analytics</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Route-level pricing observations across 24 representative Indian domestic corridors.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search city or airport code (e.g. DEL, Mumbai)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-slate-500 font-medium shrink-0">Sector Category:</span>
          <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
            {['All', 'Metro', 'Tier-2'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded font-medium cursor-pointer ${
                  categoryFilter === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Route Corridor</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Distance</th>
                <th className="py-3 px-3">Current Fare</th>
                <th className="py-3 px-3">7D Change</th>
                <th className="py-3 px-3">30D Change</th>
                <th className="py-3 px-3">Index</th>
                <th className="py-3 px-3">Lowest Fare</th>
                <th className="py-3 px-3">Highest Fare</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoutes.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {r.origin_name} ({r.origin_code}) → {r.destination_name} ({r.destination_code})
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      r.category === 'Metro' ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {r.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{r.distance_km} km</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    ₹{Math.round(r.current_fare).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-0.5 font-bold ${
                      r.change_7d > 5 ? 'text-rose-700' : r.change_7d > 0 ? 'text-amber-700' : 'text-emerald-700'
                    }`}>
                      {r.change_7d > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : r.change_7d < 0 ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                      <span>{r.change_7d > 0 ? `+${r.change_7d}%` : `${r.change_7d}%`}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {r.change_30d > 0 ? `+${r.change_30d}%` : `${r.change_30d}%`}
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-800">
                    {r.index_value}
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-medium">
                    ₹{Math.round(r.lowest_fare).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-rose-700 font-medium">
                    ₹{Math.round(r.highest_fare).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectRoute(r.id)}
                      className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium cursor-pointer shadow-2xs"
                    >
                      Detail View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROUTE DETAIL MODAL VIEW */}
      {selectedRouteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  Route Detail Breakdown
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {detailData ? `${detailData.route.origin_name} (${detailData.route.origin_code}) → ${detailData.route.destination_name} (${detailData.route.destination_code})` : 'Loading...'}
                </h3>
              </div>
              <button 
                onClick={onCloseModal}
                className="p-1 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {modalLoading ? (
              <div className="py-12 text-center text-slate-500 text-sm">Loading route detail analytics...</div>
            ) : detailData ? (
              <>
                {/* Route Detail KPI Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <div className="text-slate-500">Current Avg Fare</div>
                    <div className="text-lg font-bold text-slate-900">₹{Math.round(detailData.current_avg_fare).toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Min Observed Fare</div>
                    <div className="text-lg font-bold text-emerald-700">₹{Math.round(detailData.min_observed_fare).toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Max Observed Fare</div>
                    <div className="text-lg font-bold text-rose-700">₹{Math.round(detailData.max_observed_fare).toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">7-Day Change</div>
                    <div className={`text-lg font-bold ${detailData.change_7d >= 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {detailData.change_7d >= 0 ? `+${detailData.change_7d}%` : `${detailData.change_7d}%`}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">30-Day Change</div>
                    <div className={`text-lg font-bold ${detailData.change_30d >= 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {detailData.change_30d >= 0 ? `+${detailData.change_30d}%` : `${detailData.change_30d}%`}
                    </div>
                  </div>
                </div>

                {/* Advance Purchase Window Breakdown Chart */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg">
                  <div className="mb-3">
                    <h4 className="text-sm font-bold text-slate-900">Advance Purchase Window Price Curve</h4>
                    <p className="text-xs text-slate-500">
                      Comparing average observed fares across advance booking horizons ($T+1$ to $T+45$).
                    </p>
                  </div>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={detailData.booking_window_analysis} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="window" tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                        <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                        <Tooltip formatter={(val) => [`₹${Math.round(val).toLocaleString('en-IN')}`, 'Average Fare']} />
                        <Bar dataKey="avg_fare" fill="#0284C7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Historical Fare Trend Line Chart */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg">
                  <div className="mb-3">
                    <h4 className="text-sm font-bold text-slate-900">30-Day Fare History Trend</h4>
                    <p className="text-xs text-slate-500">Daily average fare evolution for {detailData.route.origin_code}-{detailData.route.destination_code}.</p>
                  </div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={detailData.fare_history} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(v) => v.slice(5)} />
                        <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                        <Tooltip formatter={(val) => [`₹${Math.round(val).toLocaleString('en-IN')}`, 'Avg Fare']} />
                        <Line type="monotone" dataKey="fare" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
