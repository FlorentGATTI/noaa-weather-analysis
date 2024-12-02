FROM python:3.11-slim

WORKDIR /app

# Installation des dépendances système
RUN apt-get update && \
  apt-get install -y \
  build-essential \
  curl \
  libsasl2-dev \
  netcat-openbsd \
  && rm -rf /var/lib/apt/lists/*

# Copie et installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source
COPY app ./app
COPY alembic ./alembic
COPY alembic.ini .

# Copie du script de démarrage
COPY scripts/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
