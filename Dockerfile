# ==========================
# 1. BUILD
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache bash coreutils

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV WRANGLER_LOG_PATH=.wrangler/wrangler.log

RUN apk upgrade --no-cache

COPY --from=builder /app /app

RUN npm prune --omit=dev \
    && npm cache clean --force \
    && rm -rf /root/.npm

RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000/ || exit 1

CMD ["./node_modules/.bin/vinext", "start"]