
var series = require('../series')
var async = require('../async')
var Result = require('result')
var chai = require('./chai')
var map = require('..')

function delay(value){
	var result = new Result
	setTimeout(function () {
		if (value instanceof Error) result.error(value)
		else result.write(value)
	}, Math.random() * 10)
	return result
}

describe('map', function(){
	it('should work on arrays', function(){
		map([1,2,3], function(v,k){
			k.should.be.a('number')
			return v + 1
		}).should.eql([2,3,4])
	})

	it('should work on objects', function(){
		map({a:1, b:2, c:3}, function(v,k){
			k.should.be.a('string')
			return v + 1
		}).should.eql({a:2,b:3,c:4})
	})

	it('should call `fn` with `ctx` as `this`', function(){
		map([1,2,3], function(v, k){
			this.should.equal(Math)
			return Math.pow(v, 2)
		}, Math).should.eql([1,4,9])
	})
})

describe('series', function(){
	it('should work sequentially on arrays', function(done){
		var calls = []
		series([1,2,3], function(v, k){
			k.should.be.a('number')
			return delay(v + 1).read(function(){
				calls.push([k, v])
			})
		}).then(function(res){
			res.should.eql([2,3,4])
			calls.should.eql([
				[0,1],
				[1,2],
				[2,3]
			])
		}).node(done)
	})

	it('should work sequentially should on objects', function(done){
		var calls = []
		var delayed = []
		series({a:1,b:2,c:3}, function(v, k){
			k.should.be.a('string')
			calls.push([k, v])	
			return delay(v + 1).read(function(){
				delayed.push([k, v])
			})
		}).then(function(res){
			res.should.eql({a:2,b:3,c:4})
			calls.should.eql(delayed)
		}).node(done)
	})

	commonAsyncProperties(series)
	errorHandling(series)
})

describe('async', function(){
	commonAsyncProperties(async)
	errorHandling(async)
})


function commonAsyncProperties(map){
	it('should work on arrays', function(done){
		map([1,2,3], function(v, i){
			return delay(v + 1)
		}).then(function(arr){
			arr.should.eql([2,3,4])
		}).node(done)
	})

	it('should work on objects', function(done){
		map({a:1,b:2,c:3}, function(v, i){
			return delay(v + 1)
		}).then(function(obj){
			obj.should.eql({a:2,b:3,c:4})
		}).node(done)
	})

	it('should call `fn` with `ctx` as `this`', function(done){
		map([1,2,3], function(v, k){
			this.should.equal(Math)
			return delay()
		}, Math).node(done)
	})

	it('should handle empty arrays', function(done){
		map([], function(v, k){
			throw new Error('fail')
		}).then(function(res){
			res.should.eql([])
		}).node(done)
	})

	it('should handle empty objects', function(done){
		map({}, function(v, k){
			throw new Error('fail')
		}).then(function(res){
			res.should.eql({})
		}).node(done)
	})

	it('should handle non Result returns', function(done){
		map([1,2,3], function(v){
			return v + 1
		}).then(function(arr){
			arr.should.eql([2,3,4])
		}).node(done)
	})
}

function errorHandling(map){
	describe('error handling', function(){
		it('should catch sync errors', function(done){
			map([1,2,3], function(v, k){
				if (v == 2) throw new Error('fail')
				return delay(v + 1)
			}).then(null, function(e){
				e.message.should.equal('fail')
			}).node(done)
		})

		it('should catch async errors', function(done){
			map([1,2,3], function(v, k){
				if (v == 2) return delay(new Error('fail'))
				return delay()
			}).then(null, function(e){
				e.message.should.equal('fail')
				done()
			})
		})
	})
}