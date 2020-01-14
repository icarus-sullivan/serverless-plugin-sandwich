![npm downloads total](https://img.shields.io/npm/dt/serverless-plugin-sandwich.svg) ![npm version](https://img.shields.io/npm/v/serverless-plugin-sandwich.svg) ![npm license](https://img.shields.io/npm/l/serverless-plugin-sandwich.svg)

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
The function will be called inline, and not be tied to the original handler code. However, proper error handling needs to be taking into consideratioin.

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
Higher-order-functions that curry another function can be useful for validating and extracting Authorization tokens. It could also be used for logging or other boilerplate code that needs to be done before a lambda is called. 

```yaml
functions:
    handler: src/original.default
    sandwich:
        before:
            handler: src/extractData.default
            wrap: true
```

Example Wrapper:
```javascript
module.exports.default = (fn) => async (event, context) => {
    try {
        const token = event.headers.Authorization.replace(/bearer /gi, '');
        const decoded = jwt.verifytoken, process.env.SALT);
        return await fn(decoded, context);
    } catch (e) {
        return {
            statusCode: '401',
            body: 'Unauthorized',
        };
    }
}
```

## Commands
##### `sandwich order`

Running the order command will fulfill your serverless lambda generation and output it to a `sandwich` directory:
```sh
$ npx serverless sandwich order
```

