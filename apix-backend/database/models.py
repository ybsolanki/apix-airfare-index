import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, create_engine
from sqlalchemy.orm import declarative_base
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

Base = declarative_base()

class DBRoute(Base):
    __tablename__ = "routes"
    
    id = Column(String, primary_key=True)  # e.g. DEL-BOM
    origin_code = Column(String, nullable=False)
    origin_name = Column(String, nullable=False)
    destination_code = Column(String, nullable=False)
    destination_name = Column(String, nullable=False)
    distance_km = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)  # Weight for index calculation (sum = 1.0)
    category = Column(String, nullable=False)  # Metro or Tier-2
    base_fare = Column(Float, nullable=False)  # Baseline fare at period t0 (Jan 2026)

class DBFareObservation(Base):
    __tablename__ = "fare_observations"
    
    id = Column(String, primary_key=True)
    route_id = Column(String, nullable=False)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    airline = Column(String, nullable=False)
    source = Column(String, nullable=False)
    flight_number = Column(String, nullable=False)
    departure_time = Column(String, nullable=False)
    arrival_time = Column(String, nullable=False)
    stops = Column(Integer, nullable=False, default=0)
    fare = Column(Float, nullable=False)
    currency = Column(String, nullable=False, default="INR")
    booking_window = Column(String, nullable=False)  # T+1, T+3, T+7, T+15, T+30, T+45
    observation_date = Column(String, nullable=False)  # YYYY-MM-DD
    collected_at = Column(String, nullable=False)  # ISO timestamp
    is_clean = Column(Boolean, nullable=False, default=True)

class DBIndexSnapshot(Base):
    __tablename__ = "index_snapshots"
    
    date = Column(String, primary_key=True)  # YYYY-MM-DD
    overall_index = Column(Float, nullable=False)
    metro_index = Column(Float, nullable=False)
    tier2_index = Column(Float, nullable=False)
    avg_fare = Column(Float, nullable=False)
    total_observations = Column(Integer, nullable=False)
    route_indices_json = Column(Text, nullable=False)  # JSON string of route_id -> index value

class DBDataSourceStatus(Base):
    __tablename__ = "data_source_statuses"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    source_type = Column(String, nullable=False)  # OTA, Airline, Government Reference
    status = Column(String, nullable=False)  # Active (Simulated), Scraper Ready
    last_collection = Column(String, nullable=False)
    records_collected = Column(Integer, nullable=False)
    health_score = Column(Float, nullable=False)

# Pydantic Schemas for API responses
class RouteSchema(BaseModel):
    id: str
    origin_code: str
    origin_name: str
    destination_code: str
    destination_name: str
    distance_km: int
    weight: float
    category: str
    base_fare: float
    current_fare: Optional[float] = None
    change_7d: Optional[float] = None
    change_30d: Optional[float] = None
    index_value: Optional[float] = None
    lowest_fare: Optional[float] = None
    highest_fare: Optional[float] = None
    last_updated: Optional[str] = None

class FareObservationSchema(BaseModel):
    id: str
    route_id: str
    origin: str
    destination: str
    airline: str
    source: str
    flight_number: str
    departure_time: str
    arrival_time: str
    stops: int
    fare: float
    currency: str
    booking_window: str
    observation_date: str
    collected_at: str
    is_clean: bool

class BookingWindowDetail(BaseModel):
    window: str  # T+1, T+3, T+7, T+15, T+30, T+45
    avg_fare: float
    min_fare: float
    max_fare: float
    observation_count: int

class RouteDetailResponse(BaseModel):
    route: RouteSchema
    current_avg_fare: float
    min_observed_fare: float
    max_observed_fare: float
    change_7d: float
    change_30d: float
    booking_window_analysis: List[BookingWindowDetail]
    fare_history: List[Dict[str, Any]]
    index_history: List[Dict[str, Any]]

class IndexHistoryPoint(BaseModel):
    date: str
    overall_index: float
    metro_index: float
    tier2_index: float
    avg_fare: float
    change_pct: Optional[float] = 0.0

class OverviewStatsResponse(BaseModel):
    airfare_price_index: float
    index_change_pct: float
    routes_tracked: int
    total_observations: int
    average_domestic_fare: float
    last_updated: str
    is_demo_data: bool = True

class DataSourceSchema(BaseModel):
    id: str
    name: str
    source_type: str
    status: str
    last_collection: str
    records_collected: int
    health_score: float
