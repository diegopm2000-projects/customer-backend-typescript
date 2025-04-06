# Customer Backend Typescript

- Implementation of a Customer CRUD using Typescript. 
- The target architecture will be Hexagonal architecture with DDD.
- For the deployment we will use Serverless Framework

## 1. Install the application

Execute:

```shell
npm i
```

## 2. Pass the unit testing with coverage

Execute:

```shell
npm run coverage
```

## 3. Pass the linter

The application comes with eslint, you can check the code pass the linting using:

``` shell
npm run lint
```

## 4. Check the dependencies

For checking the used dependencies, the application uses de npm library depcheck. Execute this to check de dependencies

```shell
npm run depcheck
```

## 5. Configure locally the application

Copy env.sample to a .env file

You will need to set the value of the MONGO_DB_URI in .env

## 6. Execute the application locally

Execute this:

```shell
npm run start
```

## 7. Check the api

You can view the api at this location:




