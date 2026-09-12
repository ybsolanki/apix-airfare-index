# APIx — Real-time Airfare Price Index (SIH 2026 • PS 26056)

**APIx** is a full-stack, high-frequency economic analytics platform and prototype developed for **Smart India Hackathon 2026 (Problem Statement ID 26056)**.

APIx collects airfare observations across major airline portals and Online Travel Agencies (OTAs), cleans and normalizes raw fares, stores 30+ days of historical pricing observations, computes a mathematical **Airfare Price Index (APIx)**, and presents the results through a government-grade financial analytics dashboard and developer REST API.

---

## 🏛️ Visual Identity & Design Guidelines
- **Primary Color Palette**: White background (`#FFFFFF`), Sky Blue (`#0284C7`), Dark Navy text (`#0F172A`), subtle Red (`#DC2626`) for fare increases / volatility.
- **Typography**: Clean Inter / system-ui sans-serif font.
- **Style**: Government data portal + modern financial analytics dashboard + aviation platform. Zero AI fluff, neon glow, or excessive glassmorphism.
- **Demo Indicator**: Clear, transparent **"Prototype • Demonstration Data"** header badge and data refresh indicator.

---

## 🚀 Key Features & Hackathon Presentation Flow

1. **Overview Dashboard**:
   - Dynamic KPI cards (Airfare Price Index: e.g. `118.6`, `+4.2%`, Routes Tracked: `24`, Total Observations: `18,420`, Avg Domestic Fare: `₹6,840`).
   - Interactive Financial Line Chart (7D, 30D, 90D, 1Y range filters, Base period `100.0` reference line).
   - Route Snapshot & Top Movers widget.

2. **Airfare Index Analytics & Methodology**:
   - Sector index comparison (Metro Routes Index vs Tier-2 Routes Index vs Overall National Index).
   - Full mathematical specification of the **APIx Prototype Index Methodology** (Laspeyres-style weighted formula, $t_0=100.0$, route capacity weights, price normalization per km & booking window).

3. **Route Analysis & Advance Purchase Window View**:
   - Interactive route table across 24 domestic Indian corridors (DEL-BOM, BOM-DEL, DEL-BLR, BLR-DEL, BOM-BLR, DEL-CCU, BOM-AMD, etc.).
   - Route detail modal showing current avg fare, min/max observed fares, 7D/30D change, and the **Advance Purchase Window Chart** ($T+1$, $T+3$, $T+7$, $T+15$, $T+30$, $T+45$).

4. **Fare Explorer**:
   - Search & filter raw fare observations by Origin, Destination, Airline (IndiGo, Air India, Akasa, SpiceJet, AI Express), OTA Source (MakeMyTrip, Yatra, EaseMyTrip, Cleartrip, Ixigo, Goibibo), and Booking Window.
   - One-click CSV export capability for economic researchers.

5. **Data Sources Telemetry**:
   - Data provider status table showing adapter type, last collection timestamp, total records collected, and health scores.
   - Scraper architecture documentation (ethical compliance, `robots.txt` respect, rate limiting).

6. **API Access & Developer Portal**:
   - Base URL (`http://localhost:8000/api`).
   - Interactive endpoint documentation with copyable cURL, Python, and JavaScript snippets.
   - Direct link to Swagger UI (`/docs`).

7. **Data Refresh Action**:
   - Live "Refresh Data" button in top header that triggers backend scraper ingestion simulation and recalculates the index in real-time.

---

## 🛠️ Architecture & Tech Stack

```
apix-airfare-index/
├── apix-backend/            # Python FastAPI Backend
│   ├── api/                 # FastAPI routes (main.py)
│   ├── database/            # SQLAlchemy models, SQLite engine, seed script
│   ├── index/               # Mathematical Index Calculator (calculator.py)
│   ├── processors/          # Cleaner, Normalizer, Deduplicator
│   ├── scrapers/            # BaseScraper, AirlineScraper, OTAScraper
│   └── tests/               # Pytest automated test suite
└── apix-frontend/           # React + Vite + Tailwind CSS UI
    ├── src/                 # React components & pages
    └── dist/                # Production static web build
```

---

## 📦 How to Run

### Option 1: Run Full System via FastAPI (Recommended)

1. **Install backend dependencies and launch**:
   ```bash
   cd apix-backend
   uv run --with uvicorn --with fastapi --with pydantic --with pandas --with numpy --with sqlalchemy python -m uvicorn api.main:app --host 127.0.0.1 --port 8000
   ```
2. **Access the Web App & API**:
   - Web Dashboard: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
   - API Docs (Swagger UI): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Option 2: Run Frontend Development Server

1. **Install frontend dependencies & start dev server**:
   ```bash
   cd apix-frontend
   npm install
   npm run dev
   ```
2. Open [http://localhost:5173/](http://localhost:5173/)

---

## 📐 Index Methodology Formula

$$I_{r,t} = \left(\frac{P_{r,t}}{P_{r,0}}\right) \times 100$$

$$I_{total,t} = \sum_{r} w_r \cdot I_{r,t} \quad \text{where } \sum w_r = 1.0$$

Where:
- $P_{r,0}$: Normalized average fare for route $r$ during base period (Jan 2026).
- $P_{r,t}$: Normalized average fare for route $r$ on date $t$.
- $w_r$: Annual seat capacity weight assigned to route $r$.

---

## 🧪 Running Automated Tests

```bash
cd apix-backend
$env:PYTHONPATH="."
uv run --with fastapi --with uvicorn --with pydantic --with pandas --with numpy --with sqlalchemy --with httpx --with pytest python -m pytest
```

---

## 🏛️ SIH 2026 Team Note
Built for **Smart India Hackathon 2026** (Problem Statement ID 26056). Designed to provide MoSPI, RBI, economists, and researchers with high-frequency, reliable visibility into domestic airfare inflation.
