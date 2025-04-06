# Customer Backend Typescript

- Implementation of a Customer CRUD using Typescript. 
- The target architecture will be Hexagonal architecture with DDD.
- For the deployment we will use render.com
- Documentation using Postman Documentation

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

Then, you can view the report at /coverage/lcov-report/index.html

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

You will need to set the value of the MONGO_DB_URI in .env. This value is not provided at the source code. If you need it, you can choose two options:

a) you can use your mongodb database at local (dockerized, for example) and use your MONGO_DB_URI
b) you can request me by email

If you don't want to execute the application at your local environment, you can try the application deployed at render.com [API REST at render.com](https://customer-backend-typescript.onrender.com/api)

## 6. Execute the application locally

Execute this:

```shell
npm run start
```

## 7. Check the api

You can view the api at this location:

The application is documented using Postman at this uri:

[API REST Documentation](https://documenter.getpostman.com/view/298029/2sB2cUBiTj)

## 8. Execute the integrated tests

Go to test/integratedTest folder and read the README.md

NOTE: The application has been deployed at render.com. The service will pause this application at the free plan that I am using, so be patient if the application take a few seconds to become live (50 seconds aprox)
