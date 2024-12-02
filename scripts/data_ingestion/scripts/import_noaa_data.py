from pyspark.sql import SparkSession
from pyspark.sql.functions import col, to_timestamp, year, month, when, regexp_replace
from pyspark.sql.types import StructType, StructField, StringType, FloatType
import logging
from pathlib import Path
from elasticsearch import Elasticsearch

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("/data/import_noaa.log"), logging.StreamHandler()],
)


class NOAADataImporter:
    def __init__(self):
        self.spark = (
            SparkSession.builder.appName("NOAA Data Import")
            .master("spark://spark-master:7077")
            .config("spark.executor.memory", "2g")
            .config("spark.driver.memory", "2g")
            .config("spark.elasticsearch.nodes", "elasticsearch")
            .config("spark.elasticsearch.port", "9200")
            .getOrCreate()
        )

        self.es = Elasticsearch(["http://elasticsearch:9200"])

    def import_weather_data(self):
        """Import des données GSOD et Storm Events"""
        try:
            # Import GSOD
            gsod_schema = StructType(
                [
                    StructField("STATION", StringType(), True),
                    StructField("DATE", StringType(), True),
                    StructField("LATITUDE", FloatType(), True),
                    StructField("LONGITUDE", FloatType(), True),
                    StructField("ELEVATION", FloatType(), True),
                    StructField("TEMP", FloatType(), True),
                    StructField("DEWP", FloatType(), True),
                    StructField("SLP", FloatType(), True),
                    StructField("STP", FloatType(), True),
                    StructField("VISIB", FloatType(), True),
                    StructField("WDSP", FloatType(), True),
                    StructField("MXSPD", FloatType(), True),
                    StructField("GUST", FloatType(), True),
                    StructField("MAX", FloatType(), True),
                    StructField("MIN", FloatType(), True),
                    StructField("PRCP", FloatType(), True),
                    StructField("SNDP", FloatType(), True),
                    StructField("FRSHTT", StringType(), True),
                ]
            )

            gsod_df = self.spark.read.csv(
                "/data/raw/gsod/*/*.csv", header=True, schema=gsod_schema
            )

            gsod_df = (
                gsod_df.withColumn("date", to_timestamp(col("DATE"), "yyyyMMdd"))
                .withColumn("year", year(col("date")))
                .withColumn("month", month(col("date")))
            )

            # Sauvegarde GSOD
            gsod_df.write.partitionBy("year", "month").mode("overwrite").parquet(
                "/data/processed/gsod"
            )

            # Import Storm Events
            events_df = self.spark.read.csv(
                "/data/raw/storm_events/csv/*.csv", header=True, inferSchema=True
            )

            events_df = (
                events_df.withColumn("date", to_timestamp(col("BEGIN_DATE_TIME")))
                .withColumn("year", year(col("date")))
                .withColumn(
                    "damage_estimate",
                    when(
                        col("DAMAGE_PROPERTY").endswith("K"),
                        regexp_replace(col("DAMAGE_PROPERTY"), "K", "").cast("float")
                        * 1000,
                    )
                    .when(
                        col("DAMAGE_PROPERTY").endswith("M"),
                        regexp_replace(col("DAMAGE_PROPERTY"), "M", "").cast("float")
                        * 1000000,
                    )
                    .when(
                        col("DAMAGE_PROPERTY").endswith("B"),
                        regexp_replace(col("DAMAGE_PROPERTY"), "B", "").cast("float")
                        * 1000000000,
                    )
                    .otherwise(0),
                )
            )

            # Sauvegarde Storm Events
            events_df.write.partitionBy("year").mode("overwrite").parquet(
                "/data/processed/storm_events"
            )

            # Index dans Elasticsearch
            gsod_df.write.format("org.elasticsearch.spark.sql").option(
                "es.nodes", "elasticsearch"
            ).option("es.port", "9200").option("es.resource", "weather_data").option(
                "es.mapping.id", "STATION"
            ).mode("append").save()

            events_df.write.format("org.elasticsearch.spark.sql").option(
                "es.nodes", "elasticsearch"
            ).option("es.port", "9200").option("es.resource", "weather_events").option(
                "es.mapping.id", "EVENT_ID"
            ).mode("append").save()

            logging.info("Import des données terminé avec succès")

        except Exception as e:
            logging.error(f"Erreur pendant l'import: {str(e)}")
            raise
        finally:
            self.close()

    def close(self):
        if self.spark:
            self.spark.stop()


if __name__ == "__main__":
    importer = NOAADataImporter()
    importer.import_weather_data()
