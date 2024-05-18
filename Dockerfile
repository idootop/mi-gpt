# syntax=docker/dockerfile:1

# base
FROM node:20.13.1-alpine as base

WORKDIR /app

# build
FROM base as build

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@9.1.1

COPY . .

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install && pnpm build

# run
FROM base

COPY package.json .
COPY --from=build /app/dist ./dist
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules

# Run the application.
CMD npm run start
