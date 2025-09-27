# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/apps/chat

# Install dependencies first for better layer caching
COPY apps/chat/package.json ./package.json
RUN npm install

# Copy rest of the sources including shared tsconfig reference
COPY tsconfig.base.json /app/tsconfig.base.json
COPY apps/chat ./
RUN npm run build

FROM node:20-alpine AS runner
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
WORKDIR /app/apps/chat
COPY --from=builder /app/apps/chat/dist ./dist
COPY --from=builder /app/apps/chat/index.html ./index.html
COPY --from=builder /app/apps/chat/package.json ./package.json
COPY --from=builder /app/apps/chat/node_modules ./node_modules
COPY --from=builder /app/apps/chat/vite.config.ts ./vite.config.ts
COPY --from=builder /app/apps/chat/tsconfig.json ./tsconfig.json
COPY --from=builder /app/apps/chat/tsconfig.node.json ./tsconfig.node.json
COPY --from=builder /app/apps/chat/env.d.ts ./env.d.ts
COPY --from=builder /app/tsconfig.base.json ../tsconfig.base.json
EXPOSE 4173
CMD ["npm", "run", "preview"]
