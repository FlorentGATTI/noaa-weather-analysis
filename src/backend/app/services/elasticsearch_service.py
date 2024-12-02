from elasticsearch import Elasticsearch
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.core.config import settings
import logging

class ElasticsearchService:
    def __init__(self):
        self.es = None
        self.is_connected = False
        self._connect()

    def _connect(self):
        """Établit une connexion à Elasticsearch avec fallback"""
        if not self.is_connected:
            try:
                self.es = Elasticsearch(
                    f"http://{settings.ELASTICSEARCH_HOST}:{settings.ELASTICSEARCH_PORT}",
                    retry_on_timeout=True,
                    max_retries=3
                )
                self.is_connected = True
                self._create_indices()
            except Exception as e:
                logging.warning(f"ES non disponible - mode fallback activé: {str(e)}")
                self.is_connected = False

    def _create_indices(self):
        """Crée ou met à jour les indices"""
        try:
            # Index pour les données météo quotidiennes
            weather_mapping = {
                "mappings": {
                    "properties": {
                        "station_id": {"type": "keyword"},
                        "location": {"type": "keyword"},
                        "timestamp": {"type": "date"},
                        "temperature": {"type": "float"},
                        "temperature_max": {"type": "float"},
                        "temperature_min": {"type": "float"},
                        "humidity": {"type": "float"},
                        "precipitation": {"type": "float"},
                        "wind_speed": {"type": "float"},
                        "wind_direction": {"type": "integer"}
                    }
                }
            }

            # Index pour les événements météo extrêmes
            events_mapping = {
                "mappings": {
                    "properties": {
                        "event_id": {"type": "keyword"},
                        "event_type": {"type": "keyword"},
                        "location": {"type": "keyword"},
                        "date": {"type": "date"},
                        "description": {"type": "text"},
                        "damage_estimate": {"type": "float"},
                        "injuries": {"type": "integer"},
                        "fatalities": {"type": "integer"}
                    }
                }
            }

            if not self.es.indices.exists(index="weather_data"):
                self.es.indices.create(index="weather_data", body=weather_mapping)

            if not self.es.indices.exists(index="weather_events"):
                self.es.indices.create(index="weather_events", body=events_mapping)

        except Exception as e:
            logging.error(f"Erreur création indices: {str(e)}")

    async def index_weather_data(self, data: Dict[str, Any]):
        """Indexe les données météo"""
        if not self.is_connected:
            return False

        try:
            self.es.index(index="weather_data", document=data)
            return True
        except Exception as e:
            logging.error(f"Erreur indexation données météo: {str(e)}")
            return False

    async def index_weather_event(self, event: Dict[str, Any]):
        """Indexe un événement météo"""
        if not self.is_connected:
            return False

        try:
            self.es.index(index="weather_events", document=event)
            return True
        except Exception as e:
            logging.error(f"Erreur indexation événement: {str(e)}")
            return False

    async def search_weather_data(
        self,
        location: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        min_temp: Optional[float] = None,
        max_temp: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """Recherche de données météo avec filtres"""
        if not self.is_connected:
            return []

        query = {"bool": {"must": []}}

        if location:
            query["bool"]["must"].append({"term": {"location": location}})

        date_range = {}
        if start_date:
            date_range["gte"] = start_date.isoformat()
        if end_date:
            date_range["lte"] = end_date.isoformat()
        if date_range:
            query["bool"]["must"].append({"range": {"timestamp": date_range}})

        if min_temp is not None or max_temp is not None:
            temp_range = {}
            if min_temp is not None:
                temp_range["gte"] = min_temp
            if max_temp is not None:
                temp_range["lte"] = max_temp
            query["bool"]["must"].append({"range": {"temperature": temp_range}})

        try:
            result = self.es.search(
                index="weather_data",
                body={
                    "query": query,
                    "size": 100,
                    "sort": [{"timestamp": "desc"}]
                }
            )
            return [hit["_source"] for hit in result["hits"]["hits"]]
        except Exception as e:
            logging.error(f"Erreur recherche données: {str(e)}")
            return []

    async def search_weather_events(
        self,
        event_type: Optional[str] = None,
        location: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """Recherche d'événements météo"""
        if not self.is_connected:
            return []

        query = {"bool": {"must": []}}

        if event_type:
            query["bool"]["must"].append({"term": {"event_type": event_type}})

        if location:
            query["bool"]["must"].append({"term": {"location": location}})

        date_range = {}
        if start_date:
            date_range["gte"] = start_date.isoformat()
        if end_date:
            date_range["lte"] = end_date.isoformat()
        if date_range:
            query["bool"]["must"].append({"range": {"date": date_range}})

        try:
            result = self.es.search(
                index="weather_events",
                body={
                    "query": query,
                    "size": 100,
                    "sort": [{"date": "desc"}]
                }
            )
            return [hit["_source"] for hit in result["hits"]["hits"]]
        except Exception as e:
            logging.error(f"Erreur recherche événements: {str(e)}")
            return []

    async def get_location_statistics(self, location: str) -> Dict[str, Any]:
        """Obtient des statistiques pour une location"""
        if not self.is_connected:
            return {}

        try:
            result = self.es.search(
                index="weather_data",
                body={
                    "query": {"term": {"location": location}},
                    "aggs": {
                        "avg_temp": {"avg": {"field": "temperature"}},
                        "max_temp": {"max": {"field": "temperature_max"}},
                        "min_temp": {"min": {"field": "temperature_min"}},
                        "avg_humidity": {"avg": {"field": "humidity"}},
                        "total_precipitation": {"sum": {"field": "precipitation"}}
                    }
                }
            )
            return result["aggregations"]
        except Exception as e:
            logging.error(f"Erreur statistiques location: {str(e)}")
            return {}
