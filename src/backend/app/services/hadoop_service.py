from typing import List, Dict, Any, Optional
from datetime import datetime
from pyhive import hive
import pandas as pd
import logging
from app.core.config import settings

class HadoopService:
    def __init__(self):
        self.hive_connection = None
        self.is_connected = False
        self._connect()

    def _connect(self):
        """Établit une connexion à Hive avec fallback"""
        if not self.is_connected:
            try:
                self.hive_connection = hive.Connection(
                    host=settings.HIVE_HOST,
                    port=settings.HIVE_PORT,
                    username=settings.HIVE_USER,
                    database='default',
                    auth='NONE'  # Pour le développement
                )
                self.is_connected = True
                self._create_tables()
            except Exception as e:
                logging.warning(f"Hive non disponible - mode fallback activé: {str(e)}")
                self.is_connected = False

    def _create_tables(self):
        """Crée les tables Hive nécessaires"""
        if not self.is_connected:
            return

        queries = [
            """
            CREATE DATABASE IF NOT EXISTS noaa_weather
            """,
            """
            CREATE TABLE IF NOT EXISTS noaa_weather.daily_observations (
                station_id STRING,
                date DATE,
                temperature FLOAT,
                temperature_max FLOAT,
                temperature_min FLOAT,
                precipitation FLOAT,
                snow_depth FLOAT,
                wind_speed FLOAT,
                wind_direction INT
            )
            PARTITIONED BY (year INT, month INT)
            STORED AS PARQUET
            """,
            """
            CREATE TABLE IF NOT EXISTS noaa_weather.storm_events (
                event_id STRING,
                event_type STRING,
                location STRING,
                date DATE,
                magnitude FLOAT,
                damage_estimate FLOAT,
                injuries INT,
                fatalities INT,
                description STRING
            )
            PARTITIONED BY (year INT)
            STORED AS PARQUET
            """
        ]

        try:
            cursor = self.hive_connection.cursor()
            for query in queries:
                cursor.execute(query)
        except Exception as e:
            logging.error(f"Erreur création tables: {str(e)}")
        finally:
            cursor.close()

    async def save_weather_data(self, data: Dict[str, Any]):
        """Sauvegarde des données météo dans Hive"""
        if not self.is_connected:
            return False

        try:
            cursor = self.hive_connection.cursor()
            date = datetime.strptime(data["date"], "%Y-%m-%d")

            insert_query = """
            INSERT INTO TABLE noaa_weather.daily_observations
            PARTITION (year=%s, month=%s)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            cursor.execute(insert_query, (
                date.year,
                date.month,
                data["station_id"],
                data["date"],
                data["temperature"],
                data.get("temperature_max", data["temperature"]),
                data.get("temperature_min", data["temperature"]),
                data.get("precipitation", 0.0),
                data.get("snow_depth", 0.0),
                data.get("wind_speed", 0.0),
                data.get("wind_direction", 0)
            ))
            return True
        except Exception as e:
            logging.error(f"Erreur sauvegarde données: {str(e)}")
            return False
        finally:
            cursor.close()

    async def get_weather_stats(
        self,
        start_date: datetime,
        end_date: datetime,
        location: Optional[str] = None
    ) -> Dict[str, Any]:
        """Récupère des statistiques météo de Hive"""
        if not self.is_connected:
            return {}

        query = """
        SELECT
            AVG(temperature) as avg_temp,
            MAX(temperature_max) as max_temp,
            MIN(temperature_min) as min_temp,
            SUM(precipitation) as total_precip,
            AVG(wind_speed) as avg_wind
        FROM noaa_weather.daily_observations
        WHERE date BETWEEN %s AND %s
        """

        if location:
            query += " AND station_id = %s"

        try:
            cursor = self.hive_connection.cursor()
            params = [start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d")]
            if location:
                params.append(location)

            cursor.execute(query, params)
            result = cursor.fetchone()

            return {
                "average_temperature": result[0],
                "maximum_temperature": result[1],
                "minimum_temperature": result[2],
                "total_precipitation": result[3],
                "average_wind_speed": result[4]
            }
        except Exception as e:
            logging.error(f"Erreur récupération stats: {str(e)}")
            return {}
        finally:
            cursor.close()

    async def get_seasonal_analysis(
        self,
        location: str,
        year: int
    ) -> List[Dict[str, Any]]:
        """Analyse saisonnière des données météo"""
        if not self.is_connected:
            return []

        query = """
        SELECT
            CASE
                WHEN month IN (12,1,2) THEN 'Winter'
                WHEN month IN (3,4,5) THEN 'Spring'
                WHEN month IN (6,7,8) THEN 'Summer'
                ELSE 'Fall'
            END as season,
            AVG(temperature) as avg_temp,
            AVG(precipitation) as avg_precip,
            MAX(temperature_max) as max_temp,
            MIN(temperature_min) as min_temp,
            COUNT(*) as days_count
        FROM noaa_weather.daily_observations
        WHERE year = %s AND station_id = %s
        GROUP BY
            CASE
                WHEN month IN (12,1,2) THEN 'Winter'
                WHEN month IN (3,4,5) THEN 'Spring'
                WHEN month IN (6,7,8) THEN 'Summer'
                ELSE 'Fall'
            END
        """

        try:
            cursor = self.hive_connection.cursor()
            cursor.execute(query, (year, location))
            columns = [desc[0] for desc in cursor.description]

            return [dict(zip(columns, row)) for row in cursor.fetchall()]
        except Exception as e:
            logging.error(f"Erreur analyse saisonnière: {str(e)}")
            return []
        finally:
            cursor.close()
