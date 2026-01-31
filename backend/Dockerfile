FROM node:20-alpine AS deps

RUN apk add --no-cache openssl libssl3

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder

RUN apk add --no-cache openssl libssl3

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

RUN apk add --no-cache openssl libssl3

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4000

CMD npx prisma migrate deploy && node dist/index.js
