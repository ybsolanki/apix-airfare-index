import os
import pytest
from fastapi.testclient import TestClient
from api.main import app, calculator
from database.db import init_db, SessionLocal
from database.seed_data import seed_database

@pytest.fixture(scope="module")
def client():
    init_db()
    db = SessionLocal()
    seed_database(db)
    calculator.recalculate_all(db)
    db.close()
    
    with TestClient(app) as c:
        yield c

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_stats_endpoint(client):
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["airfare_price_index"] > 100.0
    assert data["routes_tracked"] == 24
    assert data["total_observations"] > 5000
    assert data["average_domestic_fare"] > 3000.0

def test_routes_endpoint(client):
    response = client.get("/api/routes")
    assert response.status_code == 200
    routes = response.json()
    assert len(routes) == 24
    del_bom = next((r for r in routes if r["id"] == "DEL-BOM"), None)
    assert del_bom is not None
    assert del_bom["origin_code"] == "DEL"
    assert del_bom["destination_code"] == "BOM"

def test_route_details_del_bom(client):
    response = client.get("/api/routes/DEL-BOM")
    assert response.status_code == 200
    data = response.json()
    assert data["route"]["id"] == "DEL-BOM"
    assert len(data["booking_window_analysis"]) == 6
    windows = [bw["window"] for bw in data["booking_window_analysis"]]
    assert "T+1" in windows
    assert "T+45" in windows
    
    # Verify T+1 fare higher than T+45 fare (dynamic advance purchase window pricing rule)
    t1_fare = next(bw["avg_fare"] for bw in data["booking_window_analysis"] if bw["window"] == "T+1")
    t45_fare = next(bw["avg_fare"] for bw in data["booking_window_analysis"] if bw["window"] == "T+45")
    assert t1_fare > t45_fare

def test_fares_search(client):
    response = client.get("/api/fares?origin=DEL&destination=BOM&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    assert len(data["items"]) <= 10

def test_sources_endpoint(client):
    response = client.get("/api/sources")
    assert response.status_code == 200
    sources = response.json()
    assert len(sources) >= 5

def test_refresh_endpoint(client):
    response = client.post("/api/refresh")
    assert response.status_code == 200
    data = response.json()
    assert "recalculated" in data["message"]
