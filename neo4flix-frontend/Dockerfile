FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build -- --configuration production


FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/neo4flix-frontend/browser/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY ssl/localhost.crt /etc/nginx/ssl/localhost.crt
COPY ssl/localhost.key /etc/nginx/ssl/localhost.key

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]