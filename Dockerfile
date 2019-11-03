FROM node:9.11.1-alpine

ARG VUE_APP_BASE_URL=http://localhost:8081
ENV PORT $PORT

# install simple http server for serving static content
RUN npm i -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./
COPY package-lock.json ./

# install project dependencies
RUN npm i

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

EXPOSE $PORT
CMD "http-server" "-p" "$PORT" "dist"
