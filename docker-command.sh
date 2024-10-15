#!/bin/bash

if [ $1 == "ka" ]; then
    docker-compose -f docker-compose-kafka.yaml --env-file ./nginx/.env -p kafka up -d
elif [ $1 == "co" ]; then
    docker-compose -f docker-compose-server.yaml -p community up -d
elif [ $1 == "db" ]; then
    cd sql;
    docker-compose -f docker-compose.yaml up -d;
    cd ..;
elif [ $1 == "del-ka" ]; then
    docker-compose -f docker-compose-kafka.yaml -p kafka down
elif [ $1 == "del-co" ]; then
    docker-compose -f docker-compose-server.yaml -p community down
elif [ $1 == "del-cache" ]; then
    docker system prune --all --volumes
elif [ $1 == "upload-client" ]; then
    docker buildx build --platform linux/amd64 -t hungkunge/client:latest --push -f ./client/Dockerfile .
elif [ $1 == "upload-server" ]; then
    docker buildx build --platform linux/amd64 -t hungkunge/api-server:latest --push -f ./nestjs-migration/Dockerfile .
elif [ $1 == "upload-consumer" ]; then
    docker buildx build --platform linux/amd64 -t hungkunge/consumer-server:latest --push -f ./consumer-server/Dockerfile .
elif [ $1 == "upload-chat" ]; then
    docker buildx build --platform linux/amd64 -t hungkunge/chat_server:latest --push -f ./chat_server/Dockerfile .
elif [ $1 == "up-db" ]; then
    cd sql
    docker buildx build --platform linux/amd64 \
        --build-arg MYSQL_ROOT_PASSWORD=$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2) \
        --build-arg MYSQL_DATABASE=$(grep MYSQL_DATABASE .env | cut -d '=' -f2) \
        --build-arg MYSQL_USER=$(grep MYSQL_USER .env | cut -d '=' -f2) \
        --build-arg MYSQL_PASSWORD=$(grep MYSQL_PASSWORD .env | cut -d '=' -f2) \
        -t hungkunge/codeplay-db:latest --push .
    cd ..
elif [ $1 == "upload-all" ]; then
    docker buildx build --platform linux/amd64 -t hungkunge/client:latest --push -f ./client/Dockerfile .
    docker buildx build --platform linux/amd64 -t hungkunge/api-server:latest --push -f ./nestjs-migration/Dockerfile .
    docker buildx build --platform linux/amd64 -t hungkunge/consumer-server:latest --push -f ./consumer-server/Dockerfile .
    docker buildx build --platform linux/amd64 -t hungkunge/chat_server:latest --push -f ./chat_server/Dockerfile .
else
    echo "wrong command!";
fi

