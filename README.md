# NOAA Weather Analysis Project

Projet d'analyse de données météorologiques Big Data utilisant l'écosystème Hadoop avec des données de la NOAA.

## 📋 Description
Ce projet vise à créer une plateforme d'analyse de données météorologiques pour prévoir les tendances climatiques et aider les agriculteurs à optimiser leurs récoltes. Il utilise l'écosystème Hadoop pour le traitement des données et ElasticSearch pour la recherche avancée.

## 📁 Structure du projet
```
noaa-weather-analysis/
├── data/
│   ├── raw/              # Données brutes de la NOAA
│   │   ├── gsod/        # Global Surface Summary of the Day
│   │   ├── isd/         # Integrated Surface Database
│   │   └── storm_events/ # Storm Events Database
│   └── processed/        # Données traitées
├── src/
│   ├── backend/         # API FastAPI/Flask
│   └── frontend/        # Application React
├── docker/
│   └── services/        # Configurations des services Docker
├── docs/
│   ├── architecture/    # Documentation architecture
│   ├── api/            # Documentation API
│   └── security/       # Documentation sécurité
└── scripts/
    ├── data_ingestion/ # Scripts d'importation
    └── backup/         # Scripts de sauvegarde
```

## 🛠 Technologies utilisées
- **Big Data** 
  - Hadoop 3.x
  - HDFS
  - YARN
  - HBase
  - Hive
- **Recherche** 
  - ElasticSearch 7.17.0
- **Backend** 
  - FastAPI
  - Python 3.8+
- **Frontend** 
  - React.js
  - TailwindCSS
- **Conteneurisation** 
  - Docker
  - Docker Compose
- **Sécurité** 
  - Kerberos
  - SSL/TLS
- **Base de données** 
  - HBase
  - HDFS

## ⚙️ Prérequis
- Docker et Docker Compose
- Python 3.8+
- Node.js 14+
- Git
- 8GB RAM minimum
- 20GB espace disque minimum

## 📥 Installation

1. Cloner le repository
```bash
git clone git@github.com:FlorentGATTI/noaa-weather-analysis.git
cd noaa-weather-analysis
```

2. Configurer l'environnement Python
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

3. Télécharger les données NOAA
```bash
python scripts/data_ingestion/download_noaa_data.py
```

4. Démarrer les services Docker
```bash
docker-compose up -d
```

## 🔧 Configuration

### Services et ports
- **Hadoop**
  - NameNode: http://localhost:9870
  - DataNode1: http://localhost:9864
  - DataNode2: http://localhost:9865
- **Hive**
  - HiveServer2: http://localhost:10002
- **ElasticSearch**
  - API: http://localhost:9200
- **Application**
  - Frontend: http://localhost:3000
  - Backend API: http://localhost:8000

### Variables d'environnement
Créez un fichier `.env` à la racine du projet :
```
ELASTICSEARCH_HOST=localhost
HIVE_HOST=localhost
API_KEY=votre_clé_api
```

## 📊 Sources de données NOAA

### Données structurées
1. GSOD (Global Surface Summary of the Day)
   - Source: https://www.ncei.noaa.gov/data/global-summary-of-the-day/access/
   - Format: CSV
   - Fréquence: Quotidienne

2. ISD (Integrated Surface Database)
   - Source: https://www.ncei.noaa.gov/products/land-based-station/integrated-surface-database
   - Format: CSV
   - Fréquence: Horaire

### Données non structurées
- Storm Events Database
  - Source: https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/
  - Format: CSV avec champs texte
  - Contenu: Rapports détaillés d'événements météorologiques

## 🔒 Sécurité
- Authentification Kerberos pour Hadoop
- Chiffrement HDFS pour les données au repos
- SSL/TLS pour les communications
- API Key pour l'accès à l'API
- CORS configuré pour le développement

## 🔄 Maintenance
### Sauvegardes
```bash
# Sauvegarde manuelle
./scripts/backup/backup.sh

# Restauration
./scripts/backup/restore.sh <date_backup>
```

### Logs
Les logs sont stockés dans:
- `/logs/hadoop/` pour Hadoop
- `/logs/elastic/` pour ElasticSearch
- `/logs/application/` pour l'application

## 👨‍💻 Contributeurs
- Florent GATTI

## 📝 Licence
Ce projet est sous licence MIT.
