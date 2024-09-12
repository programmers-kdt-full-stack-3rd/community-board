FROM node:latest AS build

WORKDIR /app/community_board

RUN apt-get update -y

COPY ./server ./server

COPY ./shared ./shared

COPY ./package*.json ./

RUN npm install

CMD npm run dev --workspace=server