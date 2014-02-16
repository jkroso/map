
var each = require('foreach/series').plain
var Result = require('result-type')
var lift = require('lift-result')

module.exports = lift(function(obj, fn, ctx){
  var newVal = typeof obj.length == 'number'
    ? new Array(obj.length)
    : new Object

  return each(obj, function(value, key){
    value = fn.call(this, value, key)
    if (value instanceof Result) {
      return value.read(function(value){
        newVal[key] = value
      }, ignore)
    } else {
      newVal[key] = value
    }
  }, ctx).yield(newVal)
})

function ignore(){
  // ignore errors
}
