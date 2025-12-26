# syntax=docker/dockerfile:1

FROM oven/bun:1.3.5 AS base
WORKDIR /app

# Development stage
FROM base AS dev
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma/
RUN bunx prisma generate

COPY . .
EXPOSE 3050
CMD ["bun", "run", "dev"]

# Production build stage
FROM base AS builder
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma/
RUN bunx prisma generate

COPY . .
RUN bun run build

# Production stage
FROM base AS production
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["bun", "run", "start"]
