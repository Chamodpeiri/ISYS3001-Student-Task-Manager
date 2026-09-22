# Deployment Configuration

## Runtime Requirements
Node.js version 20 is used to run the application.
npm is used to install and manage dependencies.

## Environment Variables
The application uses PORT, MONGODB_URI, SESSION_SECRET and NODE_ENV.
Production values are configured using environment variables.

## Installation
Dependencies are installed using:
npm ci

## Quality Checks
Code quality is checked using:
npm run lint

Automated tests are run using:
npm test

## Starting the Application
The application is started using:
npm start

## Health Check
The application provides the /health endpoint.
A successful health check returns HTTP status 200.

## Security of Configuration Values
Sensitive values such as MongoDB credentials and session secrets are not stored in GitHub.
The .gitignore file prevents real environment files from being committed.
