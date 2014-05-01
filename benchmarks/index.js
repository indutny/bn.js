var assert = require('assert');
var benchmark = require('benchmark');
var bn = require('../');
var bignum = require('bignum');
var bbignum = require('browserify-bignum');

function compare(op, a, b, c) {
  var suite = new benchmark.Suite;

  console.log('Benchmarking: ' + op);
  suite
    .add('bn.js#' + op, a)
    .add('bignum#' + op, b)
    .add('browserify-bignum#' + op, c)
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('------------------------');
      console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    })
    .run();
  console.log('========================');
}

var a1 = new bn('012345678901234567890123456789012345678901234567890', 10);
var b1 = new bn('213509123601923760129376102397651203958123402314875', 10);
var a2 = new bignum('012345678901234567890123456789012345678901234567890', 10);
var b2 = new bignum('213509123601923760129376102397651203958123402314875', 10);
var a3 = new bbignum('012345678901234567890123456789012345678901234567890', 10);
var b3 = new bbignum('213509123601923760129376102397651203958123402314875', 10);
var as1 = a1.mul(a1);
var as2 = a2.mul(a2);
var as3 = a3.mul(a3);

compare('create-10', function() {
  new bn('012345678901234567890123456789012345678901234567890', 10);
}, function() {
  new bignum('012345678901234567890123456789012345678901234567890', 10);
}, function() {
  new bbignum('012345678901234567890123456789012345678901234567890', 10);
});

compare('create-hex', function() {
  new bn('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
}, function() {
  new bignum('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
}, function() {
  new bbignum('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
});

compare('add', function() {
  a1.add(b1);
}, function() {
  a2.add(b2);
}, function() {
  a3.add(b3);
});

compare('mul', function() {
  a1.mul(b1);
}, function() {
  a2.mul(b2);
}, function() {
  a3.mul(b3);
});

compare('sqr', function() {
  a1.mul(a1);
}, function() {
  a2.mul(a2);
}, function() {
  a3.mul(a3);
});

compare('div', function() {
  as1.div(a1);
}, function() {
  as2.div(a2);
}, function() {
  as3.div(a3);
});
