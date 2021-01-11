FROM node

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot

RUN npm install

COPY . /usr/src/bot

CMD echo "BOT_TOKEN=${BOT_TOKEN}" > /usr/src/bot/.env && chmod 600 /usr/src/bot/.env && node src/index.js