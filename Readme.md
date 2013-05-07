
# map

  apply a transformation to each item within an object

## Getting Started

_With component_  

	$ component install jkroso/map

_With npm_  

	$ npm install --save https://github.com/jkroso/map/archive/master.tar.gz


then in your app:

```js
var map = require('map')
```

## API

- [map()](#map)
- [series()](#series)

### map(obj:Object, fn:Function, [ctx]:Object)

  transform each value contained in `obj` return a new `obj` with the same keys but their corresponding values replaced with the return value of `fn`

```js
map([1, 2, 3], function(value, key){
  return value + 1
}) // => [2, 3, 4]
```

### series(obj:Object, fn:Function, [ctx]:Object)

  the same as map but `fn` is allowed to do its operation asynchronously. Also the since the result of `series` can't simple be returned it is represented by a promise proxy. You are free to use continuation passing style (CPS) in your `fn` though; `series` guesses at the API your expecting and usually just does the right thing.

```js
series([1, 2, 3], function(value, key, done){
  wolfram.isPrime(value, done)
}).then(function(result){
  // => [false, true, true]
})
```

## Running the tests

```bash
$ npm install
$ make
```
Then open your browser to the `./test` directory.

_Note: these commands don't work on windows._ 

## License 

[MIT](License)