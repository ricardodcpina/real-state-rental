# Real Estate Rental

A real state platform designed for fictional rentals and also my first project built from scratch, which integrates several software development topics that I've learned recently.

Instead of making various small projects, I've challenged myself by testing my knowledge through building a more complex application and connecting the all the dots.

I realize that's there much to be done in order for this to become a real world application but sometimes you just need to get started. Experience comes through intense practice and it certainly takes time. I'm proud of this first achievement and surely will improve it in the future.

Hope you enjoy and can learn something from it or give a feedback to contribute with my learning process!

## Project Description

This is a Node.js full-stack application built with Next.js framework.

### Back-end

Back-end was already a separated work-in-progress app when I've decided to integrate it with Next.js, so I chose to connect both of them instead of building the backend directly inside Next.js provided structure.

- Located inside backend folder at root directory.
- Architecture is based on MVC and services
- Model layer consists of three schemas : User, House, Reserve
- Middlewares implemented for JWT authentication/authorization and handling errors.
- File upload feature provided for House images.
- NoSQL Database is provided from MongoDB docker image on port 27017.
- Unit tests covering all of the services and auxiliary functions.
- Some of the relevant bussiness logic :

  - User can be a lessor or a lessee of a estate.
  - User can only reserve estates that aren't owned by him.
  - User deletion also deletes it's reserves, it's registered estates and associated reserves made by other users.
  - Estate deletion also deletes it's associated reserves.
  - Reserve of a estate makes it unavailable for other users at the current version of the app, regardless of date picked.

- Server runs on port 8000.

### Front-end

Front-end is provided by Next.js framework using function components from React.

- Home, login and estate/[estate_id] are public routes.
- Protection of private routes implemented via middleware and server actions.
- Redirects to login after JWT session expires (default is 60s) and keeps track of last previous page visited.
- Mock house images for testing located inside public/mock-images.
- Filtering and pagination are applied to estates and reserves.
- Server runs on port 3000.

### Infra-structure

Infra-structure is provided by Docker Compose. The compose.yaml file runs an image for the MongoDB database and another for the application via port 3000.

#### Ports

- 3000 - Next.js front-end server
- 8000 - Express.js back-end server
- 27017 - MongoDB database image

#### Environment variables

- MONGO_URL - connection string for database
- SALT - password hashing and safe keeping on database
- HASH_SECRET - secret for JWT tokens

## Development topics covered:

- RESTfull API architecture
- MVC and services patterns
- Middlewares
- CRUD operations
- ORM database connection
- Search filtering and pagination
- File uploading
- Password encrypting
- JWT Authentication and Authorization
- Unit testing
- Function Components
- Client Side Rendering
- Server Side Rendering
- Static Site Generation
- Public and Protected Routes
- Containerization with Docker Compose

## Technologies used:

- Express.js - back-end framework
- Next.js - front-end/full-stack framework
- Mongoose ORM - abstraction of database operations
- Bcrypt - password encryption
- Jose - JWT authentication/authorization
- Multer - file upload
- Dotenv - environment variables
- Jest - unit testing
- React - function components
- Tailwind CSS - inline CSS styling
- Docker - containerization

## Getting Started

You can either run the app from Docker Compose or run the development server directly if Node.js is installed.

### Installation

#### Via Docker Compose

1 - First make sure Docker is installed in your machine: https://docs.docker.com/get-docker/

2 - Fork and clone the application

3 - Run the following terminal command inside the root directory of the application after cloning it from GitHub.

```bash
docker compose up -d
```

This should run the MongoDB docker image on port 27017, the app docker image on port 3000 and the back-end server on port 8000 (the latter is not a docker image).

4 - Access the application via URL http://localhost:3000

#### Via Node.js 

1 - First make sure Node.js is installed in your machine: https://nodejs.org/en/download/package-manager

2 - Fork and clone the application

3 - Run the following terminal command inside the root directory of the application after cloning it from GitHub.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

This should run the MongoDB docker image on port 27017, the app server on port 3000 and the back-end server on port 8000.

4 - Access the application via URL http://localhost:3000

### Application usage

- Register a new user accessing the Login page via navbar and clicking on Sign Up.

- After being redirected to the Dashboard page, you can create your own estates with New Entry button on the right side of the estate carousel.

- Some mock estate images were provided in public/mock-images to facilitate image input when creating estates.

- Now it's possible to edit an existing estate or delete it with the yellow and red buttons of the estate card in Dashboard.

- The estate is now shown up in catalog if marked as available and can be reserved by other registered users.

- You can choose a estate in the catalog for reservation and a reserve button with a date picker will be shown in the specific estate page (if the user doesn't own the estate).

- The reserve will show in the reserve carousel in the Dashboard and can be accessed if the user wishes to cancel the reservation.

- A user can change it's username and choose a new password or delete his account in the Settings page (user is soft-deleted).

- The Home page contains the catalog with all the estates registered by all users

- Menu filter on the left side of screen filters the estates in the catalog by name, price and location.

- Logging out will remove the user session and redirect to Home.

## Next steps

