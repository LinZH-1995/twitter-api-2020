# twitter-api-2020
ALPHA Camp | 學期 3 | Simple Twitter | 自動化測試檔 (前後分離組) 

## Built With
* [VS Code](https://code.visualstudio.com/) - version 1.78.2
* [Node.js](https://nodejs.org/en/) - version 18.14.2
* [Nodemon](https://github.com/remy/nodemon) - version 2.0.22
* [Express](https://github.com/expressjs/express) - version 4.18.2
* [Method-Override](https://github.com/expressjs/method-override#readme) - version 3.0.0
* [Express-Session](https://github.com/expressjs/session#readme) - version 1.17.3
* [Dotenv](https://github.com/motdotla/dotenv#readme) - version 16.0.3
* [Mysql2](https://github.com/sidorares/node-mysql2#readme) - version 3.3.1
* [Sequelize](https://github.com/sequelize/sequelize) - version 6.31.1
* [Sequelize-Cli](https://github.com/sequelize/cli) - version 6.6.0
* [@Faker-js/Faker](https://github.com/faker-js/faker) - version 8.0.1
* [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js#readme) - version 2.4.3
* [Cross-Env](https://github.com/kentcdodds/cross-env#readme) - version 7.0.3
* [Connect-Flash](https://github.com/jaredhanson/connect-flash#readme) - version 0.1.1
* [Passport.js](https://github.com/jaredhanson/passport) - version 0.6.0
* [Passport-Local](https://github.com/jaredhanson/passport-local) - version 1.0.0
* [Passport-JWT](https://github.com/mikenicholson/passport-jwt) - version 4.0.1
* [JsonWebToken](https://github.com/auth0/node-jsonwebtoken) - version 9.0.0

## Getting Started
### Install - Use Terminal

#### 1. Copy project
```
git clone https://github.com/LinZH-1995/twitter-api-2020.git
```
#### 2. Open project directory
```
cd twitter-api-2020
```
#### 3. Install package
```
npm install
```
#### 4. Import seed data (for test feature)
```
create database ac_twitter_workspace;
```
```
npx sequelize db:migrate
```
```
npx sequelize db:seed:all
```
#### 5. Run the project
```
npm run start   // Node
```
```
npm run dev   // Nodemon
```
#### 6. Connect - [localhost](http://localhost:3000/)
```
http://localhost:3000/
```

