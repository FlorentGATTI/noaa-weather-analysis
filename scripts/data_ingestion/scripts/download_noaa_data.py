import requests
import gzip
import logging
import os
from pathlib import Path
import pandas as pd
from tqdm import tqdm
from typing import List, Optional
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("/data/download_noaa.log"), logging.StreamHandler()],
)


class NOAADataDownloader:
    FRENCH_STATIONS = [
        "071560-99999",  # Paris-Orly
        "071570-99999",  # Paris-Le Bourget
        "076450-99999",  # Lyon
        "076660-99999",  # Marseille
        "073730-99999",  # Toulouse
        "073840-99999",  # Bordeaux
        "071100-99999",  # Lille
        "073860-99999",  # Nantes
        "074810-99999",  # Nice
    ]

    def __init__(self, base_path: str = "/data/raw"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
        # Récupérer les années depuis les variables d'environnement
        self.start_year = int(os.getenv("NOAA_START_YEAR", "2019"))
        self.end_year = int(os.getenv("NOAA_END_YEAR", "2023"))

    def _download_file_with_progress(self, url: str, output_file: Path) -> bool:
        try:
            response = requests.get(url, stream=True)
            response.raise_for_status()
            total_size = int(response.headers.get("content-length", 0))

            with tqdm(
                total=total_size, unit="B", unit_scale=True, desc=output_file.name
            ) as pbar:
                with open(output_file, "wb") as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                            pbar.update(len(chunk))
            return True
        except Exception as e:
            logging.error(f"Erreur téléchargement {url}: {str(e)}")
            return False

    def download_gsod_data(self, start_year: int, end_year: int):
        """Télécharge les données GSOD"""
        base_url = "https://www.ncei.noaa.gov/data/global-summary-of-the-day/access"
        output_dir = self.base_path / "gsod"
        output_dir.mkdir(exist_ok=True)

        for year in range(start_year, end_year + 1):
            year_dir = output_dir / str(year)
            year_dir.mkdir(exist_ok=True)

            for station in self.FRENCH_STATIONS:
                url = f"{base_url}/{year}/{station}-{year}.csv"
                output_file = year_dir / f"{station}-{year}.csv"

                if self._download_file_with_progress(url, output_file):
                    logging.info(f"Données GSOD {station} {year} téléchargées")

    def download_isd_data(self, start_year: int, end_year: int):
        """Télécharge les données ISD"""
        base_url = "https://www.ncei.noaa.gov/data/integrated-surface-database/access"
        output_dir = self.base_path / "isd"
        output_dir.mkdir(exist_ok=True)

        for year in range(start_year, end_year + 1):
            year_dir = output_dir / str(year)
            year_dir.mkdir(exist_ok=True)

            for station in self.FRENCH_STATIONS:
                url = f"{base_url}/{year}/{station}-{year}.csv"
                output_file = year_dir / f"{station}-{year}.csv"

                if self._download_file_with_progress(url, output_file):
                    logging.info(f"Données ISD {station} {year} téléchargées")

    def download_storm_events(self, start_year: int, end_year: int):
        """Télécharge les données Storm Events"""
        base_url = "https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles"
        output_dir = self.base_path / "storm_events"
        output_dir.mkdir(exist_ok=True)

        for year in range(start_year, end_year + 1):
            for data_type in ["details", "fatalities", "locations"]:
                filename = f"StormEvents_{data_type}-ftp_v1.0_{year}.csv.gz"
                url = f"{base_url}/{filename}"
                output_file = output_dir / filename

                if self._download_file_with_progress(url, output_file):
                    try:
                        with gzip.open(output_file, "rb") as f_in:
                            df = pd.read_csv(f_in)
                            if "DAMAGE_PROPERTY" in df.columns:
                                df = df[df["DAMAGE_PROPERTY"].notna()]
                            output_csv = output_file.with_suffix(".csv")
                            df.to_csv(output_csv, index=False)
                        output_file.unlink()
                        logging.info(
                            f"Données Storm Events {data_type} {year} traitées"
                        )
                    except Exception as e:
                        logging.error(f"Erreur traitement {filename}: {str(e)}")

    def download_metar_data(self, stations: Optional[List[str]] = None):
        """Télécharge les données METAR"""
        stations = stations or self.FRENCH_STATIONS
        base_url = "https://tgftp.nws.noaa.gov/data/observations/metar/stations"
        output_dir = self.base_path / "metar"
        output_dir.mkdir(exist_ok=True)

        for station in stations:
            station_id = station.split("-")[0]  # Remove the -99999 suffix
            url = f"{base_url}/{station_id}.TXT"
            output_file = output_dir / f"{station_id}.txt"

            if self._download_file_with_progress(url, output_file):
                logging.info(f"Données METAR {station_id} téléchargées")

    def verify_data(self):
        """Vérifie l'intégrité et la taille des données"""
        total_size = 0
        for data_type in ["gsod", "isd", "storm_events", "metar"]:
            data_dir = self.base_path / data_type
            if not data_dir.exists():
                logging.error(f"Dossier {data_type} manquant")
                continue

            size = sum(f.stat().st_size for f in data_dir.rglob("*") if f.is_file())
            size_gb = size / (2**30)
            total_size += size
            logging.info(f"Taille {data_type}: {size_gb:.2f}GB")

        total_size_gb = total_size / (2**30)
        logging.info(f"Taille totale des données: {total_size_gb:.2f}GB")

        if total_size_gb > 10:
            logging.warning("⚠️ Les données dépassent la limite de 10GB recommandée")

        # Vérification HDFS
        try:
            from hdfs import InsecureClient

            hdfs_client = InsecureClient(
                f'http://{os.getenv("HADOOP_NAMENODE", "namenode")}:9870'
            )
            hdfs_client.makedirs("/data/raw")
            logging.info("Connexion HDFS établie")
        except Exception as e:
            logging.error(f"Erreur connexion HDFS: {str(e)}")


def main():
    logging.info("Démarrage du téléchargement des données NOAA")
    downloader = NOAADataDownloader()

    try:
        # Téléchargement des données
        logging.info(
            f"Téléchargement des données de {downloader.start_year} à {downloader.end_year}"
        )
        downloader.download_gsod_data(downloader.start_year, downloader.end_year)
        downloader.download_isd_data(downloader.start_year, downloader.end_year)
        downloader.download_storm_events(downloader.start_year, downloader.end_year)
        downloader.download_metar_data()

        # Vérification des données
        downloader.verify_data()
        logging.info("✅ Téléchargement terminé avec succès")

    except KeyboardInterrupt:
        logging.warning("⚠️ Téléchargement interrompu par l'utilisateur")
    except Exception as e:
        logging.error(f"❌ Erreur critique: {str(e)}")
        raise


if __name__ == "__main__":
    main()
