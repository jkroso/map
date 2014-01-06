
/**
 * transform each value contained in `obj`
 * return a new `obj`
 *
 * @param {Object} obj
 * @param {Function} fn
 * @param {Object} [ctx]
 */

module.exports = function(obj, fn, ctx) {
  if (obj == null) return obj
  var len = obj.length
  // array
  if (typeof len == 'number') {
    var res = new Array(len)
    for (var k = 0; k < len; k++) {
      res[k] = fn.call(ctx, obj[k], k)
    }
  } else {
    var res = {}
    for (var k in obj) {
      res[k] = fn.call(ctx, obj[k], k)
    }
  }
  return res
}
