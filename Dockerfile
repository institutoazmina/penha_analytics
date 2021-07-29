FROM node:16-alpine3.11

WORKDIR /home/node/app
COPY . /home/node/app/

RUN npm install

RUN npm install knex -g

USER node

RUN knex migrate:latest
CMD "npm" "start"


