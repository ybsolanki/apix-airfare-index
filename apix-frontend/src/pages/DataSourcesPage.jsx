import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, CheckCircle2, Server, Cpu } from 'lucide-react';
import { fetchSources } from '../services/api';

export default function DataSourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchSources();
        setSources(data);
      } catch (err) {
        console.error("Failed to load sources:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Data Sources & Pipeline Architecture</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Monitoring connected airline APIs, OTA scrapers, and ethical ingestion telemetry.
        </p>
      </div>

      {/* Sources Status Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Connected Data Provider Adapters</h3>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded font-semibold border border-emerald-200">
            Pipeline Health: 99.4%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Provider / Source</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Adapter Status</th>
                <th className="py-3 px-3">Last Ingestion</th>
                <th className="py-3 px-3">Records Collected</th>
                <th className="py-3 px-3">Uptime / Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sources.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{s.source_type}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      s.status.includes('Active')
                        ? 'bg-sky-50 text-sky-800 border-sky-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono">
                    {s.last_collection ? s.last_collection.slice(0, 16).replace('T', ' ') : 'Just now'}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {s.records_collected.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{s.health_score}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scraper Architecture Explanation */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Server className="w-5 h-5 text-sky-600" />
          <span>Scraper Architecture & Compliance Guarantees</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">1. Modular Adapter Layer</h4>
            <p className="text-slate-600">
              Scrapers inherit from an abstract `BaseScraper` interface. Mock adapters supply internal demo data during development, making it seamless to swap in live API keys.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">2. Ethical Data Ingestion</h4>
            <p className="text-slate-600">
              Adheres strictly to `robots.txt`, enforces exponential backoff rate limits, and uses zero anti-bot evasion or CAPTCHA bypass scripts.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">3. Outlier Filter & Deduplication</h4>
            <p className="text-slate-600">
              Raw fare observations pass through IQR standard deviation filters and cross-OTA deduplication algorithms before entering the index engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
