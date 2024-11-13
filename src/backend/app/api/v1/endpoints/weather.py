from fastapi import APIRouter, HTTPException, Query
from typing import List
from datetime import datetime
from app.schemas.weather import WeatherData
from app.services.weather_service import WeatherService

router = APIRouter()
weather_service = WeatherService()

@router.get("/current/{location}", response_model=WeatherData)
async def get_current_weather(location: str):
    return await weather_service.get_current_weather(location)

@router.get("/historical/{location}", response_model=List[WeatherData])
async def get_historical_weather(
    location: str,
    start_date: str = Query(
        ...,
        description="Date de début (format: YYYY-MM-DD)",
        example="2024-01-01"
    ),
    end_date: str = Query(
        ...,
        description="Date de fin (format: YYYY-MM-DD)",
        example="2024-03-13"
    )
):
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")

        return await weather_service.get_historical_weather(
            location=location,
            start_date=start,
            end_date=end
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail="Format de date invalide. Utilisez YYYY-MM-DD (ex: 2024-01-01)"
        )

@router.get("/search", response_model=List[WeatherData])
async def search_weather_events(
    location: str | None = None,
    event_type: str | None = None
):
    return await weather_service.search_weather_events(
        location=location,
        event_type=event_type
    )
