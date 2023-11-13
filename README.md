# Dashboard
A dashboard on VueJS for the WS 23/24 project.

___
### Project Setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

___

## Run via Docker

### Build the Docker Image

```
docker build -t <TagName> .
```
- `<TagName>`: The name of the created image.


### Run the Container from the built Image

```
docker run -p 8080:80 --name <ContainerName> <TagName> -d
```
- `-p 8080:80`: Binds the host port 8080 to the container port 80.
- `--name <ContainerName>`: Names the Container with the given container name. 
- `<TagName>`: Replace this with the TagName you choose in the build process above.
- `-d`: Use this flag if you want to start the container in the background.

### Access the Dashboard

If you used the default host port `8080`, you can now access the dashboard via http://localhost:8080/