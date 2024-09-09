FROM node:latest AS build

WORKDIR /app/community_board

RUN apt-get update -y

COPY ./client ./client
COPY ./server ./server
# COPY ./chat_server ./chat_server
# COPY ./consumer-server ./consumer-server
COPY ./shared ./shared

COPY ./package*.json ./

RUN npm install

RUN npm run build --workspace=client

CMD npm run dev --workspace=server