FROM node:18-alpine

WORKDIR /app

COPY package.json ./

COPY ./__pycache__ ./__pycache__
COPY ./build ./build
COPY ./dist ./dist
COPY ./migrations ./migrations
COPY ./node_modules ./node_modules
COPY ./src ./src
COPY ./static ./static
COPY ./templates ./templates
COPY babel.config.json /app
COPY package-lock.json /app
COPY package.json /app
COPY webpack.config.js /app

RUN npm install\
    && npm install -g postcss-loader postcss postcss-import postcss-url\
    && npm install -g serve \
    && npm run build \
    && rm -fr node_modules

EXPOSE 8000

CMD ["npm", "run", "dev"]