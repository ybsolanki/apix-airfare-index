# APIx — Real-time Airfare Price Index (SIH 2026 • PS 26056)

**APIx** is a full-stack, deployment-ready economic analytics platform developed for **Smart India Hackathon 2026 (Problem Statement ID 26056)**.

APIx collects domestic airfare observations across major airline portals and Online Travel Agencies (OTAs), cleans and normalizes raw fares, stores historical observations, computes a mathematical **Airfare Price Index (APIx)**, and presents the results through a government-grade financial analytics dashboard and developer REST API.

---

## 🏛️ Visual Identity & Design Guidelines
- **Primary Palette**: White background (`#FFFFFF`), Sky Blue accents (`#0284C7`), Dark Navy text (`#0F172A`), restrained Red (`#DC2626`) for fare increases / volatility.
- **Typography**: Inter / system-ui sans-serif typography.
- **Style**: Government data portal + modern financial analytics dashboard + aviation platform. Zero AI fluff, neon glow, or excessive glassmorphism.
- **Demo Indicator**: Explicit **"Prototype • Demonstration Data"** header badge and data refresh indicator.

---

## 🏗️ Deployment-Ready Architecture

The project is structured with **clean separation between frontend and backend**:

```
apix-airfare-index/
├── .gitignore               # Strict exclusion of node_modules, .env, *.db, build dist
├── README.md                # Full deployment & GitHub setup instructions
├── apix-backend/            # Standalone Python FastAPI Backend
│   ├── .env.example         # Backend environment variable template
│   ├── api/                 # FastAPI router endpoints & CORS middleware
│   ├── database/            # SQLAlchemy schemas & SQLite engine
│   ├── index/               # Mathematical Index Calculator (calculator.py)
│   ├── processors/          # Data Cleaner, Normalizer, Deduplicator
│   ├── scrapers/            # BaseScraper & Modular Scraper Adapters
│   ├── requirements.txt     # Python production dependencies
│   └── tests/               # Pytest automated test suite
└── apix-frontend/           # Standalone React + Vite + Tailwind CSS Frontend
    ├── .env.example         # Frontend environment variable template (VITE_API_BASE_URL)
    ├── package.json         # Node.js dependencies & scripts
    ├── vite.config.js       # Vite build & proxy configuration
    └── src/                 # React UI components & ErrorBoundary
```

---

## 🔐 Security & Secrets Compliance
> [!IMPORTANT]
> **Zero Secrets in Repository**: No API keys, passwords, database credentials, or private tokens are stored in the codebase. All runtime configuration is driven strictly through environment variables.

---

## 🌐 Environment Variables

### Backend (`apix-backend/.env`)
Create a `.env` file inside `apix-backend/` based on `apix-backend/.env.example`:
```env
PORT=8000
HOST=0.0.0.0
DATABASE_URL=sqlite:///./apix.db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://your-frontend.vercel.app
```

### Frontend (`apix-frontend/.env`)
Create a `.env` file inside `apix-frontend/` based on `apix-frontend/.env.example`:
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## 🐙 Push Project to GitHub

To publish this project to GitHub, execute the following commands in your terminal:

```bash
# 1. Rename default branch to main
git branch -M main

# 2. Add your GitHub repository remote URL (replace URL with your repository link)
git remote add origin https://github.com/YOUR_USERNAME/apix-airfare-index.git

# 3. Push to GitHub
git push -u origin main
```

---

## 🚀 Deployment Instructions

### 1. Backend Deployment (Render / Railway / Fly.io / AWS)
1. **Render.com** (Web Service):
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python -m uvicorn api.main:app --host 0.0.0.0 --port $PORT`
   - Set Environment Variable: `CORS_ORIGINS=https://your-frontend-domain.com`

2. **Docker Deployment**:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY apix-backend/ .
   RUN pip install --no-cache-dir -r requirements.txt
   CMD ["python", "-m", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

### 2. Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
1. Connect your GitHub repository to **Vercel** or **Netlify**.
2. Set **Root Directory** to `apix-frontend`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Set Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend-api-url.com/api`

---

## 💻 Local Development Setup

### Running Backend
```bash
cd apix-backend
uv run --with uvicorn --with fastapi --with pydantic --with pandas --with numpy --with sqlalchemy python -m uvicorn api.main:app --reload --port 8000
```

### Running Frontend
```bash
cd apix-frontend
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/)

---

## 📐 Index Methodology Formula

$$I_{r,t} = \left(\frac{P_{r,t}}{P_{r,0}}\right) \times 100 \quad \text{and} \quad I_{total,t} = \sum_{r} w_r \cdot I_{r,t}$$

---

## 🧪 Automated Testing
```bash
cd apix-backend
$env:PYTHONPATH="."
uv run --with fastapi --with uvicorn --with pydantic --with pandas --with numpy --with sqlalchemy --with httpx --with pytest python -m pytest
```

---

## 🏛️ SIH 2026 Team Note
Built for **Smart India Hackathon 2026 (Problem Statement ID 26056)** to provide MoSPI, RBI, economists, and research analysts with high-frequency, reliable visibility into domestic airfare inflation.
