import React, { useState } from 'react';
import { Code, Copy, Check, ExternalLink, Terminal } from 'lucide-react';

export default function ApiAccessPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('GET /api/index');
  const [activeTab, setActiveTab] = useState('curl');
  const [copied, setCopied] = useState(false);

  const baseUrl = window.location.origin.includes('localhost') ? 'http://localhost:8000' : window.location.origin;

  const endpoints = [
    {
      method: 'GET',
      path: '/api/index',
      name: 'Current Airfare Price Index',
      desc: 'Returns latest composite index value, Metro index, Tier-2 index, and average domestic fare.',
      curl: `curl -X GET "${baseUrl}/api/index" \\
  -H "Accept: application/json"`,
      python: `import requests

response = requests.get("${baseUrl}/api/index")
data = response.json()
print(f"Overall Index: {data['overall_index']}")`,
      js: `fetch("${baseUrl}/api/index")
  .then(res => res.json())
  .then(data => console.log(data));`,
      sampleResponse: `{
  "date": "2026-09-12",
  "overall_index": 118.6,
  "metro_index": 119.2,
  "tier2_index": 116.4,
  "avg_fare": 6840.0,
  "total_observations": 18420,
  "base_period": "Jan 2026 = 100.0"
}`
    },
    {
      method: 'GET',
      path: '/api/index/history?range=30D',
      name: 'Index Time Series History',
      desc: 'Returns historical index snapshots for charting (7D, 30D, 90D, 1Y).',
      curl: `curl -X GET "${baseUrl}/api/index/history?range=30D" \\
  -H "Accept: application/json"`,
      python: `import requests

response = requests.get("${baseUrl}/api/index/history?range=30D")
history = response.json()
print(f"Points returned: {len(history)}")`,
      js: `fetch("${baseUrl}/api/index/history?range=30D")
  .then(res => res.json())
  .then(data => console.log(data));`,
      sampleResponse: `[
  {
    "date": "2026-08-13",
    "overall_index": 112.5,
    "metro_index": 113.1,
    "tier2_index": 110.8,
    "avg_fare": 6480.0
  },
  ...
]`
    },
    {
      method: 'GET',
      path: '/api/routes/DEL-BOM',
      name: 'Route Detail & Booking Windows',
      desc: 'Returns detailed statistics and advance-purchase window breakdown (T+1 to T+45) for Delhi → Mumbai.',
      curl: `curl -X GET "${baseUrl}/api/routes/DEL-BOM" \\
  -H "Accept: application/json"`,
      python: `import requests

response = requests.get("${baseUrl}/api/routes/DEL-BOM")
detail = response.json()
print(detail["booking_window_analysis"])`,
      js: `fetch("${baseUrl}/api/routes/DEL-BOM")
  .then(res => res.json())
  .then(data => console.log(data));`,
      sampleResponse: `{
  "route": { "id": "DEL-BOM", "base_fare": 5400.0 },
  "current_avg_fare": 6240.0,
  "min_observed_fare": 4890.0,
  "max_observed_fare": 12450.0,
  "change_7d": 8.4,
  "booking_window_analysis": [
    { "window": "T+1", "avg_fare": 9990.0 },
    { "window": "T+45", "avg_fare": 5290.0 }
  ]
}`
    },
    {
      method: 'GET',
      path: '/api/fares?origin=DEL&airline=IndiGo',
      name: 'Search Raw Fare Observations',
      desc: 'Filter raw collected observations by origin, destination, airline, source OTA, and booking window.',
      curl: `curl -X GET "${baseUrl}/api/fares?origin=DEL&airline=IndiGo&limit=5" \\
  -H "Accept: application/json"`,
      python: `import requests

response = requests.get("${baseUrl}/api/fares?origin=DEL&airline=IndiGo&limit=5")
fares = response.json()`,
      js: `fetch("${baseUrl}/api/fares?origin=DEL&airline=IndiGo&limit=5")
  .then(res => res.json())
  .then(data => console.log(data));`,
      sampleResponse: `{
  "total": 1420,
  "limit": 5,
  "items": [
    {
      "flight_number": "6E-2041",
      "airline": "IndiGo",
      "fare": 6240.0,
      "booking_window": "T+7"
    }
  ]
}`
    }
  ];

  const currentEp = endpoints.find(e => `${e.method} ${e.path.split('?')[0]}` === selectedEndpoint) || endpoints[0];

  function copyCode() {
    const textToCopy = currentEp[activeTab];
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">API Developer & Analyst Portal</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            RESTful API access to real-time airfare index data, route statistics, and raw observations.
          </p>
        </div>

        <a
          href={`${baseUrl}/docs`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-semibold cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Interactive Swagger UI (/docs)</span>
        </a>
      </div>

      {/* Base URL Card */}
      <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-400 font-medium">Production API Base URL:</span>
          <code className="block sm:inline sm:ml-2 font-mono text-sky-400 font-bold text-sm mt-1 sm:mt-0">
            {baseUrl}/api
          </code>
        </div>
        <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-[11px]">
          Format: JSON • CORS Enabled
        </span>
      </div>

      {/* Main Grid: Endpoint Selector & Request Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">API Endpoints</h3>
          {endpoints.map((ep) => {
            const key = `${ep.method} ${ep.path.split('?')[0]}`;
            const isSelected = key === selectedEndpoint;
            return (
              <button
                key={ep.path}
                onClick={() => setSelectedEndpoint(key)}
                className={`w-full text-left p-3 rounded-md border text-xs transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-sky-50 border-sky-300 text-slate-900 shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-1.5 py-0.5 bg-sky-600 text-white font-mono font-bold text-[10px] rounded">
                    {ep.method}
                  </span>
                  <span className="font-mono font-semibold text-slate-900 truncate">{ep.path}</span>
                </div>
                <div className="font-semibold text-slate-800">{ep.name}</div>
                <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">{ep.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Request & Response Inspector */}
        <div className="lg:col-span-2 space-y-4">
          {/* Request Snippet Block */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden text-xs shadow-xs">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-slate-100">Sample Request Code</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-900 p-0.5 rounded border border-slate-800">
                  {['curl', 'python', 'js'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2.5 py-0.5 rounded uppercase font-bold text-[10px] cursor-pointer ${
                        activeTab === tab ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium cursor-pointer border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <pre className="p-4 font-mono text-sky-300 overflow-x-auto leading-relaxed">
              {currentEp[activeTab]}
            </pre>
          </div>

          {/* Response Sample Block */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden text-xs shadow-xs">
            <div className="p-3 bg-slate-950 border-b border-slate-800 text-slate-300 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Example JSON Response (200 OK)</span>
            </div>
            <pre className="p-4 font-mono text-emerald-400 overflow-x-auto leading-relaxed text-[11px]">
              {currentEp.sampleResponse}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
