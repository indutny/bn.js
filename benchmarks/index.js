var assert = require('assert');
var benchmark = require('benchmark');
var bn = require('../');
var bignum = require('bignum');
var bbignum = require('browserify-bignum');
var sjcl = require('eccjs').sjcl.bn;
var bigi = require('bigi');
var BigInteger = require('js-big-integer').BigInteger;
var NodeBigInteger = require('node-biginteger');
var SilentMattBigInteger = require('biginteger').BigInteger;
var PeterolsonBigInteger = require('big-integer');
var DefunctzombieBigInt = require('int');
var benchmarks = [];

if (typeof bignum === "object") {
  // browser
  bignum = bbignum;
  benchmark = Benchmark;
  process = {
    argv: ["", "", "", "fast"]
  };
}

bbignum.config({
  DECIMAL_PLACES: 0,
  ROUNDING_MODE: 1,
  EXPONENTIAL_AT: 1048576
});

function add(op, obj) {
  benchmarks.push({
    name: op,
    start: function start(callback) {
      var suite = new benchmark.Suite;

      console.log('Benchmarking: ' + op);

      Object.keys(obj).forEach(function(name) {
        suite.add(name + '#' + op, obj[name]);
      });

      suite
        .on('cycle', function(event) {
          console.log(String(event.target));
        })
        .on('complete', function() {
          console.log('------------------------');
          console.log('Fastest is ' + this.filter('fastest').pluck('name'));
          console.log('========================');
          callback();
        })
        .run({
          async: true
        });
    }
  });
}

function start() {
  var re = process.argv[2] ? new RegExp(process.argv[2], 'i') : /./;

  var index = -1;
  var startNextAfterTimeout = function() {
    setTimeout(startNext, 0);
  };
  var startNext = function() {
    while (++index < benchmarks.length) {
      var b = benchmarks[index];
      if (re.test(b.name)) {
        return b.start(startNextAfterTimeout);
      }
    }
  };
  startNextAfterTimeout();
}

if (/fast/i.test(process.argv[3])) {
  console.log('Running in fast mode...');
  benchmark.options.minTime = 0.3;
  benchmark.options.maxTime = 1;
  benchmark.options.minSamples = 3;
} else {
  benchmark.options.minTime = 1;
}

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

var a7 = NodeBigInteger.fromString('012345678901234567890123456789012345678901234567890', 10);
var b7 = NodeBigInteger.fromString('213509123601923760129376102397651203958123402314875', 10);

var a8 = SilentMattBigInteger.parse('012345678901234567890123456789012345678901234567890', 10);
var b8 = SilentMattBigInteger.parse('213509123601923760129376102397651203958123402314875', 10);

var a9 = new PeterolsonBigInteger('012345678901234567890123456789012345678901234567890', 10);
var b9 = new PeterolsonBigInteger('213509123601923760129376102397651203958123402314875', 10);

var a10 = new DefunctzombieBigInt('012345678901234567890123456789012345678901234567890');
var b10 = new DefunctzombieBigInt('213509123601923760129376102397651203958123402314875');

var as1 = a1.mul(a1).iaddn(0xdeadbeef);
var as2 = a2.mul(a2).add(0xdeadbeef);
var as3 = a3.mul(a3).add(0xdeadbeef);
var as4 = a4.multiply(a4).add(bigi.valueOf(0xdeadbeef));
var as5 = a5.mul(a5).add(0xdeadbeef);
var as6 = a6.multiply(a6).add(new BigInteger('deadbeef', 16));
var as7 = a7.multiply(a7).add(NodeBigInteger.fromString('deadbeef', 16));
var as8 = a8.multiply(a8).add(SilentMattBigInteger.parse('deadbeef', 16));
var as9 = a9.multiply(a9).add(new PeterolsonBigInteger('deadbeef', 16));
var as10 = a10.mul(a10).add(new DefunctzombieBigInt((0xdeadbeef).toString(10)));

add('create-10', {
  'bn.js': function() {
    new bn('012345678901234567890123456789012345678901234567890', 10);
  },
  'bignum': function() {
    new bignum('012345678901234567890123456789012345678901234567890', 10);
  },
  'browserify-bignum': function() {
    new bbignum('012345678901234567890123456789012345678901234567890', 10);
  },
  'bigi': function() {
    new bigi('012345678901234567890123456789012345678901234567890', 10);
  },
  'yaffle': function() {
    new BigInteger('012345678901234567890123456789012345678901234567890', 10);
  },
  'node-biginteger': function() {
    NodeBigInteger.fromString('012345678901234567890123456789012345678901234567890', 10);
  },
  'silentmatt-biginteger': function() {
    SilentMattBigInteger.parse('012345678901234567890123456789012345678901234567890', 10);
  },
  'peterolson/BigInteger.js': function () {
    new PeterolsonBigInteger('012345678901234567890123456789012345678901234567890', 10);
  },
  'defunctzombie/int': function () {
    new DefunctzombieBigInt('012345678901234567890123456789012345678901234567890');  
  }
});

