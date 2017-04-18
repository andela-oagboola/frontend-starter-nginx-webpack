FROM node:6-slim

# Install NGINX
RUN apt-get update -y \
    && apt-get -y install nginx

# NGINX related things
COPY app/nginx.conf /etc/nginx/nginx.conf
RUN touch /var/log/nginx/access.log \
    && touch /var/log/nginx/error.log

WORKDIR /opt/app
COPY app/package.json /opt/app/
COPY app/webpack.config.js /opt/app/
COPY app/components /opt/app/components

RUN npm install
RUN npm run xbuild


# webpack should be build somewhere around here, or maybe as a shell script

EXPOSE 80 443

CMD nginx

