FROM node:11-alpine

WORKDIR /usr/src/app
COPY . .
RUN yarn install

CMD ["yarn", "start"]