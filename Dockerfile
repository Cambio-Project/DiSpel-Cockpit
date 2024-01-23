FROM node:18.14.2-slim as base

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

CMD [ "node", ".output/server/index.mjs" ]