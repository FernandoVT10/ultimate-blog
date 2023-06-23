FROM node:18-alpine as build

WORKDIR /app

COPY ./api .
COPY ./package-lock.json .

RUN npm install && npm run build

# FROM node:18-alpine
# WORKDIR /app
#
# COPY --from=build /src/build ./build
#
# COPY ./api/package.json .
# COPY ../package-lock.json .
# COPY ./api/.env .
#
# RUN npm install --omit=dev
#
CMD ["npm", "start"]
