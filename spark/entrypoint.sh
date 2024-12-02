#!/bin/bash

export SPARK_HOME=/opt/spark
export PATH=$SPARK_HOME/bin:$SPARK_HOME/sbin:$PATH

/usr/sbin/sshd

if [ "$SPARK_MODE" = "master" ]; then
    echo "Starting Spark Master..."
    $SPARK_HOME/sbin/start-master.sh
elif [ "$SPARK_MODE" = "worker" ]; then
    echo "Starting Spark Worker..."
    $SPARK_HOME/sbin/start-worker.sh ${SPARK_MASTER_URL}
fi

jps
tail -f /dev/null
