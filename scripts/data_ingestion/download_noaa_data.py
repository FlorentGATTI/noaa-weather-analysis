import os
import requests
import gzip
import shutil
from datetime import datetime
from pathlib import Path
import logging
from concurrent.futures import ThreadPoolExecutor
from typing import List, Tuple

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('download_noaa.log'),
        logging.StreamHandler()
    ]
)

class NOAADataDownloader:
    def __init__(self, base_path: str = "data/raw"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
        
    def download_gsod_data(self, start_year: int, end_year: int):
        """Télécharge les données GSOD pour la période spécifiée"""
        base_url = "https://www.ncei.noaa.gov/data/global-summary-of-the-day/access"
        output_dir = self.base_path / "gsod"
        output_dir.mkdir(exist_ok=True)

        for year in range(start_year, end_year + 1):
            year_dir = output_dir / str(year)
            year_dir.mkdir(exist_ok=True)
            
            url = f"{base_url}/{year}"
            logging.info(f"Téléchargement des données GSOD pour {year}")
            
            try:
                response = requests.get(url)
                if response.status_code == 200:
                    output_file = year_dir / f"gsod_{year}.tar.gz"
                    with open(output_file, 'wb') as f:
                        f.write(response.content)
                    logging.info(f"Données GSOD {year} téléchargées avec succès")
                else:
                    logging.error(f"Erreur lors du téléchargement des données GSOD {year}")