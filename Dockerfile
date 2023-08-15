FROM node

RUN mkdir -p /home/app

WORKDIR /home/app

COPY . /home/app/

RUN npm install

EXPOSE 5000

CMD ["node", "index.js"]