### Stage 1: Build ###
FROM node:22-alpine3.19 AS build
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build

### Stage 2: Run ###
FROM nginx:1.27.0-alpine-slim
RUN mkdir -p /usr/share/nginx/html/scheduler2
ADD . /data/reports
COPY --from=build /app/dist/scheduler-client /usr/share/nginx/html/scheduler2/
COPY --from=build /app/scheduler.conf /etc/nginx/conf.d/scheduler.conf

RUN chown -R nginx:nginx /usr/share/nginx/html/scheduler2

EXPOSE 8087