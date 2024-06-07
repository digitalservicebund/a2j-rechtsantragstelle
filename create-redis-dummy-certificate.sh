#!/bin/bash
if [ -f "./certs/redis-server.key" ] && [ -f "./certs/redis-server.crt" ]
then
    echo "Using old certificates"
else
    mkdir certs
    openssl genrsa 2048 > ./certs/redis-server.key
    chmod 444 ./certs/redis-server.key
    openssl req -new -x509 -nodes -sha256 -days 365 -subj "/C=DE/ST=Test/L=Test/O=Test/CN=Test" -key ./certs/redis-server.key -out ./certs/redis-server.crt
    echo "Created new certificates"
fi
