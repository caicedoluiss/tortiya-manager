FROM node:22.16-alpine3.21 AS build-stage
ARG API_URL

COPY . /app
WORKDIR /app

# env variables are setted during build
ENV VITE_API_URL=$API_URL

RUN npm ci
RUN npm run build

FROM nginx:1.27-alpine3.21
COPY nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
COPY --from=build-stage /app/dist .