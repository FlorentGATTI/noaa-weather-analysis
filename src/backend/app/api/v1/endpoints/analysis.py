from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List
from datetime import datetime
from app.schemas.analysis import WeatherAnalysis, SeasonalAnalysis
from app.services.analysis_service import AnalysisService
from app.services.auth import get_current_user

router = APIRouter()
analysis_service = AnalysisService()

@router.get("/statistics/{location}", response_model=WeatherAnalysis)
async def get_weather_statistics(
    location: str,
    year: int = Query(..., description="Année d'analyse"),
    current_user = Depends(get_current_user)
):
    return await analysis_service.get_weather_statistics(location, year)

@router.get("/seasonal/{location}", response_model=List[SeasonalAnalysis])
async def get_seasonal_analysis(
    location: str,
    year: int = Query(..., description="Année d'analyse"),
    current_user = Depends(get_current_user)
):
    return await analysis_service.get_seasonal_analysis(location, year)

@router.get("/trends/{location}")
async def get_weather_trends(
    location: str,
    start_date: str = Query(..., description="Format: YYYY-MM-DD"),
    end_date: str = Query(..., description="Format: YYYY-MM-DD"),
    current_user = Depends(get_current_user)
):
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        return await analysis_service.get_weather_trends(location, start, end)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Format de date invalide"
        )
