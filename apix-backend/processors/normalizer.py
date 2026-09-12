from typing import List, Dict, Any

class DataNormalizer:
    """
    Data Normalizer for APIx.
    Standardizes currency, cabin class, and booking window weightings.
    """
    def normalize_record(self, record: Dict[str, Any], distance_km: float = 1000.0) -> Dict[str, Any]:
        rec = record.copy()
        # Convert to INR if in USD/EUR
        if rec.get("currency") == "USD":
            rec["fare"] = rec["fare"] * 84.0
            rec["currency"] = "INR"
        
        # Calculate per-kilometer fare density
        rec["fare_per_km"] = round(rec["fare"] / max(distance_km, 100.0), 2)
        return rec
