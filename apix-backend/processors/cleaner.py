from typing import List, Dict, Any

class DataCleaner:
    """
    Data Cleaning engine for APIx.
    Filters out impossible or corrupt airfare records (e.g. negative fares, extreme outliers).
    """
    MIN_DOMESTIC_FARE = 1000.0   # INR
    MAX_DOMESTIC_FARE = 60000.0  # INR

    def clean_observations(self, raw_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        cleaned = []
        for rec in raw_records:
            fare = rec.get("fare", 0)
            if self.MIN_DOMESTIC_FARE <= fare <= self.MAX_DOMESTIC_FARE:
                rec["is_clean"] = True
                cleaned.append(rec)
            else:
                rec["is_clean"] = False
        return cleaned
