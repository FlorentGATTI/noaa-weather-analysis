FROM alpine:3.18

RUN apk add --no-cache \
  krb5 \
  krb5-server \
  bash \
  && rm -rf /var/cache/apk/*

COPY krb5.conf /etc/krb5.conf
COPY init-kerberos.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/init-kerberos.sh && \
  mkdir -p /var/kerberos/krb5kdc

EXPOSE 88 464 749

CMD ["/usr/local/bin/init-kerberos.sh"]
