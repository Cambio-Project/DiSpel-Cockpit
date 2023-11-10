# build stage
FROM node:lts-alpine as build-stage

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build


# production stage
FROM nginx:stable-alpine as production-stage

# copy the created buuild fields from the build stage to the nginx directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# exposes the container port 80
EXPOSE 80

# starts the nginx webserver
CMD ["nginx", "-g", "daemon off;"]