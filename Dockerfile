FROM node:latest

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install

COPY . /usr/src/bot

# Use BOT_TOKEN env variable as the token in this docker image
RUN echo "BOT_TOKEN=\${BOT_TOKEN}" > /usr/src/bot/.env

CMD ["node", "index.js"]