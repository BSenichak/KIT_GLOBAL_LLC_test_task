# Project Setup and Usage

This project is a NestJS application. Follow these steps to set up and run the project:

## Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (npm is included with Node.js)
*   [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for running with Docker)

## Installation

1.  **Clone the repository** (if you haven't already).
2.  **Install project dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

## Running the Application

### Development Mode

To run the application in development mode with automatic restarts on file changes:

```bash
npm run start:dev
# or
yarn start:dev
```

The application will typically be available at `http://localhost:3000` (default NestJS port).

### Production Mode

1.  **Build the application:**
    ```bash
    npm run build
    # or
    yarn build
    ```
    This command compiles the TypeScript code into JavaScript and prepares it for deployment.

2.  **Start the production server:**
    ```bash
    npm run start:prod
    # or
    yarn start:prod
    ```
    This will run the compiled JavaScript from the `dist/` directory.

### Running with Docker

If Docker is installed, you can use the provided `docker-compose.yaml` and `Dockerfile` to run the application:

1.  **Build and run the Docker containers:**
    ```bash
    docker-compose up --build
    ```
    This command will build the Docker image if necessary and start the application within a container. The application will be accessible at `http://localhost:3000`.

## Linting and Formatting

*   **Linting:**
    ```bash
    npm run lint
    # or
    yarn lint
    ```
*   **Formatting:**
    ```bash
    npm run format
    # or
    yarn format
    ```

## Testing

*   **Unit Tests:**
    ```bash
    npm run test
    # or
    yarn test
    ```
*   **E2E Tests:**
    ```bash
    npm run test:e2e
    # or
    yarn test:e2e
    ```
