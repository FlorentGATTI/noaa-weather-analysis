FROM python:3.9-slim

WORKDIR /app

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
  wget \
  curl \
  netcat-openbsd \
  gcc \
  g++ \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

# Copie des requirements et installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie des scripts
COPY scripts/ ./scripts/

# Rendre l'entrypoint exécutable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
