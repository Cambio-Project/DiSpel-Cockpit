FROM node:22.2-slim as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY . .

RUN pnpm install
RUN pnpm run build

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]