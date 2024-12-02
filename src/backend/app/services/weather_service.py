from typing import List, Optional
from datetime import datetime
from app.schemas.weather import WeatherData, WeatherCreate
from app.services.elasticsearch_service import ElasticsearchService
from app.services.hadoop_service import HadoopService

class WeatherService:
    def __init__(self):
        self.es_service = ElasticsearchService()
        self.hadoop_service = HadoopService()

    async def get_current_weather(self, location: str) -> WeatherData:
        # Rechercher les données les plus récentes dans Elasticsearch
        results = await self.es_service.search_weather_data(
            location=location,
            start_date=datetime.utcnow().replace(hour=0, minute=0, second=0),
            end_date=datetime.utcnow()
        )

        if results:
            latest = results[0]
            return WeatherData(
                location=latest["location"],
                temperature=latest["temperature"],
                humidity=latest["humidity"],
                wind_speed=latest["wind_speed"],
                station_id=latest["station_id"],
                timestamp=datetime.fromisoformat(latest["timestamp"])
            )

        # Fallback to mock data if no recent data found
        return WeatherData(
            location=location,
            temperature=20.5,
            humidity=65,
            wind_speed=10.2,
            station_id="STATION001",
            timestamp=datetime.utcnow()
        )

    async def get_historical_weather(
        self,
        location: str,
        start_date: datetime,
        end_date: datetime
    ) -> List[WeatherData]:
        # Récupérer les statistiques de Hadoop
        stats = await self.hadoop_service.get_weather_stats(
            start_date=start_date,
            end_date=end_date,
            location=location
        )

        # Récupérer les données détaillées d'Elasticsearch
        results = await self.es_service.search_weather_data(
            location=location,
            start_date=start_date,
            end_date=end_date
        )

        if results:
            return [
                WeatherData(
                    location=data["location"],
                    temperature=data["temperature"],
                    humidity=data["humidity"],
                    wind_speed=data["wind_speed"],
                    station_id=data["station_id"],
                    timestamp=datetime.fromisoformat(data["timestamp"])
                )
                for data in results
            ]

        # Fallback to mock data if no data found
        return [
            WeatherData(
                location=location,
                temperature=19.5 + i,
                humidity=60 + i,
                wind_speed=8.0 + i,
                station_id=f"STATION00{i}",
                timestamp=datetime.utcnow()
            )
            for i in range(5)
        ]

    async def search_weather_events(
        self,
        location: Optional[str] = None,
        event_type: Optional[str] = None
    ) -> List[WeatherData]:
        # Rechercher les événements dans Elasticsearch
        events = await self.es_service.search_storm_events(
            location=location,
            event_type=event_type
        )

        if events:
            return [
                WeatherData(
                    location=event["location"],
                    temperature=event.get("temperature", 0.0),
                    humidity=event.get("humidity", 0.0),
                    wind_speed=event.get("wind_speed", 0.0),
                    station_id=event.get("station_id", "UNKNOWN"),
                    timestamp=datetime.fromisoformat(event["date"]),
                    event_type=event.get("event_type"),
                    description=event.get("description")
                )
                for event in events
            ]

        # Fallback to mock data if no events found
        return [
            WeatherData(
                location=location or "Paris",
                temperature=20.5,
                humidity=65,
                wind_speed=10.2,
                station_id="STATION001",
                timestamp=datetime.utcnow(),
                event_type=event_type or "NORMAL",
                description="No specific weather events found"
            )
        ]

    async def analyze_seasonal_patterns(
        self,
        location: str,
        year: int
    ) -> dict:
        """Analyse les tendances saisonnières"""
        seasonal_data = await self.hadoop_service.get_seasonal_analysis(year, location)

        # Enrichir les données avec des informations supplémentaires d'Elasticsearch
        for season in seasonal_data:
            events = await self.es_service.search_storm_events(
                location=location,
                start_date=datetime(year, 1, 1),
                end_date=datetime(year, 12, 31)
            )
            season["significant_events"] = len(events)

        return {
            "seasonal_analysis": seasonal_data,
            "year": year,
            "location": location
        }

    async def get_location_summary(
        self,
        location: str,
        start_date: datetime,
        end_date: datetime
    ) -> dict:
        """Obtient un résumé complet pour une localisation"""
        # Statistiques de base depuis Hadoop
        stats = await self.hadoop_service.get_weather_stats(
            start_date=start_date,
            end_date=end_date,
            location=location
        )

        # Événements significatifs depuis Elasticsearch
        events = await self.es_service.search_storm_events(
            location=location,
            start_date=start_date,
            end_date=end_date
        )

        return {
            "location": location,
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "statistics": stats,
            "significant_events": len(events),
            "recent_events": events[:5]  # 5 événements les plus récents
        }

    async def save_weather_data(self, data: WeatherCreate):
        """Sauvegarde les données météo dans Hadoop et Elasticsearch"""
        # Préparer les données pour Hadoop
        hadoop_data = {
            "station_id": data.station_id,
            "date": data.timestamp.date(),
            "temperature": data.temperature,
            "humidity": data.humidity,
            "wind_speed": data.wind_speed,
            "precipitation": data.precipitation if hasattr(data, 'precipitation') else 0.0,
            "wind_direction": data.wind_direction if hasattr(data, 'wind_direction') else None
        }

        # Sauvegarder dans Hadoop
        await self.hadoop_service.save_weather_data(
            hadoop_data,
            data.timestamp.year
        )

        # Sauvegarder dans Elasticsearch pour la recherche rapide
        es_data = data.dict()
        await self.es_service.index_weather_data(es_data)