add('create-hex', {
  'bn.js': function() {
    new bn('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  },
  'bignum': function() {
    new bignum('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  },
  'browserify-bignum': function() {
    new bbignum('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  },
  'bigi': function() {
    new bigi('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  },
  'sjcl': function() {
    new sjcl('01234567890abcdef01234567890abcdef01234567890abcdef');
  },
  'yaffle': function() {
    new BigInteger('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  },
  'node-biginteger': function() {
    NodeBigInteger.fromString('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  },
  'silentmatt-biginteger': function() {
    SilentMattBigInteger.parse('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  },
  'peterolson/BigInteger.js': function () {
    new PeterolsonBigInteger('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  }
});

add('toString-10', {
  'bn.js': function() {
  a1.toString(10);
  },
  'bignum': function() {
    a2.toString(10);
  },
  'browserify-bignum': function() {
    a3.toString(10);
  },
  'bigi': function() {
    a4.toString(10);
  },
  'yaffle': function() {
    a6.toString(10);
  },
  'node-biginteger': function() {
    a7.toString(10);
  },
  'silentmatt-biginteger': function() {
    a8.toString(10);
  },
  'peterolson/BigInteger.js': function () {
    a9.toString(10);
  },
  'defunctzombie/int': function () {
    a10.toString(10);
  }
});

add('toString-hex', {
  'bn.js': function() {
    a1.toString(16);
  },
  'bignum': function() {
    a2.toString(16);
  },
  'browserify-bignum': function() {
    a3.toString(16);
  },
  'bigi': function() {
    a4.toString(16);
  },
  'sjcl': function() {
    a5.toString(16)
  },
  'yaffle': function() {
    a6.toString(16)
  },
  'node-biginteger': function() {
    a7.toString(16);
  },
  'silentmatt-biginteger': function() {
    a8.toString(16);
  },
  'peterolson/BigInteger.js': function () {
    a9.toString(16);
  },
  'defunctzombie/int': function () {
    a10.toString(16);
  }
});

add('add', {
  'bn.js': function() {
    a1.add(b1);
  },
  'bignum': function() {
    a2.add(b2);
  },
  'browserify-bignum': function() {
    a3.add(b3);
  },
  'bigi': function() {
    a4.add(b4);
  },
  'sjcl': function() {
    a5.add(b5);
  },
  'yaffle': function() {
    a6.add(b6);
  },
  'node-biginteger': function() {
    a7.add(b7);
  },
  'silentmatt-biginteger': function() {
    a8.add(b8);
  },
  'peterolson/BigInteger.js': function () {
    a9.add(b9);
  },
  'defunctzombie/int': function () {
    a10.add(b10);
  }
});

add('mul', {
  'bn.js': function() {
    a1.mul(b1);
  },
  'bignum': function() {
    a2.mul(b2);
  },
  'browserify-bignum': function() {
    a3.mul(b3);
  },
  'bigi': function() {
    a4.multiply(b4);
  },
  'sjcl': function() {
    a5.mul(b5);
  },
  'yaffle': function() {
    a6.multiply(b6);
  },
  'node-biginteger': function() {
    a7.multiply(b7);
  },
  'silentmatt-biginteger': function() {
    a8.multiply(b8);
  },
  'peterolson/BigInteger.js': function () {
    a9.multiply(b9);
  },
  'defunctzombie/int': function () {
    a10.mul(b10);
  }
});

add('sqr', {
  'bn.js': function() {
    a1.mul(a1);
  },
  'bignum': function() {
    a2.mul(a2);
  },
  'browserify-bignum': function() {
    a3.mul(a3);
  },
  'bigi': function() {
    a4.square();
  },
  'sjcl': function() {
    a5.mul(a5);
  },
  'yaffle': function() {
    a6.multiply(a6);
  },
  'node-biginteger': function() {
    a7.square();
  },
  'silentmatt-biginteger': function() {
    a8.multiply(a8);
  },
  'peterolson/BigInteger.js': function () {
    a9.multiply(a9);
  },
  'defunctzombie/int': function () {
    a10.mul(a10);
  }
});

add('div', {
  'bn.js': function() {
    as1.div(a1);
  },
  'bignum': function() {
    as2.div(a2);
  },
  'browserify-bignum': function() {
    as3.div(a3);
  },
  'bigi': function() {
    as4.divide(a4);
  },
  'yaffle': function() {
    as6.divide(a6);
  },
  'node-biginteger': function() {
    as7.divide(a7);
  },
  'silentmatt-biginteger': function() {
    as8.divide(a8);
  },
  'peterolson/BigInteger.js': function () {
    as9.divide(a9);
  },
  'defunctzombie/int': function () {
    as10.div(a10);
  }
});

add('mod', {
  'bn.js': function() {
    as1.mod(a1);
  },
  'bignum': function() {
    as2.mod(a2);
  },
  'browserify-bignum': function() {
    as3.mod(a3);
  },
  'bigi': function() {
    as4.mod(a4);
  },
  'yaffle': function() {
    as6.remainder(a6);
  },
  'node-biginteger': function() {
    as7.mod(a7);
  },
  'silentmatt-biginteger': function() {
    as8.remainder(a8);
  },
  'peterolson/BigInteger.js': function () {
    as9.remainder(a9);
  },
  'defunctzombie/int': function () {
    as10.mod(a10);
  }
});

var am1 = a1.toRed(bn.red('k256'));
var am5 = new sjcl.prime.p256k(a5);

add('mul-mod k256', {
  'bn.js': function() {
    am1.redSqr();
  },
  'sjcl': function() {
    am5.square().fullReduce();
  }
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

add('pow k256', {
  'bn.js': function() {
    am1.redPow(pow1);
  },
  'bignum': function() {
    a2.powm(a2, prime1);
  }
});

add('invm k256', {
  'bn.js': function() {
    am1.redInvm();
  },
  'sjcl': function() {
    am5.inverseMod(prime5);
  }
});

start();
