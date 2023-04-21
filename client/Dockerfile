FROM node:18-alpine
USER root
RUN apk update
RUN apk add
RUN apk add ffmpeg
USER node
WORKDIR /usr/src/app/
COPY --chown=node:node . /usr/src/app/
RUN npm ci
RUN npm run build
CMD npm run start:dev
