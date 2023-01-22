# Storefront Backend Project

This is an ecommerce API through which users can be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page and complete purchases of products in the cart.

## Tech Stack
- Nodejs/Express
- PostgreSQL

## Packages 
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing
- joi from npm for input validations
- bcrypt from npm for password hashing
- http-status-codes for response status codes

## Usage
Rename .env .example to .env and fill all values.

Run `docker-compose up -d --build` in your terminal. You will need to install [docker](https://docs.docker.com/engine/install/) if you haven't. 

The port on which the development database runs is the value specified in .env as DEV_DB_PORT. Use the credentials DEV_DB_USER and DEV_DB_PASS specified in the .env file to login to the development database.

The port on which the testing database runs value specified in .env as TEST_DB_PORT. Use the credentials TEST_DB_USER and TEST_DB_PASS specified in the .env file to login to the test database.

Both the test and development databases are automatically created when you build the docker image.

Alternatively, you can install [postgresql](https://www.postgresql.org/download/) and setup the database on your machine. This way you won't have to use `docker-compose` to connect to the database;

If you use a local postgresql server on your machine, you will have to create two databases with the same names for the TEST_DB and DEV_DB values specified in the .env file with usernames and passwords matching TEST_DB_USER, TEST_DB_PASS for test and DEV_DB_USER, DEV_DB_PASS for development.

Caveat:

Docker only initalizes the database once on the first build. If you change your database credentials after the first build, the old credentials will still apply. You will have to remove the volume and rebuild the image. One possible solution is to stop the running container, use `docker volume prune` to remove the old unassociated volume and rebuild the image.

Start the server with any of the start scripts below. The server port is the value set DEV_SERVER_PORT when NODE_ENV is set to dev and TESTS_SERVER_PORT when NODE_ENV is set to test. If NODE_ENV is not specified, the server port defaults to 5000. 
### Scripts
- yarn / yarn install: install the required packages
- yarn run start: compile the code and start the server with javascript code
- yarn run devStart: start the server with typescript code
- yarn run watch: compile the code, launch the server with javacript code and watch for changes
- yarn run build / yarn run tsc: compile the typescript into javascript
- yarn run jasmine: run the tests
- yarn run test: compile the typescript and run the tests
- yarn run prettier: format the code
- yarn run lint: lint the code for errors

### API 
API base route: /storefront/api/v1
| ROUTE   |      VERB      |  ACTION | REQUIRES TOKEN|
|:--------|:---------------|:--------|:--------------|
| /auth/?password='admin password here' |  GET | returns a token |
| /users |  GET | returns all users | True |
| /users/:id |  GET | returns user with id | True |
| /users |  POST | creates and returns a user | True |
| /categories |  GET | returns all categories |  
| /categories |  POST | creates and returns a category |
| /products |  GET | returns all products |
| /products/:id |  GET | returns product with id |
| /products |  POST | creates and returns a products | True |
| /products/categories/:category |  GET | returns products with category |
| /orders |  POST | creates and returns an order or multiple orders | 
| /orders/complete-order |  POST | completes and returns an order or multiple orders | 
| /orders/:userId/complete |  GET | returns completed orders by userId |
| /orders/:userId/active |  GET | returns active orders by userId |

See <a href="https://documenter.getpostman.com/view/19061740/2s8Z76wUwr#fc915d21-0fa5-4fc8-a8d5-4388b36ac118" target="_blank">postman documentation</a>
