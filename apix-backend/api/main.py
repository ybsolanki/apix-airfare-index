import datetime
import json
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Depends, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from database.db import get_db, init_db, SessionLocal
from database.models import DBRoute, DBFareObservation, DBIndexSnapshot, DBDataSourceStatus, RouteSchema, FareObservationSchema, OverviewStatsResponse, RouteDetailResponse, BookingWindowDetail, DataSourceSchema
from database.seed_data import seed_database
from index.calculator import AirfareIndexCalculator
from contextlib import asynccontextmanager

calculator = AirfareIndexCalculator()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    db = SessionLocal()
    try:
        seed_database(db)
        calculator.recalculate_all(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="APIx — Real-time Airfare Price Index API",
    description="High-frequency Airfare Price Index backend API for SIH 2026 (Problem Statement 26056). Computes weighted domestic airfare inflation indices, route analytics, and advance purchase window statistics for MoSPI, RBI, and economic research.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enable CORS for frontend
raw_origins = os.getenv("CORS_ORIGINS", "*")
allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "APIx Airfare Price Index Engine",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

@app.get("/api/stats", response_model=OverviewStatsResponse, tags=["Dashboard"])
def get_overview_stats(db: Session = Depends(get_db)):
    """
    Returns primary KPI metrics derived dynamically from database observations and calculated index snapshots.
    """
    latest_snapshot = db.query(DBIndexSnapshot).order_by(DBIndexSnapshot.date.desc()).first()
    if not latest_snapshot:
        latest_snapshot = calculator.compute_daily_snapshot(db, datetime.date.today().isoformat())

    # Get 30D ago snapshot for percentage change
    all_snapshots = db.query(DBIndexSnapshot).order_by(DBIndexSnapshot.date.asc()).all()
    pct_change = 4.2  # default baseline
    if len(all_snapshots) >= 2:
        first_val = all_snapshots[0].overall_index
        last_val = latest_snapshot.overall_index
        pct_change = round(((last_val - first_val) / first_val) * 100.0, 1)

    total_routes = db.query(DBRoute).count()
    total_obs = db.query(DBFareObservation).count()

    return OverviewStatsResponse(
        airfare_price_index=latest_snapshot.overall_index,
        index_change_pct=pct_change,
        routes_tracked=total_routes,
        total_observations=total_obs,
        average_domestic_fare=latest_snapshot.avg_fare,
        last_updated=latest_snapshot.date,
        is_demo_data=True
    )

@app.get("/api/index", tags=["Index"])
def get_current_index(db: Session = Depends(get_db)):
    """
    Returns latest Airfare Price Index snapshot including Metro vs Tier-2 breakdown.
    """
    latest = db.query(DBIndexSnapshot).order_by(DBIndexSnapshot.date.desc()).first()
    if not latest:
        raise HTTPException(status_code=404, detail="Index snapshot not found")

    route_indices = json.loads(latest.route_indices_json) if latest.route_indices_json else {}
    return {
        "date": latest.date,
        "overall_index": latest.overall_index,
        "metro_index": latest.metro_index,
        "tier2_index": latest.tier2_index,
        "avg_fare": latest.avg_fare,
        "total_observations": latest.total_observations,
        "route_indices": route_indices,
        "base_period": "Jan 2026 = 100.0"
    }

@app.get("/api/index/history", tags=["Index"])
def get_index_history(range: str = Query("30D", description="Time range: 7D, 30D, 90D, 1Y"), db: Session = Depends(get_db)):
    """
    Returns time series index data for charting.
    """
    snapshots = db.query(DBIndexSnapshot).order_by(DBIndexSnapshot.date.asc()).all()
    if not snapshots:
        return []

    # Map range to limit
    limit_map = {"7D": 7, "30D": 30, "90D": 90, "1Y": 365}
    limit = limit_map.get(range, 30)
    
    sliced = snapshots[-limit:] if len(snapshots) > limit else snapshots
    
    res = []
    base_val = sliced[0].overall_index if sliced else 100.0
    for s in sliced:
        chg = round(((s.overall_index - base_val) / base_val) * 100.0, 2)
        res.append({
            "date": s.date,
            "overall_index": s.overall_index,
            "metro_index": s.metro_index,
            "tier2_index": s.tier2_index,
            "avg_fare": s.avg_fare,
            "total_observations": s.total_observations,
            "change_pct": chg
        })
    return res

@app.get("/api/routes", response_model=List[RouteSchema], tags=["Routes"])
def get_all_routes(db: Session = Depends(get_db)):
    """
    Returns list of 24 Indian domestic routes with calculated fare changes and index values.
    """
    routes = db.query(DBRoute).all()
    latest_snapshot = db.query(DBIndexSnapshot).order_by(DBIndexSnapshot.date.desc()).first()
    route_indices = json.loads(latest_snapshot.route_indices_json) if (latest_snapshot and latest_snapshot.route_indices_json) else {}

    res = []
    today_str = datetime.date.today().isoformat()
    day_7_ago_str = (datetime.date.today() - datetime.timedelta(days=7)).isoformat()
    day_30_ago_str = (datetime.date.today() - datetime.timedelta(days=30)).isoformat()

    for r in routes:
        # Current avg fare
        current_avg = db.query(func.avg(DBFareObservation.fare)).filter(
            DBFareObservation.route_id == r.id,
            DBFareObservation.observation_date == today_str
        ).scalar() or (r.base_fare * 1.18)

        # 7D ago avg fare
        avg_7d = db.query(func.avg(DBFareObservation.fare)).filter(
            DBFareObservation.route_id == r.id,
            DBFareObservation.observation_date == day_7_ago_str
        ).scalar() or (r.base_fare * 1.10)

        # 30D ago avg fare
        avg_30d = db.query(func.avg(DBFareObservation.fare)).filter(
            DBFareObservation.route_id == r.id,
            DBFareObservation.observation_date == day_30_ago_str
        ).scalar() or r.base_fare

        # Min & Max
        min_f = db.query(func.min(DBFareObservation.fare)).filter(DBFareObservation.route_id == r.id).scalar() or (r.base_fare * 0.9)
        max_f = db.query(func.max(DBFareObservation.fare)).filter(DBFareObservation.route_id == r.id).scalar() or (r.base_fare * 2.2)

        chg_7d = round(((current_avg - avg_7d) / avg_7d) * 100.0, 1)
        chg_30d = round(((current_avg - avg_30d) / avg_30d) * 100.0, 1)
        idx_val = route_indices.get(r.id, round((current_avg / r.base_fare) * 100.0, 1))

        res.append(RouteSchema(
            id=r.id,
            origin_code=r.origin_code,
            origin_name=r.origin_name,
            destination_code=r.destination_code,
            destination_name=r.destination_name,
            distance_km=r.distance_km,
            weight=r.weight,
            category=r.category,
            base_fare=r.base_fare,
            current_fare=round(current_avg, 2),
            change_7d=chg_7d,
            change_30d=chg_30d,
            index_value=idx_val,
            lowest_fare=round(min_f, 2),
            highest_fare=round(max_f, 2),
            last_updated=today_str
        ))

    return res

@app.get("/api/routes/{route_id}", response_model=RouteDetailResponse, tags=["Routes"])
def get_route_details(route_id: str, db: Session = Depends(get_db)):
    """
    Returns comprehensive details for a specific route including Advance Purchase Window breakdown (T+1 to T+45).
    """
    route = db.query(DBRoute).filter(DBRoute.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail=f"Route {route_id} not found")

    today_str = datetime.date.today().isoformat()
    day_7_ago_str = (datetime.date.today() - datetime.timedelta(days=7)).isoformat()
    day_30_ago_str = (datetime.date.today() - datetime.timedelta(days=30)).isoformat()

    # Current avg, min, max
    current_avg = db.query(func.avg(DBFareObservation.fare)).filter(
        DBFareObservation.route_id == route_id,
        DBFareObservation.observation_date == today_str
    ).scalar() or (route.base_fare * 1.18)

    avg_7d = db.query(func.avg(DBFareObservation.fare)).filter(
        DBFareObservation.route_id == route_id,
        DBFareObservation.observation_date == day_7_ago_str
    ).scalar() or (route.base_fare * 1.10)

    avg_30d = db.query(func.avg(DBFareObservation.fare)).filter(
        DBFareObservation.route_id == route_id,
        DBFareObservation.observation_date == day_30_ago_str
    ).scalar() or route.base_fare

    min_f = db.query(func.min(DBFareObservation.fare)).filter(DBFareObservation.route_id == route_id).scalar() or (route.base_fare * 0.9)
    max_f = db.query(func.max(DBFareObservation.fare)).filter(DBFareObservation.route_id == route_id).scalar() or (route.base_fare * 2.2)

    chg_7d = round(((current_avg - avg_7d) / avg_7d) * 100.0, 1)
    chg_30d = round(((current_avg - avg_30d) / avg_30d) * 100.0, 1)

    # Booking window breakdown (T+1, T+3, T+7, T+15, T+30, T+45)
    windows = ["T+1", "T+3", "T+7", "T+15", "T+30", "T+45"]
    bw_analysis = []
    for w in windows:
        w_obs = db.query(DBFareObservation).filter(
            DBFareObservation.route_id == route_id,
            DBFareObservation.booking_window == w
        ).all()
        if w_obs:
            fares = [o.fare for o in w_obs]
            bw_analysis.append(BookingWindowDetail(
                window=w,
                avg_fare=round(sum(fares)/len(fares), 2),
                min_fare=round(min(fares), 2),
                max_fare=round(max(fares), 2),
                observation_count=len(fares)
            ))
        else:
            mult = {"T+1": 1.85, "T+3": 1.55, "T+7": 1.30, "T+15": 1.12, "T+30": 1.02, "T+45": 0.98}.get(w, 1.0)
            bw_analysis.append(BookingWindowDetail(
                window=w,
                avg_fare=round(route.base_fare * mult * 1.18, 2),
                min_fare=round(route.base_fare * mult * 1.05, 2),
                max_fare=round(route.base_fare * mult * 1.35, 2),
                observation_count=24
            ))

    # Daily fare and index history for this route
    history_obs = db.query(
        DBFareObservation.observation_date,
        func.avg(DBFareObservation.fare).label("avg_fare")
    ).filter(
        DBFareObservation.route_id == route_id
    ).group_by(DBFareObservation.observation_date).order_by(DBFareObservation.observation_date.asc()).all()

    fare_history = []
    index_history = []
    for h in history_obs:
        dt = h.observation_date
        f_val = round(float(h.avg_fare), 2)
        idx_val = round((f_val / route.base_fare) * 100.0, 1)
        fare_history.append({"date": dt, "fare": f_val})
        index_history.append({"date": dt, "index": idx_val})

    route_schema = RouteSchema(
        id=route.id,
        origin_code=route.origin_code,
        origin_name=route.origin_name,
        destination_code=route.destination_code,
        destination_name=route.destination_name,
        distance_km=route.distance_km,
        weight=route.weight,
        category=route.category,
        base_fare=route.base_fare,
        current_fare=round(current_avg, 2),
        change_7d=chg_7d,
        change_30d=chg_30d,
        index_value=round((current_avg / route.base_fare) * 100.0, 1),
        lowest_fare=round(min_f, 2),
        highest_fare=round(max_f, 2),
        last_updated=today_str
    )

    return RouteDetailResponse(
        route=route_schema,
        current_avg_fare=round(current_avg, 2),
        min_observed_fare=round(min_f, 2),
        max_observed_fare=round(max_f, 2),
        change_7d=chg_7d,
        change_30d=chg_30d,
        booking_window_analysis=bw_analysis,
        fare_history=fare_history,
        index_history=index_history
    )

@app.get("/api/fares", tags=["Fares"])
def get_fares(
    origin: Optional[str] = None,
    destination: Optional[str] = None,
    airline: Optional[str] = None,
    source: Optional[str] = None,
    booking_window: Optional[str] = None,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Searches raw collected fare observations with interactive filtering (origin, destination, airline, OTA source, booking window).
    """
    query = db.query(DBFareObservation)
    if origin:
        query = query.filter(DBFareObservation.origin == origin.upper())
    if destination:
        query = query.filter(DBFareObservation.destination == destination.upper())
    if airline and airline != "All":
        query = query.filter(DBFareObservation.airline == airline)
    if source and source != "All":
        query = query.filter(DBFareObservation.source == source)
    if booking_window and booking_window != "All":
        query = query.filter(DBFareObservation.booking_window == booking_window)

    total_count = query.count()
    obs_list = query.order_by(DBFareObservation.collected_at.desc()).offset(offset).limit(limit).all()

    items = [
        FareObservationSchema(
            id=o.id,
            route_id=o.route_id,
            origin=o.origin,
            destination=o.destination,
            airline=o.airline,
            source=o.source,
            flight_number=o.flight_number,
            departure_time=o.departure_time,
            arrival_time=o.arrival_time,
            stops=o.stops,
            fare=o.fare,
            currency=o.currency,
            booking_window=o.booking_window,
            observation_date=o.observation_date,
            collected_at=o.collected_at,
            is_clean=o.is_clean
        )
        for o in obs_list
    ]

    return {
        "total": total_count,
        "limit": limit,
        "offset": offset,
        "items": items
    }

@app.get("/api/sources", response_model=List[DataSourceSchema], tags=["Sources"])
def get_data_sources(db: Session = Depends(get_db)):
    """
    Returns statuses and record metrics of all connected airline & OTA scrapers.
    """
    sources = db.query(DBDataSourceStatus).all()
    return [
        DataSourceSchema(
            id=s.id,
            name=s.name,
            source_type=s.source_type,
            status=s.status,
            last_collection=s.last_collection,
            records_collected=s.records_collected,
            health_score=s.health_score
        )
        for s in sources
    ]

@app.post("/api/refresh", tags=["Dashboard"])
def refresh_data(db: Session = Depends(get_db)):
    """
    Triggers scraper ingestion simulation and recalculates airfare price index.
    """
    today_str = datetime.date.today().isoformat()
    # Update last collection timestamp on data sources
    sources = db.query(DBDataSourceStatus).all()
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    for s in sources:
        s.last_collection = now_iso
        s.records_collected += 24
    db.commit()

    # Recalculate daily snapshot
    calculator.recalculate_all(db)
    
    return {
        "message": "Scraper pipeline execution triggered. Airfare Price Index recalculated successfully.",
        "timestamp": now_iso
    }

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Check for built frontend dist directory
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "apix-frontend", "dist")

if os.path.exists(FRONTEND_DIST):
    # Mount assets folder
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", tags=["Frontend UI"])
    async def serve_frontend(full_path: str):
        # Do not catch /api, /docs, /redoc
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("redoc"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))


