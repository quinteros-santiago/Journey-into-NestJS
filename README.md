# Journey-into-NestJS

"Journey-into-NestJS" is an educational project created for self-paced learning of Node.js, TypeScript, and the NestJS framework. This API project was created using MongoDB and RabbitMQ cloud services, providing a hands-on learning experience for modern back-end development.

## Prerequisites

- Node.js
- npm

## Software Versions

- TypeScript: 5.0.4
- Nest: 9.3.0
- MongoDB: 5.0.15
- RabbitMQ: 3.11.13

## Getting Started

1. Clone the repository and navigate into its directory.
2. Run `npm i` to install dependencies.
3. To start the project, run `npm run start`. Note: You need to provide a MongoDB connection string to fully utilize this project. Please refer to the "Notes" section below for more information about this step.

## API Routes

- Get a user:
  - `GET http://localhost:3000/api/user/<id>`
- Get a user's avatar:
  - `GET http://localhost:3000/api/user/<id>/avatar`
- Create a user:
  - `POST http://localhost:3000/api/users`
- Delete a user's avatar:
  - `DELETE http://localhost:3000/api/user/<id>/avatar`
- Delete all users (purges the MongoDB users collection):
  - `DELETE http://localhost:3000/api/users`

## Notes

- **MongoDB Connection:** Due to the absence of a built-in feature for rate limiting or throttling on MongoDB Atlas, and the potential security risks involved in sharing database credentials, you must provide your own MongoDB connection string. This is to avoid exposing the current MongoDB cluster used in the development of this project to an unrestricted number of requests. The connection string should be provided in the .env file located at the root of the project with the variable name MONGODB_URI. Please refer to MongoDB's documentation on how to create your own MongoDB Atlas cluster and generate a connection string.
- **Providing the instances:** If you provide the RabbitMQ, and gmail credentials in the `.env` file located at the root of the project, the API will interact with these services. If left blank, the API will run without these interactions (This is the default mode).
- **Data Source:** All user data used in this project is fetched from the reqres.in API.
