FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    postgresql-client \
    curl \
    openssl \
    tar \
    && rm -rf /var/lib/apt/lists/*

COPY backup.sh /backup.sh
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /backup.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/backup.sh"]
