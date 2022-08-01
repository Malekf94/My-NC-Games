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
