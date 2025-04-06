# Integrated Tests

## 1. Install newman

Newman is a runner for the integrated test created with postman

Execute this:

```shell
npm i newman -g
```

## 1. Launch a integrated test in a environment

to execute the integrated test in a environment (for example, in local), execute this:

NOTE: you need te application running for executing this tests locally

```shell
./test.sh LOCAL.env.json
```

And for the application deployed in cloud (render.com)

```shell
./test.sh LIVE.env.json
```
