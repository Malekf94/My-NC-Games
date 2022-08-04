# Northcoders House of Games API

## Accessing the databases

To access the database, create two .env files for this project: '.env.test' and '.env.development'.
add PGDATABASE=nc_games to the .env.development file and
add PGDATABASE=nc_games_test to the .env.test file

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
