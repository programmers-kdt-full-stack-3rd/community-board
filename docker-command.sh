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
elif [ $1 == "push" ]; then
  docker push hungkunge/community_board;
else
    echo "wrong command!";
fi
