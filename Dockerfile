FROM node:18-alpine

USER node
COPY --chown=node:node package*.json /usr/src/app/
WORKDIR /usr/src/app/
RUN npm ci

COPY --chown=node:node . /usr/src/app/
RUN npm run build
CMD npm run start:prod