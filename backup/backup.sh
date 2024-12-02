#!/bin/bash
set -e

# Configuration
BACKUP_DIR="/backups/$(date +%Y-%m-%d)"
ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"

# Création du répertoire de backup
mkdir -p "$BACKUP_DIR"

# Fonction de backup avec chiffrement
backup_and_encrypt() {
    local source=$1
    local dest=$2
    tar czf - "$source" | openssl enc -aes-256-cbc -pbkdf2 -iter 100000 -salt -k "$ENCRYPTION_KEY" > "$dest"
}

# Backup HDFS
echo "Backing up HDFS..."
backup_and_encrypt "/source/namenode" "$BACKUP_DIR/namenode.tar.gz.enc"

# Backup HBase
echo "Backing up HBase..."
backup_and_encrypt "/source/hbase" "$BACKUP_DIR/hbase.tar.gz.enc"

# Backup PostgreSQL
echo "Backing up PostgreSQL..."
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -h "$POSTGRES_HOST" -U "$POSTGRES_USER" "$POSTGRES_DB" | \
    openssl enc -aes-256-cbc -pbkdf2 -iter 100000 -salt -k "$ENCRYPTION_KEY" > "$BACKUP_DIR/postgres.sql.enc"

# Backup Elasticsearch
echo "Backing up Elasticsearch..."
curl -u "elastic:${ELASTIC_PASSWORD}" -X PUT "http://${ELASTICSEARCH_HOST}:${ELASTICSEARCH_PORT}/_snapshot/backup/snapshot_$(date +%Y%m%d)" \
    -H 'Content-Type: application/json' \
    -d '{"indices": "*", "include_global_state": true}'

# Nettoyage des anciens backups
find /backups -type d -mtime +$RETENTION_DAYS -exec rm -rf {} +

echo "Backup completed successfully!"
