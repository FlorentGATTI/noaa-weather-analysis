# NOAA Weather Analysis Project

Projet d'analyse de données météorologiques Big Data utilisant l'écosystème Hadoop avec des données de la NOAA.

## 📋 Description

Ce projet vise à créer une plateforme d'analyse de données météorologiques pour prévoir les tendances climatiques et aider les agriculteurs à optimiser leurs récoltes. Il utilise l'écosystème Hadoop pour le traitement des données et ElasticSearch pour la recherche avancée.

## 📁 Structure du projet

```
noaa-weather-analysis/
├── backup/                # Service de backup automatisé
├── config/               # Fichiers de configuration
│   ├── .env             # Variables d'environnement
│   └── hadoop.env       # Configuration Hadoop
├── data/
│   ├── raw/             # Données brutes de la NOAA
│   │   ├── gsod/       # Global Surface Summary of the Day
│   │   ├── isd/        # Integrated Surface Database
│   │   └── storm_events/ # Storm Events Database
│   └── processed/       # Données traitées
├── datanode/            # Configuration DataNode
├── deploy/              # Scripts de déploiement
├── docs/
│   ├── architecture/    # Documentation architecture
│   ├── api/            # Documentation API
│   └── security/       # Documentation sécurité
├── hbase/              # Configuration HBase
├── namenode/           # Configuration NameNode
├── prometheus/         # Monitoring Prometheus
├── scripts/
│   └── data_ingestion/ # Scripts d'importation
├── security/
│   ├── elastic-certificates/  # Certificats SSL Elasticsearch
│   └── kerberos/      # Configuration Kerberos
├── spark/             # Configuration Spark
└── src/
    ├── backend/       # API FastAPI
    └── frontend/      # Application React
```

## 🛠 Technologies utilisées

- **Big Data**
  - Hadoop 3.x
  - HDFS
  - YARN
  - HBase
  - Apache Spark
- **Recherche et Stockage**
  - ElasticSearch 8.12.2
  - PostgreSQL 15
- **Backend**
  - FastAPI
  - Python 3.11+
- **Frontend**
  - React.js avec TypeScript
  - TailwindCSS
- **Monitoring**
  - Prometheus
  - Grafana
- **Conteneurisation**
  - Docker
  - Docker Compose
- **Sécurité**
  - Kerberos
  - SSL/TLS
  - JWT Authentication

## ⚙️ Prérequis

- Docker et Docker Compose
- Python 3.11+
- Node.js 16+
- Git
- 16GB RAM minimum
- 50GB espace disque minimum

## 📥 Installation

1. Cloner le repository

```bash
git clone git@github.com:FlorentGATTI/noaa-weather-analysis.git
cd noaa-weather-analysis
```

2. Configurer l'environnement

```bash
# Copier et configurer le fichier .env
cp config/.env.example config/.env

# Générer les certificats SSL pour Elasticsearch
cd security/elastic-certificates
./generate-certificates.sh
```

3. Démarrer les services

```bash
docker-compose up -d
```

## 🔧 Configuration

### Services et ports

- **Hadoop**
  - NameNode UI: http://localhost:9870
  - HDFS: port 9000
  - YARN ResourceManager: port 8088
- **Spark**
  - Master UI: http://localhost:8080
  - Worker UI: port 8081
  - Application UI: port 4040
- **HBase**
  - Master UI: http://localhost:16010
- **ElasticSearch**
  - API: https://localhost:9200
- **Application**
  - Frontend: http://localhost:3000
  - Backend API: http://localhost:8000
- **Monitoring**
  - Grafana: http://localhost:3001
  - Prometheus: http://localhost:9090

## 📊 Sources de données NOAA

### Données structurées

1. GSOD (Global Surface Summary of the Day)
   - Source: https://www.ncei.noaa.gov/data/global-summary-of-the-day/access/
   - Période: 2019-2023
2. ISD (Integrated Surface Database)
   - Source: https://www.ncei.noaa.gov/products/land-based-station/integrated-surface-database
   - Période: 2019-2023

### Données non structurées

- Storm Events Database
  - Source: https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/
  - Période: 2019-2023

## 🔒 Sécurité

- Authentification Kerberos pour Hadoop
- SSL/TLS pour Elasticsearch
- JWT pour l'authentification API
- Backup automatisé avec chiffrement
- Monitoring et alertes avec Prometheus/Grafana

## 🔄 Maintenance

### Sauvegardes

Les sauvegardes sont automatisées via le service backup-service:

- Fréquence: Quotidienne
- Rétention: 7 jours
- Chiffrement: AES-256

### Monitoring

- Tableaux de bord Grafana pour:
  - Métriques Hadoop
  - Performance Elasticsearch
  - Métriques applicatives
  - Alertes de sécurité

## 👨‍💻 Contributeurs

- Florent GATTI

## 📝 Licence

Ce projet est sous licence MIT.
