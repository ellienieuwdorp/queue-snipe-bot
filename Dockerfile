FROM node:alpine

RUN apk add --no-cache git
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot

RUN npm install -g node-gyp
RUN npm install build-tools  -g
RUN npm install

COPY . /usr/src/bot

CMD echo "BOT_TOKEN=${BOT_TOKEN}" > /usr/src/bot/.env && chmod 600 /usr/src/bot/.env && node index.js