# NC-News

An API to serve a reddit-like social media website's frontend.

### Prerequisites

```
    "express": "^4.17.1",
    "knex": "^0.17.6",
    "nodemon": "^1.19.1",
    "pg": "^7.11.0"

```

### Installing

#clone the repo

```
$ git clone https://github.com/ThomasPTurner/nc-news.git
```

#Create a file in the project directory named "knexfile.js":

For ubutu users the file contents should be:

```
const ENV = process.env.NODE_ENV || 'development';
const { DB_URL } = process.env

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news',
      username : '<pg-username>',
      password : '<pg-password>'
    }
  },
  test: {
    connection: {
      database: 'nc_news_test',
      username : '<pg-username>',
      password : '<pg-password>',
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```
changing the username and password fields to the user's postgresSQL user and password.
macOS users can omit these fields completely.

This will setup your database connections.

#Run these scripts from the project directory: 

```
$ npm i
$ npm setup-dbs
$ npm seed:dev
$ npm run dev
```

This will setup the database have the server listening. The default listen port is 9090


## To run the tests:

#set up and run the tests:

Run the following commands in the project directory:

```
$ npm i -D
$ npm setup-dbs
$ npm seed:test
$ npm t
```


### Tests

These test check the served values and requested changes from the test database and the error handling of those requests.

example:
```
describe('api/topics', () => {
    describe('GET', () => {
        it('gets a list of topics', () => {
            return request
                .get('/api/topics/')
                .expect(200)
                .then(( {body: {topics}} ) => {
                    expect(topics.length).to.be.greaterThan(1);
                    expect(topics[0]).to.have.keys('slug', 'description')
                });
        });
    });
}
```
This example test checks that a valid GET request will return an array of objects with the correct keys.

## Deployment

This repo is set up to be hosted on heroku, both the application and the database. 

With the code pushed to a heroku repo and a heroku database added-on, one can check the database is linked to the repo with:

```bash
heroku config:get DATABASE_URL
```

To host elsewhere, the package.JSON script will need to be amended:
```
"seed:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex migrate:latest && NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex seed:run",
```

## Built With

* [PostgresSQL] - database interaction
* [knex] - SQL query builder

## Contributing

Feel free to contribute.

## Versioning

Version control handled by git and github.

## Authors

**Tom Turner** - [ThomasPTurner](https://github.com/ThomasPTurner/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Northcoders tutors
* members of my bootcamp cohort
