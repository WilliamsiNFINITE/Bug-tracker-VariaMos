FROM node:16

WORKDIR /server

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]