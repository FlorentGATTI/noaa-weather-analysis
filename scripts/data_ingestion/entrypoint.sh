#!/bin/bash

# Fonction pour vérifier la disponibilité des services
wait_for_service() {
    local host=$1
    local port=$2
    echo "Waiting for $host:$port..."
    while ! nc -z $host $port; do
        echo "Waiting for $host:$port..."
        sleep 2
    done
}

# Attendre que les services soient disponibles
wait_for_service namenode 9000
wait_for_service spark-master 7077
wait_for_service elasticsearch 9200
wait_for_service hbase 16010

echo "Starting data ingestion process..."

# Téléchargement des données
python /app/scripts/download_noaa_data.py

# Import des données
python /app/scripts/import_noaa_data.py

# Garder le conteneur en vie pour debug si nécessaire
tail -f /dev/null
