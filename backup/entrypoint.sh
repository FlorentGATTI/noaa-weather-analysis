#!/bin/bash

echo "Waiting for Elasticsearch to be ready..."
until curl -s "http://${ELASTICSEARCH_HOST}:${ELASTICSEARCH_PORT}" > /dev/null; do
    sleep 5
done

echo "Waiting for PostgreSQL to be ready..."
until PGPASSWORD="${POSTGRES_PASSWORD}" pg_isready -h "${POSTGRES_HOST}" -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"; do
    sleep 5
done

echo "Starting backup service..."
exec "$@"
