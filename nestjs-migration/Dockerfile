FROM node:18 AS build

WORKDIR /app/community_board

RUN apt-get update -y

COPY ./nestjs-migration ./nestjs-migration
COPY ./shared ./shared
COPY ./package*.json ./
COPY ./nginx/.env ./

RUN npm install
CMD ["npm", "run", "start:dev", "--workspace=nestjs-migration"]