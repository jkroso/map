
var decorate = require('when/decorate')
  , ResType = require('result-type')
  , Result = require('result')
  , each = require('foreach')

module.exports = decorate(parallelMap)
module.exports.plain = parallelMap

/**
 * transform each item in an object by applying `fn`
 *
 * @param {Object|Array} obj
 * @param {Function} fn
 * @param {Any} [ctx]
 * @return {Result} new `obj`
 */

function parallelMap(obj, fn, ctx){
	if (obj == null) return Result.wrap(obj)
	var newObj = new obj.constructor
	var result = new Result
	var done = false
	var pending = 0

	function fail(e){
		result.error(e)
	}

	each(obj, function(value, key){
		try { var val = fn.call(ctx, value, key) }
		catch (e) { return result.error(e) }
		if (val instanceof ResType) {
			pending++
			val.read(function(value){
				newObj[key] = value
				if (--pending === 0 && done) {
					result.write(newObj)
				}
			}, fail)
		} else {
			newObj[key] = value
		}
	})
	
	if (pending === 0) result.write(newObj)
	else done = true

	return result
}