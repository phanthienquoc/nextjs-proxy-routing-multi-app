# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/apps/main
COPY apps/main/package.json ./package.json
RUN npm install
COPY tsconfig.base.json /app/tsconfig.base.json
COPY apps/main ./
RUN npm run build

FROM node:20-alpine AS runner
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ARG NEXT_PUBLIC_SURVEY_ORIGIN=http://survey:3001
ARG NEXT_PUBLIC_CHAT_ORIGIN=http://chat:4173
ENV NEXT_PUBLIC_SURVEY_ORIGIN=$NEXT_PUBLIC_SURVEY_ORIGIN
ENV NEXT_PUBLIC_CHAT_ORIGIN=$NEXT_PUBLIC_CHAT_ORIGIN
WORKDIR /app/apps/main
COPY --from=builder /app/apps/main/.next ./.next
COPY --from=builder /app/apps/main/public ./public
COPY --from=builder /app/apps/main/next.config.mjs ./next.config.mjs
COPY --from=builder /app/apps/main/package.json ./package.json
COPY --from=builder /app/apps/main/node_modules ./node_modules
COPY --from=builder /app/tsconfig.base.json ../tsconfig.base.json
EXPOSE 3000
CMD ["npm", "run", "start"]
