ARG NODE_VERSION
ARG APP_PORT
ARG MICROSERVICE_PORT
FROM node:${NODE_VERSION} as bot

RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY ./client /usr/src/app/client
COPY ./proto /usr/src/app/client/src/proto
COPY ./.env /usr/src/app/client/.env

WORKDIR /usr/src/app/client

RUN npm install

EXPOSE ${NODE_APP_PORT}

CMD ["npm","run","start:dev"]

FROM node:${NODE_VERSION} as subscription

COPY ./microservices/subscription_service /usr/src/app/microservices/subscription_service
COPY ./proto /usr/src/app/microservices/subscription_service/src/proto
COPY ./.env /usr/src/app/microservices/subscription_service/.env

WORKDIR /usr/src/app/microservices/subscription_service
RUN npm install

EXPOSE ${NODE_MOCROSERVICE_PORT}

CMD ["npm","run","start:dev"]
