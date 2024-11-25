#!/bin/bash
set -e

# Fonction pour attendre un service
wait_for_service() {
    local host=$1
    local port=$2
    local service=$3

    echo "Waiting for $service to be ready at $host:$port..."
    while ! nc -z $host $port; do
        echo "Waiting for $service..."
        sleep 2
    done
    echo "$service is ready!"
}

echo "Starting service dependencies check..."

# Attente des services requis
wait_for_service elasticsearch 9200 "Elasticsearch"
wait_for_service namenode 9000 "Hadoop NameNode"
wait_for_service hive-server 10000 "Hive Server"
wait_for_service mongodb 27017 "MongoDB"
wait_for_service hbase 16000 "HBase"

# Vérification des variables d'environnement requises
required_env_vars=(
    "ELASTICSEARCH_HOST"
    "ELASTICSEARCH_PORT"
    "HADOOP_NAMENODE"
    "HIVE_HOST"
    "HIVE_PORT"
    "MONGODB_URI"
)

for var in "${required_env_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Required environment variable $var is not set"
        exit 1
    fi
done

echo "All services are ready. Starting FastAPI application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
