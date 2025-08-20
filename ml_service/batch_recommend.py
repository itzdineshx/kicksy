from __future__ import annotations

import os
import asyncio
from typing import Any, Dict, List

from dotenv import load_dotenv
import httpx

load_dotenv()

ML_API = os.getenv("ML_API_URL", "http://localhost:8000")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("WARNING: SUPABASE_URL or SUPABASE_SERVICE_KEY is not set. The script will print output instead of writing to DB.")


async def recommend_for_event(client: httpx.AsyncClient, event: Dict[str, Any]) -> List[Dict[str, Any]]:
    seat_categories = ["General", "Premium", "VIP", "Corporate Box"]
    league_code = int(event.get("league_code", 1))
    weather_code = int(event.get("weather_code", 1))
    demand_level = event.get("demand_level", "Medium")
    days_before = int(event.get("days_before_match", 14))
    base_price = float(event.get("base_price", 1000.0))
    popular_matchup = bool(event.get("popular_matchup", False))

    recs: List[Dict[str, Any]] = []
    for seat in seat_categories:
        payload = {
            "domain": {
                "league_code": league_code,
                "team_home_code": int(event.get("team_home_code", 1)),
                "team_away_code": int(event.get("team_away_code", 2)),
                "stadium_code": int(event.get("stadium_code", 1)),
                "city_code": int(event.get("city_code", 1)),
                "seat_category": seat,
                "weather_code": weather_code,
                "demand_level": demand_level,
                "days_before_match": days_before,
                "base_price": base_price,
                "popular_matchup": popular_matchup,
            },
            "price_min": 200,
            "price_max": 15000,
            "price_step": 100,
        }
        r = await client.post(f"{ML_API}/recommend/price_from_domain", json=payload, timeout=30)
        r.raise_for_status()
        data = r.json()
        recs.append({
            "seat_type": seat,
            "recommended_price": float(data["recommended_price"]),
            "expected_demand": float(data["expected_demand"]),
            "expected_revenue": float(data["expected_revenue"]),
            "model_name": data.get("model"),
            "features": payload,
        })
    return recs


async def list_upcoming_events(client: httpx.AsyncClient, limit: int = 10) -> List[Dict[str, Any]]:
    # If Supabase is configured, read from events table. Else, return a few mock events
    if SUPABASE_URL and SUPABASE_SERVICE_KEY:
        headers = {"apikey": SUPABASE_SERVICE_KEY, "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"}
        # Naive query for demo: list next events by date
        r = await client.get(f"{SUPABASE_URL}/rest/v1/events?select=*&order=date.asc&limit={limit}", headers=headers, timeout=30)
        r.raise_for_status()
        return r.json()
    # Mock events
    return [
        {"id": f"evt_{i}", "league_code": 1, "team_home_code": i % 10 + 1, "team_away_code": (i+1) % 10 + 1,
         "stadium_code": (i % 10) + 1, "city_code": (i % 10) + 1, "base_price": 1000 + i * 50,
         "days_before_match": 7 + i, "weather_code": 1, "demand_level": "Medium", "popular_matchup": (i % 3 == 0)}
        for i in range(1, limit + 1)
    ]


async def insert_recommendations(client: httpx.AsyncClient, event_id: str, recs: List[Dict[str, Any]]):
    if not (SUPABASE_URL and SUPABASE_SERVICE_KEY):
        print(f"Event {event_id} recommendations: {recs}")
        return
    headers = {"apikey": SUPABASE_SERVICE_KEY, "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}", "Content-Type": "application/json"}
    rows = [{
        "event_id": event_id,
        "seat_type": r["seat_type"],
        "recommended_price": r["recommended_price"],
        "expected_demand": r["expected_demand"],
        "expected_revenue": r["expected_revenue"],
        "model_name": r.get("model_name"),
        "features": r.get("features"),
    } for r in recs]
    r = await client.post(f"{SUPABASE_URL}/rest/v1/pricing_recommendations", headers=headers, json=rows, timeout=30)
    r.raise_for_status()


async def main(limit_events: int = 5):
    async with httpx.AsyncClient() as client:
        events = await list_upcoming_events(client, limit=limit_events)
        for ev in events:
            event_id = ev.get("id") or ev.get("event_id")
            if not event_id:
                continue
            recs = await recommend_for_event(client, ev)
            await insert_recommendations(client, str(event_id), recs)
        print(f"Processed {len(events)} events")


if __name__ == "__main__":
    asyncio.run(main())


