# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/apps/survey
COPY apps/survey/package.json ./package.json
RUN npm install
COPY tsconfig.base.json /app/tsconfig.base.json
COPY apps/survey ./
RUN npm run build

FROM node:20-alpine AS runner
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
WORKDIR /app/apps/survey
COPY --from=builder /app/apps/survey/.next ./.next
COPY --from=builder /app/apps/survey/public ./public
COPY --from=builder /app/apps/survey/next.config.mjs ./next.config.mjs
COPY --from=builder /app/apps/survey/package.json ./package.json
COPY --from=builder /app/apps/survey/node_modules ./node_modules
COPY --from=builder /app/tsconfig.base.json ../tsconfig.base.json
EXPOSE 3001
CMD ["npm", "run", "start"]
