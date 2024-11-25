from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class WeatherStatistics(BaseModel):
    avg_temperature: float
    max_temperature: float
    min_temperature: float
    total_precipitation: float
    avg_humidity: Optional[float] = None
    avg_wind_speed: Optional[float] = None

class SeasonalAnalysis(BaseModel):
    season: str
    avg_temp: float
    avg_precip: float
    max_temp: float
    min_temp: float
    days_count: int

class WeatherTrend(BaseModel):
    date: datetime
    value: float
    trend: float

class WeatherAnalysis(BaseModel):
    location: str
    period_start: datetime
    period_end: datetime
    statistics: WeatherStatistics
    seasonal_data: Optional[List[SeasonalAnalysis]] = None
    trends: Optional[List[WeatherTrend]] = None
