from typing import List, Dict, Any

class DataDeduplicator:
    """
    Data Deduplicator for APIx.
    Merges multi-OTA duplicate observations for the same flight instance.
    """
    def deduplicate(self, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        seen = {}
        for rec in records:
            key = f"{rec['flight_number']}_{rec['departure_time']}_{rec['booking_window']}"
            if key not in seen:
                seen[key] = rec
            else:
                # Keep lower fare if duplicate across OTAs (most accurate consumer price)
                if rec['fare'] < seen[key]['fare']:
                    seen[key] = rec
        return list(seen.values())
