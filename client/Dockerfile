FROM node:18-alpine as base
WORKDIR /app
COPY ./client/package.json .
COPY ./package-lock.json .
RUN npm install

FROM base as builder
WORKDIR /app
COPY ./client .
COPY --from=base /app/node_modules ./node_modules
RUN npm run build

FROM base as dev
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
CMD ["npm", "run", "dev"]

FROM base as prod
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/next.config.js /app/.env .
COPY --from=builder /app/public ./public
COPY --chown=node --from=builder /app/.next ./.next
RUN npm install --omit=dev
USER node
CMD ["node_modules/.bin/next", "start"]
