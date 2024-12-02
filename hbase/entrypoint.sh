#!/bin/bash

# Fonction pour attendre qu'un service soit disponible
wait_for_service() {
    local host=$1
    local port=$2
    local service=$3

    echo "Waiting for ${service} (${host}:${port})..."
    while ! nc -z ${host} ${port}; do
        echo "Waiting for ${service}..."
        sleep 2
    done
    echo "${service} is available"
}

# Attendre que ZooKeeper soit disponible
wait_for_service zookeeper 2181 "ZooKeeper"

# Attendre que le NameNode HDFS soit disponible
wait_for_service namenode 9000 "HDFS NameNode"

echo "Starting HBase..."

# Démarrer HBase en premier plan
exec ${HBASE_HOME}/bin/hbase master start
