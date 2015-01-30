var request = require('supertest');
var HttpContext = require('../lib/http-context');
var SharedMethod = require('../lib/shared-method');
var expect = require('chai').expect;

describe('HttpContext', function () {
  beforeEach(function () {
    var test = this;
  });
  describe('ctx.args', function () {

    describe('arguments with a defined type (not any)', function () {
      it('should include a named string arg', givenMethodExpectArg({
        type: 'string',
        input: 'foobar',
        expectedValue: 'foobar'
      }));
      it('should coerce integer strings into actual numbers', givenMethodExpectArg({
        type: 'number',
        input: '123456',
        expectedValue: 123456
      }));
      it('should coerce float strings into actual numbers', givenMethodExpectArg({
        type: 'number',
        input: '0.123456',
        expectedValue: 0.123456
      }));

      // NEEDS DISCUSSION: this test fails...
      // not sure what we should do here - add an option to accept "null" as `null`?
      // it('should coerce null strings into null', givenMethodExpectArg({
      //   type: 'string',
      //   input: 'null',
      //   expectedValue: null
      // }));
    });

    describe('arguments without a defined type (or any)', function () {
      it('should coerce boolean strings into actual booleans', givenMethodExpectArg({
        type: 'any',
        input: 'true',
        expectedValue: true
      }));
      it('should coerce integer strings into actual numbers', givenMethodExpectArg({
        type: 'any',
        input: '123456',
        expectedValue: 123456
      }));
      it('should coerce float strings into actual numbers', givenMethodExpectArg({
        type: 'any',
        input: '0.123456',
        expectedValue: 0.123456
      }));
      it('should coerce null strings into null', givenMethodExpectArg({
        type: 'any',
        input: 'null',
        expectedValue: null
      }));
    });
  });
});

function givenMethodExpectArg(options) {
  return function(done) {
    var method = createMethod(options.type);
    var app = require('express')();
    
    app.get('/', function(req, res) {
      var ctx = new HttpContext(req, res, method);
      try {
        expect(ctx.args.testArg).to.equal(options.expectedValue);
      } catch(e) {
        return done(e);
      }
      done();
    });

    request(app).get('/?testArg=' + options.input).end();
  }
}


function createMethod(type) {
  return new SharedMethod(noop, 'testMethod', noop, {
    accepts: [{arg: 'testArg', type: type}]
  });
}

function noop(){};
