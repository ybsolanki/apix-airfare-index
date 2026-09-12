import random
import datetime
from typing import List, Dict, Any
from scrapers.base_scraper import BaseScraper

class AirlineScraperAdapter(BaseScraper):
    """
    Scraper adapter for Direct Airline Portals (IndiGo, Air India, Akasa Air, SpiceJet).
    Designed to interface with official NDC (New Distribution Capability) or direct APIs.
    """
    def __init__(self, airline_name: str, airline_code: str):
        super().__init__(source_name=f"{airline_name} Portal", source_type="Airline Direct")
        self.airline_name = airline_name
        self.airline_code = airline_code

    def fetch_fares(self, origin: str, destination: str, travel_date: str, booking_window: str) -> List[Dict[str, Any]]:
        # Simulated observation extraction adhering to schema
        base_price = 5500.0 if origin in ["DEL", "BOM"] else 4200.0
        multiplier = 1.4 if booking_window in ["T+1", "T+3"] else 1.0
        
        obs = []
        for i in range(2):
            flight_no = f"{self.airline_code}-{random.randint(100, 999)}"
            fare_val = round(base_price * multiplier * random.uniform(0.95, 1.05), -1)
            obs.append({
                "origin": origin,
                "destination": destination,
                "airline": self.airline_name,
                "source": self.source_name,
                "flight_number": flight_no,
                "departure_time": f"{travel_date}T08:00:00",
                "arrival_time": f"{travel_date}T10:15:00",
                "stops": 0,
                "fare": fare_val,
                "currency": "INR",
                "booking_window": booking_window,
                "collected_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
            })
        return obs
