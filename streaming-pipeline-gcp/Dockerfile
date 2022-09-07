FROM node:latest

COPY index.js package.json .env /
RUN npm install
CMD [ "node", "index.js" ]