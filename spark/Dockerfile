FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-11-jdk-headless \
    curl \
    openssh-server \
    python3-minimal \
    python3-pip \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /var/run/sshd

ENV SPARK_VERSION=3.4.4 \
    HADOOP_VERSION=3 \
    SPARK_HOME=/opt/spark \
    PATH="/opt/spark/bin:/opt/spark/sbin:$PATH"

# Télécharger et installer Spark
RUN curl -O https://dlcdn.apache.org/spark/spark-$SPARK_VERSION/spark-$SPARK_VERSION-bin-hadoop$HADOOP_VERSION.tgz \
    && tar -xf spark-$SPARK_VERSION-bin-hadoop$HADOOP_VERSION.tgz \
    && mv spark-$SPARK_VERSION-bin-hadoop$HADOOP_VERSION $SPARK_HOME \
    && rm spark-$SPARK_VERSION-bin-hadoop$HADOOP_VERSION.tgz

# Ajouter le connecteur Elasticsearch-Spark
RUN curl -O https://repo1.maven.org/maven2/org/elasticsearch/elasticsearch-spark-30_2.12/8.12.2/elasticsearch-spark-30_2.12-8.12.2.jar \
    && mv elasticsearch-spark-30_2.12-8.12.2.jar $SPARK_HOME/jars/

COPY requirements.txt /
RUN pip3 install --no-cache-dir -r /requirements.txt

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 7077 8080

CMD ["/entrypoint.sh"]
