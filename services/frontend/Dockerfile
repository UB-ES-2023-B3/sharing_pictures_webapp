FROM node:lts-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

RUN npm install -g postcss-loader postcss postcss-import postcss-url
RUN npm install -g serve

COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm run build   

CMD ["npm", "run", "serve"]
#CMD ["npm", "run", "dev"]