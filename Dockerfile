FROM node:9.11.1-alpine

ARG BASE_URL=http://localhost:8081
ARG PORT=8080
ENV VUE_APP_BASE_URL $BASE_URL
ENV PORT $PORT

# install simple http server for serving static content
RUN yarn global add http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./
COPY yarn.lock ./

# install project dependencies
RUN yarn

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN yarn build

EXPOSE $PORT
CMD "http-server" "-p" "$PORT" "dist"
