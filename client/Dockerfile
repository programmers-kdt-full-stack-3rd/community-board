FROM node:latest AS build

WORKDIR /app/community_board

RUN apt-get update -y

COPY ./client ./client
COPY ./shared ./shared
COPY ./package*.json ./
COPY ./nginx/client/.env ./client

RUN npm install
RUN npm run build --workspace=client

RUN ls -la ./client/dist

# 빌드된 파일을 복사할 경로 수정
FROM nginx:latest

COPY ./nginx/default.conf /etc/nginx/conf.d
COPY ./nginx/nginx.conf /etc/nginx

# 빌드된 클라이언트 파일을 Nginx의 루트 디렉토리로 복사
COPY --from=build /app/community_board/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]