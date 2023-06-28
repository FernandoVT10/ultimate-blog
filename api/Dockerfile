FROM node:18-alpine as base
WORKDIR /app
COPY ./api/package.json .
COPY ./package-lock.json .
RUN npm install

FROM base as builder
WORKDIR /app
COPY ./api .
COPY --from=base /app/node_modules ./node_modules
RUN npm run build

FROM base as dev
WORKDIR /app
ENV NODE_ENV development
COPY --from=base /app/node_modules ./node_modules
CMD ["npm", "run", "dev"]

FROM builder as prod
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/build ./build
COPY --from=builder /app/package-lock.json /app/package.json /app/.env ./
RUN npm install --omit=dev
CMD ["node", "build/main.js"]
