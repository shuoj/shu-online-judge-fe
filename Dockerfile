FROM node:9.11.1-alpine

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
RUN BASE_URL=$BASE_URL yarn build

EXPOSE 8080
CMD [ "http-server","-p","8080", "dist" ]
