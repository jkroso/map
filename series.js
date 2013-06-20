
var each = require('foreach/series').plain
  , decorate = require('when/decorate')
  , ResType = require('result-type')
  , Result = require('result')

module.exports = decorate(mapSeries)
module.exports.plain = mapSeries

/**
 * transform each item in an object by applying `fn`
 *
 * @param {Object|Array} obj
 * @param {Function} fn
 * @param {Any} [ctx]
 * @return {Promise} new `obj`
 */

function mapSeries(obj, fn, ctx){
	if (obj == null) return Result.wrap(obj)
	var newVal = typeof obj.length == 'number'
		? new Array(obj.length)
		: new Object
	
	return each(obj, function(value, key){
		var val = fn.call(ctx, value, key)
		if (val instanceof ResType) {
			return val.read(function(value){
				newVal[key] = value
			}, ignore)
		} else {
			newVal[val] = val
		}
	}).yeild(newVal)
}

function ignore(){
	// ignore errors
}