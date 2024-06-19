# News API Documentation

News API is a JavaScript-based Application Programming Interface (API) that enables users to interact with a database through a variety of HTML endpoints. This project replicates the backend structure of a real-world service like Reddit, providing requested information to the frontend architecture and allowing the ability to perform a variety of CRUD operations to the database.

## Hosted Version
I have hosted a version of this API online using Render: Cloud Application Hosting for Developers. You can view a list of endpoints which you can interact with via HTTP requests at https://news-app-mk4i.onrender.com/api. The live database is hosted separately with ElephantSQL.

## Limitations
Please note that as the API is hosted for free on Redner, it take upto a minute for the server to wake up if requests have not been made recently.

## Local Version Setup

Follow the below steps to setup the API to run locally.

### Requirements 
- [Node.js](https://nodejs.org/) v6.0.0 or higher.
- [PostgreSQL](https://www.postgresql.org/) v14.9 or higher (recommended).

### Local setup instructions

1. Clone the repository to your local machine.
2. Create a `.env.development` file at the root level with the content `PGDATABASE=nc_news`.
3. Run `npm install` to install required dependencies.
4. Run `npm setup-dbs` to initialize the databases.
5. Run `npm run seed` to seed the production database.
6. Run `npm run start` to start the API listening on port 9090.
7. You can now view a list of endpoints by making a `GET` request to http://localhost:9090/api.

### Test suite
If you wish to run the test.app.js test suite on the test data you will need to perform the following steps

1. Create a `.env.test` file at the root level with the content `PGDATABASE=nc_news_test`.
2. Run `npm install` and `npm setup-dbs` if you didn't previously.
3. Run `npm run test app.test.js`. The test suite will automatically seed the test database before each test and then end the connection 


## Key Features

- **CRUD Operations:** Includes multiple endpoints, covering Create, Read, Update, and Delete (CRUD) operations. A full list of operations is avaliable at the endpoint `GET /api` or in the `endpoints.json` file in the root level of this project.

- **RESTful Architecture:** Follows RESTful principles, allowing several HTTP methods to the same route (e.g., GET and PATCH can be used on the endpoint `/api/articles/:article_id`).

- **Database Interaction:** Uses `node-postgres` to interact with a PostgreSQL (PSQL) database.

- **Parametric Endpoints:** Several parametric endpoints that allow the user to dynamically interact with the database.

- **SQL Query Handling:** Utilizes complex SQL queries (e.g., optional WHERE clauses) while safeguarding against SQL injection.

- **Model-View-Controller Pattern:** Employs the Model-View-Controller (MVC) Pattern to help organize, maintain, and scale up the application.

- **Test Driven Development (TDD):** Developed using Test Driven Development (TDD) to ensure the reliability of all endpoints and functions.
