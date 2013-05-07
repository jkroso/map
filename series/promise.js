
var Promise = require('laissez-faire/full')
  , when = require('when/read')

/**
 * transform each item in an object using a promise 
 * returning or synchronous function
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
		var done = function(value){
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
		var done = function(value){
			res[k] = value
			if (++i >= len) p.fulfill(res)
			else run(k = keys[i])
		}
	}

	function fail(e){
		p.reject(e)
	}
	
	function run(k){
		try { when(fn.call(ctx, obj[k], k), done, fail) }
		catch (e) { p.reject(e) }
	}

	run(k)

	return p
}