FROM node:18-alpine as builder
WORKDIR /app
COPY ./client .
COPY ./package-lock.json .
RUN npm install && npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package-lock.json /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
# USER node
CMD ["npm", "start"]
