import datetime
import random
import json
from sqlalchemy.orm import Session
from database.models import DBRoute, DBFareObservation, DBIndexSnapshot, DBDataSourceStatus

INDIAN_ROUTES = [
    {"id": "DEL-BOM", "origin_code": "DEL", "origin_name": "Delhi", "destination_code": "BOM", "destination_name": "Mumbai", "distance_km": 1148, "weight": 0.095, "category": "Metro", "base_fare": 5400.0},
    {"id": "BOM-DEL", "origin_code": "BOM", "origin_name": "Mumbai", "destination_code": "DEL", "destination_name": "Delhi", "distance_km": 1148, "weight": 0.095, "category": "Metro", "base_fare": 5450.0},
    {"id": "DEL-BLR", "origin_code": "DEL", "origin_name": "Delhi", "destination_code": "BLR", "destination_name": "Bengaluru", "distance_km": 1740, "weight": 0.080, "category": "Metro", "base_fare": 6200.0},
    {"id": "BLR-DEL", "origin_code": "BLR", "origin_name": "Bengaluru", "destination_code": "DEL", "destination_name": "Delhi", "distance_km": 1740, "weight": 0.080, "category": "Metro", "base_fare": 6250.0},
    {"id": "BOM-BLR", "origin_code": "BOM", "origin_name": "Mumbai", "destination_code": "BLR", "destination_name": "Bengaluru", "distance_km": 842, "weight": 0.065, "category": "Metro", "base_fare": 4300.0},
    {"id": "BLR-BOM", "origin_code": "BLR", "origin_name": "Bengaluru", "destination_code": "BOM", "destination_name": "Mumbai", "distance_km": 842, "weight": 0.065, "category": "Metro", "base_fare": 4350.0},
    {"id": "DEL-CCU", "origin_code": "DEL", "origin_name": "Delhi", "destination_code": "CCU", "destination_name": "Kolkata", "distance_km": 1305, "weight": 0.055, "category": "Metro", "base_fare": 5600.0},
    {"id": "CCU-DEL", "origin_code": "CCU", "origin_name": "Kolkata", "destination_code": "DEL", "destination_name": "Delhi", "distance_km": 1305, "weight": 0.055, "category": "Metro", "base_fare": 5650.0},
    {"id": "BOM-AMD", "origin_code": "BOM", "origin_name": "Mumbai", "destination_code": "AMD", "destination_name": "Ahmedabad", "distance_km": 441, "weight": 0.040, "category": "Tier-2", "base_fare": 3200.0},
    {"id": "AMD-BOM", "origin_code": "AMD", "origin_name": "Ahmedabad", "destination_code": "BOM", "destination_name": "Mumbai", "distance_km": 441, "weight": 0.040, "category": "Tier-2", "base_fare": 3250.0},
    {"id": "DEL-HYD", "origin_code": "DEL", "origin_name": "Delhi", "destination_code": "HYD", "destination_name": "Hyderabad", "distance_km": 1253, "weight": 0.050, "category": "Metro", "base_fare": 5100.0},
    {"id": "HYD-DEL", "origin_code": "HYD", "origin_name": "Hyderabad", "destination_code": "DEL", "destination_name": "Delhi", "distance_km": 1253, "weight": 0.050, "category": "Metro", "base_fare": 5150.0},
    {"id": "BLR-HYD", "origin_code": "BLR", "origin_name": "Bengaluru", "destination_code": "HYD", "destination_name": "Hyderabad", "distance_km": 500, "weight": 0.035, "category": "Metro", "base_fare": 3400.0},
    {"id": "HYD-BLR", "origin_code": "HYD", "origin_name": "Hyderabad", "destination_code": "BLR", "destination_name": "Bengaluru", "distance_km": 500, "weight": 0.035, "category": "Metro", "base_fare": 3450.0},
    {"id": "DEL-MAA", "origin_code": "DEL", "origin_name": "Delhi", "destination_code": "MAA", "destination_name": "Chennai", "distance_km": 1760, "weight": 0.045, "category": "Metro", "base_fare": 6100.0},
    {"id": "MAA-DEL", "origin_code": "MAA", "origin_name": "Chennai", "destination_code": "DEL", "destination_name": "Delhi", "distance_km": 1760, "weight": 0.045, "category": "Metro", "base_fare": 6150.0},
    {"id": "BOM-GOI", "origin_code": "BOM", "origin_name": "Mumbai", "destination_code": "GOI", "destination_name": "Goa", "distance_km": 435, "weight": 0.030, "category": "Tier-2", "base_fare": 3600.0},
    {"id": "GOI-BOM", "origin_code": "GOI", "origin_name": "Goa", "destination_code": "BOM", "destination_name": "Mumbai", "distance_km": 435, "weight": 0.030, "category": "Tier-2", "base_fare": 3650.0},
    {"id": "DEL-PNQ", "origin_code": "DEL", "origin_name": "Delhi", "destination_code": "PNQ", "destination_name": "Pune", "distance_km": 1173, "weight": 0.025, "category": "Tier-2", "base_fare": 5300.0},
    {"id": "PNQ-DEL", "origin_code": "PNQ", "origin_name": "Pune", "destination_code": "DEL", "destination_name": "Delhi", "distance_km": 1173, "weight": 0.025, "category": "Tier-2", "base_fare": 5350.0},
    {"id": "DEL-COK", "origin_code": "DEL", "origin_name": "Delhi", "destination_code": "COK", "destination_name": "Kochi", "distance_km": 2080, "weight": 0.020, "category": "Tier-2", "base_fare": 7400.0},
    {"id": "COK-DEL", "origin_code": "COK", "origin_name": "Kochi", "destination_code": "DEL", "destination_name": "Delhi", "distance_km": 2080, "weight": 0.020, "category": "Tier-2", "base_fare": 7450.0},
    {"id": "CCU-BLR", "origin_code": "CCU", "origin_name": "Kolkata", "destination_code": "BLR", "destination_name": "Bengaluru", "distance_km": 1560, "weight": 0.020, "category": "Metro", "base_fare": 5900.0},
    {"id": "BLR-CCU", "origin_code": "BLR", "origin_name": "Bengaluru", "destination_code": "CCU", "destination_name": "Kolkata", "distance_km": 1560, "weight": 0.020, "category": "Metro", "base_fare": 5950.0},
]

