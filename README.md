# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup locally

If you want to test the Dashboard with the PSPWizard you need to change the ``PSP_WIZARD_DOMAINNAME``
and ``PSP_WIZARD_PORT`` value in the ``.env`` file to the values on your machine.
Example values for local development are provided in the file.

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

___

### Run via Docker

### Change the .env File
If you want to test the Dashboard with the PSPWizard you need to change the ``PSP_WIZARD_DOMAINNAME``
and ``PSP_WIZARD_PORT`` value in the ``.env`` file to the values on your machine. 
Example values for local development are provided in the file.  

### Build the Docker Image

```
docker build -t <TagName> .
```
- `<TagName>`: The name of the created image.


### Run the Container from the built Image

```
docker run -p 8082:3000 --name <ContainerName> <TagName> -d
```
- `-p 8082:3000`: Binds the host port 8080 to the container port 80.
- `--name <ContainerName>`: Names the Container with the given container name.
- `<TagName>`: Replace this with the TagName you choose in the build process above.
- `-d`: Use this flag if you want to start the container in the background.

### Access the Dashboard

If you used the default host port `8082`, you can now access the dashboard via http://localhost:8080/

___
## Run via Docker Compose

To start the Dashboard and all its dependencies you can use the provided docker-compose file.
The following commands need to be executed in the folder of the docker compose file.

### Start Everything with Docker Compose

```
docker compose up -d
```
- `-d`: Starts the container in detached mode, so that you dont need to have the terminal open and running.

### Access the Dashboard

If you used the default host port `8080`, you can now access the dashboard via http://localhost:8080/


### Stop Everything with Docker Compose

```
docker compose down
```

### Further information to the docker-compose.yml
- `version: "1"`: Version of the docker-compose file.
- `name: "dashboard-project"`: The name of the toplevel container group that contains all the containers.
- `services:`: Here we describe all the services we want to start with the docker compose file.
- `dashboard:`: Is the name of your first server (The dashboard).
- `build: ./:`: Because we have no image registry we need to build the Dockerfile manually at the location `./` which is our Dockerfile.
- `ports: - 8082:3000:`: Here we describe which ports we want to bind to our container. Our Dockerfile opens up port `3000`, and we now bind it to our system port `8082`.
- `networks: dashboardNetwork`: We currently dont need this because we only have one service, but when we have more then one this is the network layer our services can communicate over.