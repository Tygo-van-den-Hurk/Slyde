FROM node:24-alpine AS build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY ./ ./
RUN npm run test && npm run build

FROM node:24-alpine AS production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev 
COPY --from=build /build/dist ./dist
RUN chmod +x ./dist/src/cli.js
ENTRYPOINT ["./dist/src/cli.js"]
