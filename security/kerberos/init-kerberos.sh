#!/bin/bash
set -e

# Configuration
REALM=${KRB5_REALM:-HADOOP.LOCAL}
ADMIN_PASSWORD=${KRB5_ADMIN_PASSWORD:-admin}

# Create KDC database
kdb5_util create -r ${REALM} -s -P ${ADMIN_PASSWORD}

# Start Kerberos services
krb5kdc
kadmind -nofork

# Keep container running
tail -f /dev/null
