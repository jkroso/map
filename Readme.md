
# map

  apply a transformation to each item within an object. async options included

## Installation

_With [component](//github.com/component/component), [packin](//github.com/jkroso/packin) or [npm](//github.com/isaacs/npm)_

    $ {package mananger} install jkroso/map

then in your app:

```js
var map = require('map')
var series = require('map/series')
var async = require('map/async')
```

## API

### map(obj, fn, [ctx])

  transform each value contained in `obj` return a new `obj` with the same keys but their corresponding values replaced with the return value of `fn`

```js
map([1, 2, 3], function(value, key){
  return value + 1
}) // => [2, 3, 4]
```

### series(obj, fn, [ctx])

  as above but understands the semantics of [Result](//github.com/jkroso/result) and is able to do the correct thing in all cases. That means you can pass Results as arguments and it will unbox them before processing them or return Results from `fn` and it will wait for them to complete complete before moving to the next value in `obj`. Series returns a Result in all cases.

```js
series([1, 2, 3], function(value, key){
  return wolfram.isPrime(value)
}).then(function(result){
  // => [false, true, true]
})
```

### async(obj, fn, [ctx])

  as above but doesn't bother waiting for Results returned from `fn` to complete before processing the next item. So in the previous example you would end up with three concurrent request to wolfram.

## Running the tests

```bash
$ make
```

Then open your browser to the [test](localhost:3000/test/index.html) directory.