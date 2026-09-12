import React, { useState, useEffect } from 'react';
import { Filter, Download, Search, RefreshCw } from 'lucide-react';
import { fetchFares } from '../services/api';

const AIRPORTS = ['DEL', 'BOM', 'BLR', 'AMD', 'HYD', 'CCU', 'MAA', 'PNQ', 'GOI', 'COK'];
const AIRLINES = ['All', 'IndiGo', 'Air India', 'Akasa Air', 'SpiceJet', 'AI Express'];
const SOURCES = ['All', 'MakeMyTrip', 'Yatra', 'EaseMyTrip', 'Cleartrip', 'Ixigo', 'Direct Airline Portal'];
const WINDOWS = ['All', 'T+1', 'T+3', 'T+7', 'T+15', 'T+30', 'T+45'];

export default function FareExplorerPage() {
  const [fares, setFares] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filters
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [airline, setAirline] = useState('All');
  const [source, setSource] = useState('All');
  const [bookingWindow, setBookingWindow] = useState('All');
  const [page, setPage] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadFares();
  }, [origin, destination, airline, source, bookingWindow, page]);

  async function loadFares() {
    try {
      setLoading(true);
      const data = await fetchFares({
        origin: origin || undefined,
        destination: destination || undefined,
        airline: airline !== 'All' ? airline : undefined,
        source: source !== 'All' ? source : undefined,
        booking_window: bookingWindow !== 'All' ? bookingWindow : undefined,
        limit,
        offset: page * limit
      });
      setFares(data.items);
      setTotalCount(data.total);
    } catch (err) {
      console.error("Error loading fares:", err);
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    if (!fares.length) return;
    const headers = ["ID", "Origin", "Destination", "Airline", "Source", "FlightNumber", "Departure", "Arrival", "Stops", "BookingWindow", "Fare", "CollectedAt"];
    const rows = fares.map(f => [f.id, f.origin, f.destination, f.airline, f.source, f.flight_number, f.departure_time, f.arrival_time, f.stops, f.booking_window, f.fare, f.collected_at]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apix_fare_observations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Fare Observations Explorer</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Search, filter, and inspect raw collected airfare records across airlines and OTAs.
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={!fares.length}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold cursor-pointer shadow-2xs self-start sm:self-auto disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Dataset (CSV)</span>
        </button>
      </div>

      {/* Filter Panel */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">
          <Filter className="w-4 h-4 text-sky-600" />
          <span>Search & Filtering Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Origin */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Origin Code</label>
            <select
              value={origin}
              onChange={(e) => { setOrigin(e.target.value); setPage(0); }}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
            >
              <option value="">All Origins</option>
              {AIRPORTS.map(ap => <option key={ap} value={ap}>{ap}</option>)}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Destination Code</label>
            <select
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setPage(0); }}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
            >
              <option value="">All Destinations</option>
              {AIRPORTS.map(ap => <option key={ap} value={ap}>{ap}</option>)}
            </select>
          </div>

          {/* Airline */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Airline</label>
            <select
              value={airline}
              onChange={(e) => { setAirline(e.target.value); setPage(0); }}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
            >
              {AIRLINES.map(al => <option key={al} value={al}>{al}</option>)}
            </select>
          </div>

          {/* Source OTA */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Data Source / OTA</label>
            <select
              value={source}
              onChange={(e) => { setSource(e.target.value); setPage(0); }}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
            >
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Booking Window */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Advance Purchase Horizon</label>
            <select
              value={bookingWindow}
              onChange={(e) => { setBookingWindow(e.target.value); setPage(0); }}
              className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
            >
              {WINDOWS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing observations <span className="font-bold text-slate-900">{page * limit + 1}</span> to <span className="font-bold text-slate-900">{Math.min((page + 1) * limit, totalCount)}</span> of <span className="font-bold text-slate-900">{totalCount.toLocaleString()}</span>
          </div>
          {loading && <div className="text-sky-600 flex items-center gap-1 font-medium"><RefreshCw className="w-3.5 h-3.5 animate-spin"/> Loading...</div>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Flight</th>
                <th className="py-2.5 px-3">Airline</th>
                <th className="py-2.5 px-3">Source OTA</th>
                <th className="py-2.5 px-3">Route</th>
                <th className="py-2.5 px-3">Departure</th>
                <th className="py-2.5 px-3">Stops</th>
                <th className="py-2.5 px-3">Booking Horizon</th>
                <th className="py-2.5 px-3">Collected Fare</th>
                <th className="py-2.5 px-3">Collected At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fares.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No fare observations match your selected filters.
                  </td>
                </tr>
              ) : (
                fares.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{f.flight_number}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{f.airline}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium border border-slate-200">
                        {f.source}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-sky-900">{f.origin} → {f.destination}</td>
                    <td className="py-2.5 px-3 text-slate-600">{f.departure_time.slice(11, 16)}</td>
                    <td className="py-2.5 px-3 text-slate-600">{f.stops === 0 ? 'Non-stop' : `${f.stops} stop`}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 bg-sky-50 text-sky-800 rounded font-semibold text-[11px] border border-sky-200">
                        {f.booking_window}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 text-sm">
                      ₹{Math.round(f.fare).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px] font-mono">{f.collected_at.slice(0, 16).replace('T', ' ')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 bg-white border border-slate-300 rounded font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
          >
            ← Previous
          </button>
          <span className="text-slate-500">Page {page + 1} of {Math.ceil(totalCount / limit) || 1}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * limit >= totalCount}
            className="px-3 py-1 bg-white border border-slate-300 rounded font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