AIRLINES = [
    {"name": "IndiGo", "prefix": "6E", "mult": 0.96},
    {"name": "Air India", "prefix": "AI", "mult": 1.05},
    {"name": "Akasa Air", "prefix": "QP", "mult": 0.94},
    {"name": "SpiceJet", "prefix": "SG", "mult": 0.92},
    {"name": "AI Express", "prefix": "IX", "mult": 0.95},
]

SOURCES = [
    {"name": "MakeMyTrip", "type": "OTA", "status": "Active (Simulated)", "records": 4820, "health": 99.8},
    {"name": "Yatra", "type": "OTA", "status": "Active (Simulated)", "records": 3910, "health": 99.4},
    {"name": "EaseMyTrip", "type": "OTA", "status": "Active (Simulated)", "records": 3450, "health": 98.9},
    {"name": "Cleartrip", "type": "OTA", "status": "Active (Simulated)", "records": 2980, "health": 99.1},
    {"name": "Ixigo", "type": "OTA", "status": "Active (Simulated)", "records": 2110, "health": 98.5},
    {"name": "Direct Airline Portal", "type": "Airline API", "status": "Scraper Ready", "records": 1150, "health": 100.0},
]

BOOKING_WINDOWS = [
    {"window": "T+1", "multiplier": 1.85},
    {"window": "T+3", "multiplier": 1.55},
    {"window": "T+7", "multiplier": 1.30},
    {"window": "T+15", "multiplier": 1.12},
    {"window": "T+30", "multiplier": 1.02},
    {"window": "T+45", "multiplier": 0.98},
]

def seed_database(db: Session):
    # Check if data exists
    if db.query(DBRoute).count() > 0:
        return

    print("Seeding database with realistic domestic Indian airfare dataset...")

    # 1. Seed Routes
    for r in INDIAN_ROUTES:
        route_obj = DBRoute(**r)
        db.add(route_obj)
    db.commit()

    # 2. Seed Data Sources
    for idx, s in enumerate(SOURCES):
        ds_obj = DBDataSourceStatus(
            id=f"src-{idx+1}",
            name=s["name"],
            source_type=s["type"],
            status=s["status"],
            last_collection=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            records_collected=s["records"],
            health_score=s["health"]
        )
        db.add(ds_obj)
    db.commit()

    # 3. Seed Observations (30 Days History)
    today = datetime.date.today()
    random.seed(2026)  # Deterministic seed for consistent hackathon demo

    obs_list = []
    obs_id_counter = 10000

    # Trend multiplier over 30 days: gradual price increase (fuel index adjustment) from 1.125 to 1.186
    for day_offset in range(30, -1, -1):
        obs_date = today - datetime.timedelta(days=day_offset)
        date_str = obs_date.isoformat()
        
        # Macro trend: index rises slightly over the month
        time_factor = 1.125 + (30 - day_offset) * (0.061 / 30) + (random.uniform(-0.005, 0.005))
        
        for route in INDIAN_ROUTES:
            base_p = route["base_fare"]
            
            # Select 2-3 airlines per day per route to create ~18,000+ realistic observations
            for bw in BOOKING_WINDOWS:
                for airline in random.sample(AIRLINES, k=3):
                    source = random.choice(SOURCES[:5])["name"]
                    
                    flight_num = f"{airline['prefix']}-{random.randint(100, 999)}"
                    dep_hour = random.choice([6, 7, 8, 9, 11, 14, 16, 18, 20, 21])
                    arr_hour = (dep_hour + int(route["distance_km"] / 700) + 1) % 24
                    
                    dep_time = f"{date_str}T{dep_hour:02d}:30:00"
                    arr_time = f"{date_str}T{arr_hour:02d}:45:00"
                    
                    # Calculate calculated fare with realistic noise
                    raw_fare = base_p * bw["multiplier"] * airline["mult"] * time_factor
                    # Add random micro noise (e.g. ±3%)
                    final_fare = round(raw_fare * random.uniform(0.97, 1.03), -1)
                    
                    obs_id_counter += 1
                    obs = DBFareObservation(
                        id=f"OBS-{obs_id_counter}",
                        route_id=route["id"],
                        origin=route["origin_code"],
                        destination=route["destination_code"],
                        airline=airline["name"],
                        source=source,
                        flight_number=flight_num,
                        departure_time=dep_time,
                        arrival_time=arr_time,
                        stops=0 if random.random() > 0.15 else 1,
                        fare=final_fare,
                        currency="INR",
                        booking_window=bw["window"],
                        observation_date=date_str,
                        collected_at=f"{date_str}T10:15:00Z",
                        is_clean=True
                    )
                    obs_list.append(obs)
                    
                    if len(obs_list) >= 500:
                        db.bulk_save_objects(obs_list)
                        db.commit()
                        obs_list = []

    if obs_list:
        db.bulk_save_objects(obs_list)
        db.commit()

    print(f"Seeding completed. Total observations in DB: {db.query(DBFareObservation).count()}")
