FROM node:18-alpine
USER node
WORKDIR /usr/src/app/
COPY --chown=node:node . /usr/src/app/
#COPY --chown=node:node package*.json /usr/src/app/
RUN npm ci
RUN npm run build
CMD npm run start:dev
