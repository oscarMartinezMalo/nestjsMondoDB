# nestjs
Nestjs Nodejs expressjs\
You have to create a .env file in your src folder Ex.
DB_CONNECT = 'Your MongoDB connection string'
TOKEN_SECRET = yourJWT

## Dependencies
#### For Validation I used Joi
* npm i @hapi/joi
Link to npm package
[joi](https://www.npmjs.com/package/@hapi/joi)   


#### To connect to Mongodb and manipulate the data  I use moongose
* npm install --save @nestjs/mongoose mongoose
* npm install --save-dev @types/mongoose

#### To encrypt the passoword bcryptjs
* npm i bcryptjs
Link to npm package
[bcryptjs](https://www.npmjs.com/package/bcryptjs)   

#### To generate the JWT
* npm i jsonwebtoken
Link to npm package
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)    

#### To store the DataBase connection and the Secrets locally was used dotenv    
* npm i dotenv
Link to npm package
[dotenv](https://www.npmjs.com/package/dotenv)