# AWS Lambda Local Middleware

> Lambda Custom Authorizer Middleware for using with AWS Serverless Express and Serverless Offline plugins

[![npm](https://img.shields.io/npm/v/lambda-custom-authorizer-middleware.svg?maxAge=2592000)](https://www.npmjs.com/package/lambda-custom-authorizer-middleware)
[![npm](https://img.shields.io/npm/dm/lambda-custom-authorizer-middleware.svg?maxAge=2592000)](https://github.com/vladgolubev/lambda-custom-authorizer-middleware)

## Purpose

Let's say you are using [aws-serverless-express](https://github.com/awslabs/aws-serverless-express).
Cool, you can write lambdas responding to API Gateway using favorite [express](https://github.com/expressjs/express).

Let's say you are using [serverless-offline](https://github.com/dherault/serverless-offline) to simulate API Gateway for
local development. Cool, now you can invoke your lambdas locally.

Let's say you have custom lambda authorizers defined in your `serverless.yml` file like that:

```yml
  restAP:
    handler: lib/handlers/rest-api.handler
    events:
      - http:
          path: v1/{id}/create
          method: put
          integration: lambda-proxy
          authorizer:
            arn: arn:aws:lambda:us-east-1:123456789:function:myAuthorizerFunction
            resultTtlInSeconds: 0
```

Pretty soon you find [this issue](https://github.com/dherault/serverless-offline/issues/118) saying you cannot use custom non-local authorizers.

And here it comes. With this package you can provide path on local file system to your custom authorizer function which isn't required to be inside the project.

## Install

```sh
$ yarn add lambda-custom-authorizer-middleware
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### customLocalLambdaAuthorizer

[src/index.js:36-78](https://github.com/vladgolubev/lambda-custom-authorizer-middleware/blob/a53b31eba50e2721d173dec77f593122f0bdf72f/src/index.js#L36-L78 "Source code on GitHub")

Express middleware function constructor to execute local lambda function
as a custom authorizer and attach request context to `req` object
as `req.apiGateway.event.requestContext.authorizer` (as for usage with `aws-serverless-exporess` npm package)

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Configuration object (optional, default `{}`)
    -   `options.identitySourceHeader` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Name of HTTP header where auth token is located (optional, default `authorization`)
    -   `options.localAuthorizer` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Local authorizer function configuration object (optional, default `{}`)
        -   `options.localAuthorizer.handlerPath` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Path on local file system to the function
        -   `options.localAuthorizer.handlerName` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Name of the exported function in provided path
        -   `options.handlerPath`
        -   `options.handlerName`

**Examples**

```javascript
import express from 'express';
import awsSlsExpressMiddleware from 'aws-serverless-express/middleware';
import {customLocalLambdaAuthorizer} from 'lambda-custom-authorizer-middleware';

const app = express();

app.use(awsSlsExpressMiddleware.eventContext());
app.use(customLocalLambdaAuthorizer({ // Make sure to add after 'awsSlsExpressMiddleware'
 localAuthorizer: {
   handlerPath: '../other-project/lambda/auth',
   handlerName: 'handler'
 }
}));

app.get('/', (req, res) => res.json(req.apiGateway.event.requestContext.authorizer));
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** Throws when config is not provided

Returns **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Express middleware function. Works only when IS_OFFLINE env var is set.

## Development

### Debug

This package uses [debug](https://github.com/visionmedia/debug) library,
so set environment variable like that to see the logs.

```sh
DEBUG=lambda-custom-authorizer-middleware:*
```

### Lint

```sh
$ yarn lint
```

### Build

```sh
$ yarn build
```

### Docs

```sh
$ yarn docs
```

### Tests

```sh
$ yarn test
```

### Coverage

```sh
$ yarn coverage
```
