FROM node:latest

WORKDIR /app

COPY . /app

RUN npm install -g npm

RUN npm install

RUN npm run build

RUN npm install nodemon

#CMD [ "pm2", "start", ".", "--name", "server" ]
CMD ["nodemon", "."]