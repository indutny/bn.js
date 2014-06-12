var assert = require('assert');
var benchmark = require('benchmark');
var bn = require('../');
var bignum = require('bignum');
var bbignum = require('browserify-bignum');
var sjcl = require('eccjs').sjcl.bn;
var bigi = require('bigi')
var BigInteger = require('./libs/BigInteger.js');

var benchmarks = [];

function add(op, a, b, c, d, e, f) {
  benchmarks.push({
    name: op,
    start: function start() {
      var suite = new benchmark.Suite;

      console.log('Benchmarking: ' + op);
      suite

      if (a)
        suite.add('bn.js#' + op, a)

      if (b)
        suite.add('bignum#' + op, b)

      if (c)
        suite.add('browserify-bignum#' + op, c)

      if (d)
        suite.add('bigi#' + op, d)

      if (e)
        suite.add('sjcl#' + op, e)

      if (f)
        suite.add('BigInteger#' + op, f);

      suite
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
  });
}

function start() {
  var re = process.argv[2] ? new RegExp(process.argv[2], 'i') : /./;

  benchmarks.filter(function(b) {
    return re.test(b.name);
  }).forEach(function(b) {
    b.start();
  });
}

benchmark.options.minTime = 1

var a1 = new bn('012345678901234567890123456789012345678901234567890', 10);
var b1 = new bn('213509123601923760129376102397651203958123402314875', 10);

var a2 = new bignum('012345678901234567890123456789012345678901234567890', 10);
var b2 = new bignum('213509123601923760129376102397651203958123402314875', 10);

var a3 = new bbignum('012345678901234567890123456789012345678901234567890', 10);
var b3 = new bbignum('213509123601923760129376102397651203958123402314875', 10);

var a4 = new bigi('012345678901234567890123456789012345678901234567890', 10);
var b4 = new bigi('213509123601923760129376102397651203958123402314875', 10);

var a5 = new sjcl(a1.toString(16));
var b5 = new sjcl(b1.toString(16));

var a6 = new BigInteger('012345678901234567890123456789012345678901234567890', 10);
var b6 = new BigInteger('213509123601923760129376102397651203958123402314875', 10);

var as1 = a1.mul(a1).iaddn(0xdeadbeef);
var as2 = a2.mul(a2).add(0xdeadbeef);
var as3 = a3.mul(a3).add(0xdeadbeef);
var as4 = a4.multiply(a4).add(bigi.valueOf(0xdeadbeef));
var as5 = a5.mul(a5).add(0xdeadbeef);
var as6 = a6.multiply(a6).add(new BigInteger('deadbeef', 16));

add('create-10', function() {
  new bn('012345678901234567890123456789012345678901234567890', 10);
}, function() {
  new bignum('012345678901234567890123456789012345678901234567890', 10);
}, function() {
  new bbignum('012345678901234567890123456789012345678901234567890', 10);
}, function() {
  new bigi('012345678901234567890123456789012345678901234567890', 10);
},
null,
function() {
  new BigInteger('012345678901234567890123456789012345678901234567890', 10);
});

add('create-hex', function() {
  new bn('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
}, function() {
  new bignum('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
}, function() {
  new bbignum('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
}, function() {
  new bigi('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
}, function() {
  new sjcl('01234567890abcdef01234567890abcdef01234567890abcdef');
}, function() {
  new BigInteger('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
});

add('toString-10', function() {
  a1.toString(10);
}, function() {
  a2.toString(10);
}, function() {
  a3.toString(10);
}, function() {
  a4.toString(10);
},
null,
function() {
  a6.toString(10);
});

add('toString-hex', function() {
  a1.toString(16);
}, function() {
  a2.toString(16);
}, function() {
  a3.toString(16);
}, function() {
  a4.toString(16);
}, function() {
  a5.toString(16)
}, function() {
  a6.toString(16)
});

add('add', function() {
  a1.add(b1);
}, function() {
  a2.add(b2);
}, function() {
  a3.add(b3);
}, function() {
  a4.add(b4);
}, function() {
  a5.add(b5);
}, function() {
  a6.add(b6);
});

add('mul', function() {
  a1.mul(b1);
}, function() {
  a2.mul(b2);
}, function() {
  a3.mul(b3);
}, function() {
  a4.multiply(b4);
}, function() {
  a5.mul(b5);
}, function() {
  a6.multiply(b6);
});

add('sqr', function() {
  a1.mul(a1);
}, function() {
  a2.mul(a2);
}, function() {
  a3.mul(a3);
}, function() {
  a4.square();
}, function() {
  a5.mul(a5);
}, function() {
  a6.multiply(a6);
});

add('div', function() {
  as1.div(a1);
}, function() {
  as2.div(a2);
}, function() {
  as3.div(a3);
}, function() {
  as4.divide(a4);
},
null,
function() {
  as6.divide(a6);
});

add('mod', function() {
  as1.mod(a1);
}, function() {
  as2.mod(a2);
}, function() {
  as3.mod(a3);
}, function() {
  as4.mod(a4);
}, null, function () {
  var remainder = as6.remainder(a6);
  return remainder.compareTo(BigInteger.ZERO) < 0 ? remainder.add(a6) : remainder;
});

var am1 = a1.toRed(bn.red('k256'));
var am5 = new sjcl.prime.p256k(a5);

add('mul-mod k256', function() {
  am1.redSqr();
}, false, false, false, function() {
  am5.square().fullReduce();
});

var pow1 = am1.fromRed();
var prime1 = new bignum(
  'fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f',
  16);
var prime4 = new bigi(
  'fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f',
  16);
var prime5 = new sjcl(
  'fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f');

add('pow k256', function() {
  am1.redPow(pow1);
}, function() {
  a2.powm(a2, prime1);
}, false, false, false);

add('invm k256', function() {
  am1.redInvm();
}, false, false, false, function() {
  am5.inverseMod(prime5);
});

start();
