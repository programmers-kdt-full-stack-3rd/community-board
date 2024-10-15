# multi-arch를 위해 MariaDB 최신 이미지 사용
FROM mariadb:latest

# SQL 파일들을 복사
COPY ./ /docker-entrypoint-initdb.d/

# .env 파일로부터 인자값을 전달받기 위해 ARG 사용
ARG MYSQL_ROOT_PASSWORD
ARG MYSQL_DATABASE
ARG MYSQL_USER
ARG MYSQL_PASSWORD

# 환경 변수 설정
ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
    MYSQL_DATABASE=${MYSQL_DATABASE} \
    MYSQL_USER=${MYSQL_USER} \
    MYSQL_PASSWORD=${MYSQL_PASSWORD}

# 3306 포트 노출
EXPOSE 3306
