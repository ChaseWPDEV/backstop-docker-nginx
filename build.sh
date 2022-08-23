#!/bin/bash
docker volume create --name=backstop
docker-compose build
docker-compose up -d

nginx=$(docker inspect -f "{{ .NetworkSettings.IPAddress }}" backstop-nginx)
nc "${nginx}":22