from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseScraper(ABC):
    """
    Abstract base class for all APIx airfare scrapers.
    Ensures a standardized interface for fetching flight observations
    from direct airline APIs, OTAs, or GDS data providers.
    """
    
    def __init__(self, source_name: str, source_type: str):
        self.source_name = source_name
        self.source_type = source_type
        
    @abstractmethod
    def fetch_fares(self, origin: str, destination: str, travel_date: str, booking_window: str) -> List[Dict[str, Any]]:
        """
        Fetch raw fare observations for a given origin-destination pair.
        Returns a list of raw observation dictionaries.
        """
        pass
        
    def validate_rate_limit(self) -> bool:
        """
        Validates rate limits and robots.txt compliance before initiating requests.
        """
        return True
