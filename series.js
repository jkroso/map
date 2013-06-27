
var each = require('foreach/series').plain
  , decorate = require('when/decorate')
  , Result = require('result-type')

module.exports = decorate(mapSeries)
module.exports.plain = mapSeries

function mapSeries(obj, fn, ctx){
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
	}, ctx).yeild(newVal)
}

function ignore(){
	// ignore errors
}