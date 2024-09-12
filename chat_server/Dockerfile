FROM node:latest AS build

WORKDIR /app/community_board

RUN apt-get update -y

COPY ./chat_server ./chat_server

COPY ./shared ./shared

COPY ./package*.json ./

COPY ./nginx/chat/.env ./chat_server

RUN npm install

CMD npm run dev --workspace=chat_server