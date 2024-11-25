# src/backend/Dockerfile
FROM python:3.11-slim

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Installation des dépendances système
RUN apt-get update && \
  apt-get install -y --no-cache-dir \
  build-essential \
  curl \
  libsasl2-dev \
  libsasl2-modules \
  python3-dev \
  default-libmysqlclient-dev \
  pkg-config \
  netcat-traditional \
  gcc \
  g++ \
  git \
  libkrb5-dev \
  libssl-dev \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Copie des requirements et installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source
COPY ./src/backend /app
COPY ./scripts/docker/start.sh /start.sh

RUN chmod +x /start.sh

EXPOSE 8000
CMD ["/start.sh"]
