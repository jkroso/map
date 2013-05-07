
var cb = require('./cb')
  , promise = require('./promise')

/**
 * Dispatch to the appropriate API
 */

module.exports = function(obj, fn, ctx){
	return fn.length > 2
		? cb(obj, fn, ctx)
		: promise(obj, fn, ctx)
}