# Smart India Hackathon 2026 — Technical Approach Document

## Project Details
- **Problem Statement ID**: 26056
- **Title**: Real-time Airfare Price Index (APIx)
- **Target Beneficiaries**: Ministry of Statistics and Programme Implementation (MoSPI), Reserve Bank of India (RBI), Aviation Analysts, Economic Researchers
- **Domain**: Macroeconomic Inflation Tracking, Data Science & Transportation Economics
- **GitHub Repository**: [https://github.com/ybsolanki/apix-airfare-index](https://github.com/ybsolanki/apix-airfare-index)
- **Live Demo Platform**: [https://ybsolanki.github.io/apix-airfare-index/](https://ybsolanki.github.io/apix-airfare-index/)

---

## 1. Executive Summary & Problem Context

### 1.1 Problem Statement
Traditional Consumer Price Index (CPI) calculations rely on static, monthly manual surveys to sample transportation costs. In modern aviation, dynamic pricing algorithms adjust airfares multiple times daily based on demand, booking windows, fuel prices, and seat inventory. This creates significant lag and misalignment between official CPI figures and actual consumer airfare expenditure.

### 1.2 Proposed Solution (APIx)
**APIx** is a high-frequency, scalable data architecture that systematically collects airfare observations across Indian domestic flight corridors, filters and normalizes raw fares, stores structured observations, and computes a standardized **Airfare Price Index**.

```
+-----------------------------------------------------------------------------------+
|                                  APIx DATA PIPELINE                               |
|                                                                                   |
|  [ Data Sources ] -> [ Processing Engine ] -> [ Index Engine ] -> [ Output API ]  |
|  - Airline APIs      - Outlier Filter         - Base (100.0)      - Dashboard     |
|  - OTAs              - Normalizer             - Route Weights     - REST API      |
|  - GDS Data          - Deduplicator           - Aggregation       - Swagger Docs  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Technical System Architecture

### 2.1 Component Overview
The APIx system is organized into decoupled layers:

1. **Scraper & Ingestion Layer (`scrapers/`)**:
   - Abstract `BaseScraper` interface for standardizing data extraction.
   - Modular adapters for direct airline portals (IndiGo, Air India, Akasa Air, SpiceJet) and OTAs (MakeMyTrip, Yatra, EaseMyTrip, Cleartrip, Ixigo).
   - Strict adherence to ethical scraping practices (`robots.txt` compliance, rate limiting).

2. **Data Ingestion & Cleaning Engine (`processors/`)**:
   - **Outlier Detection (`cleaner.py`)**: Interquartile range (IQR) filters to flag corrupt or anomalous fares (< ₹1,000 or > ₹60,000 for domestic economy).
   - **Normalizer (`normalizer.py`)**: Standardizes baggage allowance (15kg), economy cabin class, and currency conversion to INR.
   - **Deduplicator (`deduplicator.py`)**: Merges duplicate observations for identical flight instances collected across multiple OTAs.

3. **Index Calculation Engine (`index/calculator.py`)**:
   - Implements Laspeyres-style weighted index math relative to base period $t_0 = \text{Jan 2026}$ ($I_0 = 100.0$).
   - Segregates sector movements into **Metro Corridors** and **Tier-2 Corridors**.

4. **REST API Backend (`api/main.py`)**:
   - FastAPI application serving structured JSON endpoints (`/api/stats`, `/api/index`, `/api/index/history`, `/api/routes`, `/api/fares`, `/api/sources`).
   - CORS middleware enabled for cross-origin access.

5. **Analytics Frontend Dashboard (`apix-frontend/`)**:
   - Responsive web interface built with React, Vite, Tailwind CSS, Lucide Icons, and Recharts.
   - Includes real-time KPI metrics, time-series line charts, advance purchase window analyses, filterable observation tables, and interactive API developer portal.

---

## 3. Mathematical Index Calculation Methodology

### 3.1 Base Period & Normalization
The index baseline is established at $t_0 = \text{January 2026}$, where $I_0 = 100.0$. For each route $r$, the base fare $P_{r,0}$ represents the weighted average fare collected during the base period.

### 3.2 Route-Level Price Relatives
For any given date $t$, the price relative $I_{r,t}$ for route $r$ is calculated as:

$$I_{r,t} = \left( \frac{P_{r,t}}{P_{r,0}} \right) \times 100$$

Where:
- $P_{r,t}$ = Current average normalized fare for route $r$ on date $t$.
- $P_{r,0}$ = Base period average fare for route $r$.

### 3.3 National Aggregated Airfare Price Index
The overall national Airfare Price Index $I_{\text{total},t}$ is a Laspeyres weighted average across all 24 domestic routes:

$$I_{\text{total},t} = \sum_{r=1}^{N} w_r \cdot I_{r,t} \quad \text{subject to } \sum_{r=1}^{N} w_r = 1.0$$

Where $w_r$ represents the annual seat capacity weight assigned to route $r$ (e.g., DEL-BOM = 0.095, DEL-BLR = 0.080).

### 3.4 Advance Purchase Window Standardizing
To isolate true market inflation from dynamic airline yield management, observations are categorized into six advance purchase windows:
- **$T+1$**: 1 day prior to departure (last-minute booking surge)
- **$T+3$**: 3 days prior
- **$T+7$**: 7 days prior
- **$T+15$**: 15 days prior
- **$T+30$**: 30 days prior
- **$T+45$**: 45 days prior (early baseline horizon)

---

## 4. Dataset Specification & Domestic Route Coverage

APIx covers **24 representative Indian domestic flight routes**:

| Route Corridor | Origin | Destination | Category | Base Fare (₹) | Weight ($w_r$) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Delhi → Mumbai** | DEL | BOM | Metro | ₹5,400 | 0.095 |
| **Mumbai → Delhi** | BOM | DEL | Metro | ₹5,450 | 0.095 |
| **Delhi → Bengaluru** | DEL | BLR | Metro | ₹6,200 | 0.080 |
| **Bengaluru → Delhi** | BLR | DEL | Metro | ₹6,250 | 0.080 |
| **Mumbai → Bengaluru** | BOM | BLR | Metro | ₹4,300 | 0.065 |
| **Bengaluru → Mumbai** | BLR | BOM | Metro | ₹4,350 | 0.065 |
| **Delhi → Kolkata** | DEL | CCU | Metro | ₹5,600 | 0.055 |
| **Kolkata → Delhi** | CCU | DEL | Metro | ₹5,650 | 0.055 |
| **Mumbai → Ahmedabad** | BOM | AMD | Tier-2 | ₹3,200 | 0.040 |
| **Ahmedabad → Mumbai** | AMD | BOM | Tier-2 | ₹3,250 | 0.040 |
| **Delhi → Hyderabad** | DEL | HYD | Metro | ₹5,100 | 0.050 |
| **Hyderabad → Delhi** | HYD | DEL | Metro | ₹5,150 | 0.050 |
| **Bengaluru → Hyderabad**| BLR | HYD | Metro | ₹3,400 | 0.035 |
| **Hyderabad → Bengaluru**| HYD | BLR | Metro | ₹3,450 | 0.035 |
| **Delhi → Chennai** | DEL | MAA | Metro | ₹6,100 | 0.045 |
| **Chennai → Delhi** | MAA | DEL | Metro | ₹6,150 | 0.045 |
| **Mumbai → Goa** | BOM | GOI | Tier-2 | ₹3,600 | 0.030 |
| **Goa → Mumbai** | GOI | BOM | Tier-2 | ₹3,650 | 0.030 |
| **Delhi → Pune** | DEL | PNQ | Tier-2 | ₹5,300 | 0.025 |
| **Pune → Delhi** | PNQ | DEL | Tier-2 | ₹5,350 | 0.025 |
| **Delhi → Kochi** | DEL | COK | Tier-2 | ₹7,400 | 0.020 |
| **Kochi → Delhi** | COK | DEL | Tier-2 | ₹7,450 | 0.020 |
| **Kolkata → Bengaluru** | CCU | BLR | Metro | ₹5,900 | 0.020 |
| **Bengaluru → Kolkata** | BLR | CCU | Metro | ₹5,950 | 0.020 |

---

## 5. Verification & Test Evidence

### 5.1 Automated Test Suite Results
Ran test suite in `apix-backend/tests/test_api.py`:
- `test_health_check`: PASSED
- `test_stats_endpoint`: PASSED
- `test_routes_endpoint`: PASSED
- `test_route_details_del_bom`: PASSED (Verified $T+1$ average fare ₹11,090 > $T+45$ average fare ₹5,906)
- `test_fares_search`: PASSED
- `test_sources_endpoint`: PASSED
- `test_refresh_endpoint`: PASSED

### 5.2 Build Status
- **Backend**: FastAPI startup completed in < 0.5s.
- **Frontend**: Vite bundle size minified to 603 kB (gzip: 168 kB). Zero compilation errors.

---

## 6. Future Scope & MoSPI / RBI Integration Roadmap

1. **Direct NDC API Integration**: Replace simulation adapters with direct GDS / IATA NDC feeds.
2. **Machine Learning Anomaly Detection**: Implement Isolation Forests to auto-detect unusual surge pricing events.
3. **Automated MoSPI API Push**: Scheduled high-frequency data push directly to MoSPI data warehouse.
