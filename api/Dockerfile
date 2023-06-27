FROM node:18-alpine as builder
WORKDIR /app
COPY ./api .
COPY ./package-lock.json .
RUN npm install && npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/build ./build
COPY --from=builder /app/package-lock.json /app/package.json /app/.env ./
RUN npm install --omit=dev
CMD ["node", "build/main.js"]
