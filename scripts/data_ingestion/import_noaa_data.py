import pandas as pd
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, Any
from app.services.elasticsearch_service import ElasticsearchService
from app.services.hadoop_service import HadoopService

logging.basicConfig(level=logging.INFO)

class NOAADataImporter:
    def __init__(self, data_path: str = "data/raw"):
        self.data_path = Path(data_path)
        self.es_service = ElasticsearchService()
        self.hadoop_service = HadoopService()

    async def import_gsod_data(self):
        for year_dir in (self.data_path / "gsod").glob("*"):
            for file in year_dir.glob("*.csv"):
                df = pd.read_csv(file)
                for _, row in df.iterrows():
                    try:
                        weather_data = {
                            "station_id": row["STATION"],
                            "date": datetime.strptime(str(row["DATE"]), "%Y%m%d"),
                            "temperature": row["TEMP"],
                            "temperature_max": row["MAX"],
                            "temperature_min": row["MIN"],
                            "precipitation": row["PRCP"],
                            "wind_speed": row["WDSP"],
                            "wind_direction": row["WDIR"]
                        }
                        await self._store_data(weather_data, "weather_data")
                    except Exception as e:
                        logging.error(f"Erreur import GSOD {file}: {e}")

    async def import_isd_data(self):
        for year_dir in (self.data_path / "isd").glob("*"):
            for file in year_dir.glob("*.csv"):
                df = pd.read_csv(file)
                for _, row in df.iterrows():
                    try:
                        weather_data = {
                            "station_id": row["STATION"],
                            "date": datetime.strptime(str(row["DATE"]), "%Y%m%d%H%M"),
                            "temperature": row["TMP"],
                            "humidity": row["RH"],
                            "pressure": row["SLP"],
                            "wind_speed": row["WND"],
                        }
                        await self._store_data(weather_data, "weather_data")
                    except Exception as e:
                        logging.error(f"Erreur import ISD {file}: {e}")

    async def import_storm_events(self):
        for file in (self.data_path / "storm_events").glob("*.csv"):
            df = pd.read_csv(file)
            for _, row in df.iterrows():
                try:
                    event_data = {
                        "event_id": str(row["EVENT_ID"]),
                        "event_type": row["EVENT_TYPE"],
                        "date": datetime.strptime(str(row["BEGIN_DATE_TIME"]), "%Y-%m-%d %H:%M:%S"),
                        "location": f"{row['STATE']}-{row['CZ_NAME']}",
                        "damage_estimate": self._parse_damage(row["DAMAGE_PROPERTY"]),
                        "injuries": row["INJURIES_DIRECT"],
                        "fatalities": row["DEATHS_DIRECT"],
                        "description": row["EPISODE_NARRATIVE"]
                    }
                    await self._store_data(event_data, "weather_events")
                except Exception as e:
                    logging.error(f"Erreur import Storm Events {file}: {e}")

    async def import_metar_data(self):
        for file in (self.data_path / "metar").glob("*.txt"):
            try:
                with open(file, 'r') as f:
                    metar_data = {
                        "station_id": file.stem,
                        "raw_metar": f.read(),
                        "timestamp": datetime.now()
                    }
                    await self._store_data(metar_data, "metar_data")
            except Exception as e:
                logging.error(f"Erreur import METAR {file}: {e}")

    def _parse_damage(self, damage_str: str) -> float:
        try:
            if pd.isna(damage_str):
                return 0.0
            value = float(damage_str[:-1])
            multiplier = {'K': 1000, 'M': 1000000, 'B': 1000000000}.get(damage_str[-1], 1)
            return value * multiplier
        except:
            return 0.0

    async def _store_data(self, data: Dict[str, Any], index: str):
        await self.es_service.index_weather_data(data)
        await self.hadoop_service.save_weather_data(data)

async def main():
    importer = NOAADataImporter()
    await importer.import_gsod_data()
    await importer.import_isd_data()
    await importer.import_storm_events()
    await importer.import_metar_data()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
