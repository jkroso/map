
var should = require('chai').should()
  , map = require('..')
  , series = require('../series')
  , promise = require('laissez-faire')

/**
 * delay the calling of `fn` by some random time
 */

function delay(fn){
	var self = this
	var args = [].slice.call(arguments, 1)
	setTimeout(function () {
		fn.apply(self, args)
	}, Math.random() * 10)
}

describe('map', function () {
	it('should work on arrays', function () {
		map([1,2,3], function(v,k){
			k.should.be.a('number')
			return v + 1
		}).should.deep.equal([2,3,4])
	})

	it('should work on objects', function () {
		map({a:1, b:2, c:3}, function(v,k){
			k.should.be.a('string')
			return v + 1
		}).should.deep.equal({a:2,b:3,c:4})
	})

	it('should call `fn` with `ctx` as `this`', function () {
		map([1,2,3], function(v, k){
			return this.pow(v, 2)
		}, Math).should.deep.equal([1,4,9])
	})
})

describe('series', function () {
	it('should work on arrays', function (done) {
		var calls = []
		series([1,2,3], function(v,k,next){
			calls.push([k, v])
			delay(next, null, v + 1)
		}).then(function(res){
			res.should.deep.equal([2,3,4])
			calls.should.deep.equal([
				[0,1],
				[1,2],
				[2,3]
			])
		}).node(done)
	})

	it('should work on objects', function (done) {
		var calls = []
		series({a:1,b:2,c:3}, function(v,k,next){
			k.should.be.a('string')
			calls.push([k, v])
			delay(next, null, v + 1)
		}).then(function(res){
			res.should.deep.equal({a:2,b:3,c:4})
			calls.sort(function(a,b){
				return a[0] > b[0]
			}).should.deep.equal([
				['a',1],
				['b',2],
				['c',3]
			])
		}).node(done)
	})

	it('should call `fn` with `ctx` as `this`', function (done) {
		series([1,2,3], function(v, k, next){
			this.should.equal(Math)
			next()
		}, Math).node(done)
	})

	it('should handle empty input', function (done) {
		series([], function(v,k,next){
			throw new Error('fail')
		}).then(function(res){
			res.should.deep.equal([])
		}).node(done)
	})

	describe('error handling', function () {
		it('should catch sync errors', function (done) {
			series([1,2,3], function(v, k, next){
				if (v == 2) throw new Error('fail')
				delay(next, null, v + 1)
			}).otherwise(function(e){
				e.message.should.equal('fail')
				done()
			})
		})

		it('should catch async errors', function (done) {
			series([1,2,3], function(v, k, next){
				delay(next, v == 2 ? new Error('fail') : null, v + 1)
			}).otherwise(function(e){
				e.message.should.equal('fail')
				done()
			})
		})
	})

	describe('promise API', function () {
		it('should work on arrays', function (done) {
			var calls = []
			series([1,2,3], function(v,k){
				calls.push([k, v])
				return promise(function(fulfill){
					delay(fulfill, v + 1)
				})
			}).then(function(res){
				res.should.deep.equal([2,3,4])
				calls.should.deep.equal([
					[0,1],
					[1,2],
					[2,3]
				])
			}).node(done)
		})

		it('should handle empty input', function (done) {
			series([], function(){
				throw new Error('fail')
			}).then(function(res){
				res.should.deep.equal([])
			}).node(done)
		})
	})
})
