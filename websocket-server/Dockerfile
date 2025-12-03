FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV SOCKET_PORT=3001
EXPOSE 3001

CMD ["npm", "start"]
