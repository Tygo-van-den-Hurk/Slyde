FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS build
RUN npm ci
COPY ./ ./
RUN npm run build && npm run test
# Remove non-runtime files to make the image smaller
RUN rm -rf test && rm *vitest*
RUN find dist -type f -name "*.map" -delete
RUN find dist -type f -name "*.ts" -delete

FROM base AS production
RUN npm ci --omit=dev 
COPY --from=build /app/dist ./dist
RUN chmod +x ./dist/src/cli.js
ENTRYPOINT ["./dist/src/cli.js"]
