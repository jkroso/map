
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
	var ret
	
	// array
	if (len === +len) {
		var res = new Array(len)
		if (!len) return p.write(res)
		var pending = len
		var k = 0
		while (k < len) {
			try { ret = fn.call(ctx, obj[k], k) }
			catch (e) { return p.error(e) }
			when(ret, receiver(k++), fail)
		}
	} else {
		var res = {}
		var keys = []
		for (var k in obj) keys.push(k)
		if (!(len = keys.length)) return p.write(res)
		var pending = len
		var i = 0
		while (i < len) {
			try { ret = fn.call(ctx, obj[k = keys[i++]], k) }
			catch (e) { return p.error(e) }
			when(ret, receiver(k), fail)
		}
	}
	
	function receiver(k){
		return function(value){
			res[k] = value
			if (--pending <= 0) p.write(res)
		}
	}

	function fail(e){
		p.error(e)
	}

	return p
}