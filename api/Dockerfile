FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY build ./build

CMD [ "npm", "start" ]
