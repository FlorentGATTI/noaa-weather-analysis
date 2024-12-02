#!/bin/bash

# Attendre que PostgreSQL soit disponible
echo "Waiting for PostgreSQL..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
    sleep 1
done

# Attendre qu'Elasticsearch soit disponible
echo "Waiting for Elasticsearch..."
while ! nc -z $ELASTICSEARCH_HOST $ELASTICSEARCH_PORT; do
    sleep 1
done

# Attendre que le NameNode soit disponible
echo "Waiting for Hadoop NameNode..."
while ! nc -z $HADOOP_NAMENODE $HADOOP_NAMENODE_PORT; do
    sleep 1
done

# Lancer les migrations de la base de données (si vous utilisez Alembic)
echo "Running database migrations..."
alembic upgrade head

# Démarrer l'application FastAPI avec uvicorn
echo "Starting FastAPI application..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
