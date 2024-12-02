"""
Package d'ingestion des données NOAA
Ce module contient les scripts pour le téléchargement et l'importation des données météorologiques
"""

from pathlib import Path

# Définition des chemins importants
DATA_DIR = Path("/data")
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# Création des répertoires nécessaires
RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)

# Version du package
__version__ = "1.0.0"
