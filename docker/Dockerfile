# Build stage
FROM public.ecr.aws/docker/library/node:16.17.1-slim as build
ARG DEBIAN_FRONTEND=noninteractive

RUN apt update && \
  apt upgrade -y && \
  apt install -y git

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install
COPY . /app/

RUN yarn run build

# App / Deploy stage
FROM public.ecr.aws/nginx/nginx:alpine
ENV NGINX_PORT=8080

COPY --from=build /app/dist/ /usr/share/nginx/html
COPY docker/nginx/templates/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE ${NGINX_PORT}
CMD ["nginx","-g","daemon off;"]
