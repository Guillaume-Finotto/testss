FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --production

COPY . .

EXPOSE 4003

CMD ["npm", "start"]
