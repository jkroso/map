
var ResultType = require('result-type')
var lift = require('lift-result')
var Result = require('result')
var each = require('foreach')

module.exports = lift(function(obj, fn, ctx){
  var newVal = typeof obj.length == 'number'
    ? new Array(obj.length)
    : new Object
  var result = new Result
  var done = false
  var pending = 0

  function fail(e){
    result.error(e)
  }

  each(obj, function(value, key){
    try { value = fn.call(ctx, value, key) }
    catch (e) { return result.error(e) }
    if (value instanceof ResultType) {
      pending++
      value.read(function(value){
        newVal[key] = value
        if (--pending === 0 && done) {
          result.write(newVal)
        }
      }, fail)
    } else {
      newVal[key] = value
    }
  })

  if (pending === 0) result.write(newVal)
  else done = true

  return result
})
