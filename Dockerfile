FROM node:alpine

RUN mkdir -p /home/category-manager/app
WORKDIR /home/category-manager/app

#VOLUME /config

COPY package.json .
RUN npm install --production

#COPY config ../../../config
COPY . .

ADD https://github.com/Yelp/dumb-init/releases/download/v1.1.1/dumb-init_1.1.1_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

EXPOSE 8080

CMD ["dumb-init","node", "client-router.js"]