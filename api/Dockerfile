FROM node:14-alpine

ARG APP_DIR=/var/www/masterbook/api
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

COPY package*.json ./
RUN npm i
