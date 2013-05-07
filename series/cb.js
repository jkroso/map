
var Promise = require('laissez-faire/full')

/**
 * transform each item in an object using a callback
 * accepting function
 *
 * @param {Object|Array} obj
 * @param {Function} fn
 * @param {Any} [ctx]
 * @return {Promise} new `obj`
 */

module.exports = function(obj, fn, ctx){
	var p = new Promise
	if (obj == null) return p.fulfill(obj)
	var len = obj.length

	// array
	if (len === +len) {
		var res = new Array(len)
		if (!len) return p.fulfill(res)
		var k = 0
		var next = function(e, value){
			if (e) return p.reject(e)
			res[k++] = value
			if (k >= len) p.fulfill(res)
			else run(k)
		}
	} 

	// object
	else {
		var res = {}
		var keys = []
		for (var k in obj) keys.push(k)
		if (!(len = keys.length)) return p.fulfill(res)
		var i = 0
		k = keys[0]
		var next = function next(e, value){
			if (e) return p.reject(e)
			res[k] = value
			if (++i >= len) p.fulfill(res)
			else run(k = keys[i])
		}
	}

	function run(k){
		try { fn.call(ctx, obj[k], k, next) }
		catch (e) { p.reject(e) }
	}

	run(k)

	return p
}