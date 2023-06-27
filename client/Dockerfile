FROM node:18-alpine as builder
WORKDIR /app
COPY ./client .
COPY ./package-lock.json .
RUN npm install && npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/next.config.js /app/.env .
COPY --from=builder /app/public ./public
COPY --chown=node --from=builder /app/.next ./.next
RUN npm install --omit=dev
USER node
CMD ["node_modules/.bin/next", "start"]
