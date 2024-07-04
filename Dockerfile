FROM node:20-alpine

WORKDIR /usr/local/app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install nodemon

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
