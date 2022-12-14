# Northcoders House of Games API

## Accessing the databases

To access the database, create two .env files for this project: '.env.test' and '.env.development'.
add PGDATABASE=nc_games to the .env.development file and
add PGDATABASE=nc_games_test to the .env.test file

## Link to hosted version

https://my-games-project.herokuapp.com/

## Project Summary

This project is about creating a database regarding boardgames and interacting with the endpoints that we have regarding their reviews, comments and users.

## Instructions on how to use the data

To fork the repo, go to my github link and click fork, after you have forked it to your device, you'll need to install the following modules:-

- Dotenv
- Express
- pg
- pg-format
  and
- supertest

For testing purposes, I have also used jest, jest-extended and jest-sorted.

Before using the data, you'll need to setup the database by running npm run setup-dbs then npm run seed

To run the tests to see that the database is functioning correctly, run:-

- npm test for both files or
- npm test utils.test.js for the utility function
  or
- npm test app.test.js for the app and server endpoints.

## Minimum node version 16.x.x and psql version 14.x required

## Adding Endpoints

### GET /api/categories

added the get /api/categories endpoint and tested it to confirm it returns the correct values

### GET /api/reviews/:review_id

added the get /api/reviews/:review_id endpoint and tested it to confirm it returns the correct values, also added tests for error handling for this endpoint

### PATCH /api/reviews/:review_id

added the patch /api/reviews/:review_id endpoint and tested it to confirm it returns the correct values, also added tests for error handling for this endpoint

### GET /api/users

added the get /api/users endpoint and tested it to confirm it returns the correct values

### GET /api/reviews/:review_id

refactored the endpoint to have the result include the key 'comment_count'

### GET /api/reviews

added the get /api/reviews endpoint and tested it to confirm it returns the correct values, also refactored the naming for controller and model for GET /api/reviews/:review_id to avoid confusion

### GET /api/reviews/:review_id/comments

added the get /api/reviews/:review_id/comments endpoint and tested it to confirm it returns the correct values, also added tests for error handling for this endpoint

### POST /api/reviews/:review_id/comments

added the post /api/reviews/:review_id/comments endpoint and tested it to confirm it returns the correct values, also added tests for error handling for this endpoint

### GET /api/reviews

Refactored the get /api/reviews endpoint to include queries for sort_by, order and category. Tested the query endpoints as well as adding and testing error handling. Added a function in models to test to see whether an input is in a given column and used that to refactor the POST /api/reviews/:review_id/comments endpoint

### DELETE /api/comments/:comment_id

added the delete /api/comments/:comment_id endpoint and tested it to confirm it returns the correct values, also added tests for error handling for this endpoint

### GET /api

added the get /api endpoint that returns a json object of all the endpoints and what they do

### Routers

Refactored the app.js file to use routers to handle the endpoint requests+

### GET /api/users/:username

added the post /api/users/:username endpoint and tested it to confirm it returns the correct values, also added tests for error handling for this endpoint
