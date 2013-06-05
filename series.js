
var Promise = require('laissez-faire/full')
var when = require('when/read')

/**
 * transform each item in an object by applying `fn`
 *
 * @param {Object|Array} obj
 * @param {Function} fn
 * @param {Any} [ctx]
 * @return {Promise} new `obj`
 */

module.exports = function(obj, fn, ctx){
	var p = new Promise
	if (obj == null) return p.write(obj)
	var len = obj.length
	
	// array
	if (len === +len) {
		var res = new Array(len)
		if (!len) return p.write(res)
		var k = 0
		var done = function(value){
			res[k++] = value
			if (k >= len) p.write(res)
			else run(k)
		}
	} else {
		var res = {}
		var keys = []
		for (var k in obj) keys.push(k)
		if (!(len = keys.length)) return p.write(res)
		var i = 0
		k = keys[0]
		var done = function(value){
			res[k] = value
			if (++i >= len) p.write(res)
			else run(k = keys[i])
		}
	}

	function fail(e){
		p.error(e)
	}
	
	function run(k){
		try { k = fn.call(ctx, obj[k], k) }
		catch (e) { return p.error(e) }
		when(k, done, fail)
	}

	run(k)

	return p
}