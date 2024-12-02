FROM openjdk:8-jdk-slim

ENV HBASE_VERSION=2.4.17 \
  HBASE_HOME=/opt/hbase \
  PATH=$PATH:/opt/hbase/bin \
  JAVA_HOME=/usr/local/openjdk-8 \
  HBASE_MANAGES_ZK=false \
  HADOOP_USER_NAME=root

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  wget \
  curl \
  netcat \
  && rm -rf /var/lib/apt/lists/*

RUN wget https://archive.apache.org/dist/hbase/${HBASE_VERSION}/hbase-${HBASE_VERSION}-bin.tar.gz \
  && tar -xzvf hbase-${HBASE_VERSION}-bin.tar.gz \
  && mv hbase-${HBASE_VERSION} ${HBASE_HOME} \
  && rm hbase-${HBASE_VERSION}-bin.tar.gz \
  && mkdir -p ${HBASE_HOME}/logs

COPY hbase-site.xml ${HBASE_HOME}/conf/
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 16000 16010 16020 16030

VOLUME ["/data"]
WORKDIR ${HBASE_HOME}

ENTRYPOINT ["/entrypoint.sh"]
