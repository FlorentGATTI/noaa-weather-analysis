from fastapi import FastAPI, HTTPException, Security
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from elasticsearch import Elasticsearch
from pyhive import hive
import pandas as pd
import json
import os
from typing import List, Dict, Any
from datetime import datetime

app = FastAPI(title="NOAA Weather Analysis API")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration Elasticsearch
es = Elasticsearch([{'host': os.getenv('ELASTICSEARCH_HOST', 'localhost'), 'port': 9200}])

# Configuration Hive
hive_connection = {
    'host': os.getenv('HIVE_HOST', 'localhost'),
    'port': 10000,
    'username': 'hive',
    'database': 'default'
}

# API Security
api_key_header = APIKeyHeader(name="X-API-Key")

def get_api_key(api_key_header: str = Security(api_key_header)) -> str:
    if api_key_header == os.getenv("API_KEY", "development_key"):
        return api_key_header
    raise HTTPException(status_code=403, detail="Could not validate API Key")

@app.get("/")
async def root():
    return {"message": "NOAA Weather Analysis API"}

@app.get("/health")
async def health_check():
    health = {
        "elasticsearch": es.ping(),
        "timestamp": datetime.now().isoformat()
    }
    try:
        with hive.connect(**hive_connection) as conn:
            health["hive"] = True
    except Exception as e:
        health["hive"] = False
        health["hive_error"] = str(e)
    
    return health

@app.get("/weather/gsod/{year}/{station}")
async def get_gsod_data(year: int, station: str, api_key: str = Security(get_api_key)):
    query = f"""
    SELECT *
    FROM gsod
    WHERE year = {year}
    AND station = '{station}'
    """
    try:
        with hive.connect(**hive_connection) as conn:
            df = pd.read_sql(query, conn)
        return df.to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/weather/storm-events/{year}")
async def get_storm_events(year: int, api_key: str = Security(get_api_key)):
    query = {
        "query": {
            "bool": {
                "must": [{"match": {"year": year}}]
            }
        }
    }
    try:
        result = es.search(index="storm-events", body=query)
        return result['hits']['hits']
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/weather/analysis/temperature-trends")
async def get_temperature_trends(start_year: int, end_year: int, api_key: str = Security(get_api_key)):
    query = f"""
    SELECT year, 
           AVG(temp) as avg_temp,
           MAX(temp) as max_temp,
           MIN(temp) as min_temp
    FROM gsod
    WHERE year BETWEEN {start_year} AND {end_year}
    GROUP BY year
    ORDER BY year
    """
    try:
        with hive.connect(**hive_connection) as conn:
            df = pd.read_sql(query, conn)
        return df.to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
