![npm downloads total](https://img.shields.io/npm/dt/serverless-plugin-sandwich.svg) ![npm version](https://img.shields.io/npm/v/serverless-plugin-sandwich.svg) ![npm license](https://img.shields.io/npm/l/serverless-plugin-sandwich.svg)

![header](https://raw.githubusercontent.com/icarus-sullivan/serverless-plugin-sandwich/master/header.png)

# Installation

```sh
npm install -D serverless-plugin-sandwich
```
or
```sh
yarn add -D serverless-plugin-sandwich
```

# Usage

## Plugin Dependency

In your projects serverless file, add `serverless-plugin-sandwich` to the list of your plugins:

```yaml
plugins:
  - serverless-plugin-sandwich
```

## Custom Declaration
##### `inline`
The function will be called inline, and not be tied to the original handler code. However, proper error handling needs to be taken into consideratioin.

```yaml
functions:
  handler: src/original.default
  sandwich:
    before:
      handler: src/runFirst.default
      inline: true
```

Shorthand notation defaults to inline, and is declared the following way. 

```yaml
functions:
  handler: src/original.default
  sandwich:
    before: src/runFirst.default
    after: src/runAfter.default
```

##### `pipe`
The previous function pipes its output to the next function. Note, only one argument can be piped from function to function. 

```yaml
functions:
  handler: src/original.default
  sandwich:
    before:
      handler: src/extractData.default
      pipe: true
```

##### `wrap`
Higher-order-functions, that curry another function, can be useful for validating and extracting Authorization tokens. It could also be used for logging, or other boilerplate code that needs to be done before a lambda is called. 

```yaml
functions:
  handler: src/original.default
  sandwich:
    before:
      handler: src/extractData.default
      wrap: true
```

## Code Generation
Sandwich dynamically changes the handler src path, and generates code for you. A defition like this:
```yaml
functions:
  protected:
    handler: lambdas/wrapped/handler.default
    timeout: 30
    sandwich:
      before: 
        handler: lambdas/wrapped/authenticate.default
        wrap: true
      after: 
        handler: lambdas/wrapped/apiResponse.default
        pipe: true
```

Would Generate:
```javascript
const before = require('../lambdas/wrapped/authenticate').default;
const handler = require('../lambdas/wrapped/handler').default;
const after = require('../lambdas/wrapped/apiResponse').default;

module.exports.default = async (event, context) => {

  const response = await before(async (e, c) => after(await handler(e, c)))(event, context);

  return response;
};
```

## Commands
##### `sandwich order`

Running the order command will fulfill your serverless lambda generation and output it to a `sandwich` directory:
```sh
$ npx serverless sandwich order
```

## Get Involved
Looking to add support for Python or other runtimes, if you would like to get involved open an issues. 
