# Technical Assessment

Complete the assessment in 3 days or otherwise stipulated. Do read the following details carefully and thoroughly for the requirements. If you have any queries on the assessment you may ask your interviewer for the contact. If you need time extension do request from your interviewer.

## Problem Statement

Create a React/Svelte frontend in Typescript and NodeJS web backend in Typescript/Javascript with the following functionalities.

1. Upload a CSV file with appropriate feedback to the user on the upload progress. Data needs to be stored in a database.

2. List the data uploaded with pagination.

3. Search data from the uploaded file. The web application should be responsive while listing of data and searching of data.

4. Proper handling and checks for the data uploaded.

## Submission Requirement

In your submission, must include the following:

1. Use this [csv file](data.csv) as the sample

2. Include unit tests with complete test cases including edge cases.

3. Provide a git repository for us to assess your submission.

4. Provide a docker compose file to run the necessary components for your application.

5. Provide a readme in the git repository on how to setup and run the project.

# Other notes

- You will be expected to run and demo your application running the docker compose file during the interview.

# Building and Running the Application with Docker Compose

This guide explains how to build and run the application using Docker Compose.

## Prerequisites

Ensure you have the following installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Steps to Build and Run

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Create the Docker Compose File

Ensure you have a `docker-compose.yml` file in the root of your project. Below is an example:

### 3. Build and Run the Containers

Use the following command to build and run the containers:

```bash
docker-compose up --build
```

This command will:

- Build the Docker image specified in the `Dockerfile`.
- Start the container and expose the application on `http://localhost:3000`.

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

### 5. Stop the Containers

To stop the running containers, press `Ctrl+C` in the terminal or use the following command:

```bash
docker-compose down
```

### 6. Rebuilding the Containers

If you make changes to the code or `Dockerfile`, rebuild the containers with:

```bash
docker-compose up --build
```

## Troubleshooting

- **Port Already in Use:** Ensure port `3000` is free or modify the `docker-compose.yml` to use a different port.
- **Dependency Issues:** If there are issues with dependencies, ensure the `node_modules` folder is correctly mounted.

## Additional Notes

- Use `docker-compose logs` to view container logs.
- Ensure that you dont have any 3306 port used on your local machine.

## Unit test

Go in to backend service repo
Make sure that you already installed everything with `npm install`

```bash
cd backend
```

Run the test with the code `npm test`
