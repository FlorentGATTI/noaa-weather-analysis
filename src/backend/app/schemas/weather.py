from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WeatherBase(BaseModel):
    location: str
    temperature: float
    humidity: Optional[float] = None
    wind_speed: Optional[float] = None
    timestamp: datetime

class WeatherData(WeatherBase):
    station_id: str
    pressure: Optional[float] = None
    precipitation: Optional[float] = None

class WeatherResponse(WeatherBase):
    pass

class WeatherCreate(WeatherBase):
    pass
