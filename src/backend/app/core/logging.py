import logging
import sys
from pathlib import Path
from datetime import datetime
from app.core.config import settings

# Créer le dossier logs s'il n'existe pas
logs_dir = Path("logs")
logs_dir.mkdir(exist_ok=True)

# Configurer le format de logging
log_format = logging.Formatter(settings.LOG_FORMAT)


def setup_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, settings.LOG_LEVEL))

    # Handler pour la console
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(log_format)
    logger.addHandler(console_handler)

    # Handler pour le fichier
    log_file = logs_dir / f"{datetime.now().strftime('%Y-%m-%d')}.log"
    file_handler = logging.FileHandler(log_file)
    file_handler.setFormatter(log_format)
    logger.addHandler(file_handler)

    return logger


# Logger principal de l'application
logger = setup_logger("noaa_weather")
