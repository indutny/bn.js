var assert = require('assert');
var benchmark = require('benchmark');
var bn = require('../');
var bignum = require('bignum');
var sjcl = require('eccjs').sjcl.bn;
var bigi = require('bigi');
var BigInteger = require('js-big-integer').BigInteger;
var SilentMattBigInteger = require('biginteger').BigInteger;
var benchmarks = [];

var selfOnly = process.env.SELF_ONLY;

function add(op, obj) {
  benchmarks.push({
    name: op,
    start: function start() {
      var suite = new benchmark.Suite;

      console.log('Benchmarking: ' + op);

      Object.keys(obj).forEach(function(name) {
        if (!selfOnly || name === 'bn.js')
          suite.add(name + '#' + op, obj[name]);
      });

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

var a4 = new bigi('012345678901234567890123456789012345678901234567890', 10);
var b4 = new bigi('213509123601923760129376102397651203958123402314875', 10);

var a5 = new sjcl(a1.toString(16));
var b5 = new sjcl(b1.toString(16));

var a6 = new BigInteger('012345678901234567890123456789012345678901234567890', 10);
var b6 = new BigInteger('213509123601923760129376102397651203958123402314875', 10);

var a8 = SilentMattBigInteger.parse('012345678901234567890123456789012345678901234567890', 10);
var b8 = SilentMattBigInteger.parse('213509123601923760129376102397651203958123402314875', 10);

var as1 = a1.mul(a1).iaddn(0x2adbeef);
var as2 = a2.mul(a2).add(0x2adbeef);
var as4 = a4.multiply(a4).add(bigi.valueOf(0x2adbeef));
var as5 = a5.mul(a5).add(0x2adbeef);
var as6 = a6.multiply(a6).add(new BigInteger('2adbeef', 16));
var as8 = a8.multiply(a8).add(SilentMattBigInteger.parse('2adbeef', 16));

add('create-10', {
  'bn.js': function() {
    new bn('012345678901234567890123456789012345678901234567890', 10);
  },
  'bignum': function() {
    new bignum('012345678901234567890123456789012345678901234567890', 10);
  },
  'bigi': function() {
    new bigi('012345678901234567890123456789012345678901234567890', 10);
  },
  'yaffle': function() {
    new BigInteger('012345678901234567890123456789012345678901234567890', 10);
  },
  'silentmatt-biginteger': function() {
    SilentMattBigInteger.parse('012345678901234567890123456789012345678901234567890', 10);
  }
});

add('create-hex', {
  'bn.js': function() {
    new bn('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  },
  'bignum': function() {
    new bignum('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
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
  'silentmatt-biginteger': function() {
    SilentMattBigInteger.parse('012345678901234567890123456789012345678901234567890', 16);
  }
});

add('toString-10', {
  'bn.js': function() {
  a1.toString(10);
  },
  'bignum': function() {
    a2.toString(10);
  },
  'bigi': function() {
    a4.toString(10);
  },
  'yaffle': function() {
    a6.toString(10);
  },
  'silentmatt-biginteger': function() {
    a8.toString(10);
  }
});

add('toString-hex', {
  'bn.js': function() {
    a1.toString(16);
  },
  'bignum': function() {
    a2.toString(16);
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
  'silentmatt-biginteger': function() {
    a8.toString(16);
  }
});

add('add', {
  'bn.js': function() {
    a1.add(b1);
  },
  'bignum': function() {
    a2.add(b2);
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
  'silentmatt-biginteger': function() {
    a8.add(a8);
  }
});

add('sub', {
  'bn.js': function() {
    b1.sub(a1);
  },
  'bignum': function() {
    b2.sub(a2);
  },
  'bigi': function() {
    b4.subtract(a4);
  },
  'sjcl': function() {
    b5.sub(a5);
  },
  'yaffle': function() {
    b6.subtract(a6);
  },
  'silentmatt-biginteger': function() {
    b8.subtract(a8);
  }
});

add('mul', {
  'bn.js': function() {
    a1.mul(b1);
  },
  'bignum': function() {
    a2.mul(b2);
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
  'silentmatt-biginteger': function() {
    a8.multiply(b8);
  }
});

add('sqr', {
  'bn.js': function() {
    a1.mul(a1);
  },
  'bignum': function() {
    a2.mul(a2);
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
  'silentmatt-biginteger': function() {
    a8.multiply(a8);
  }
});

add('div', {
  'bn.js': function() {
    as1.div(a1);
  },
  'bignum': function() {
    as2.div(a2);
  },
  'bigi': function() {
    as4.divide(a4);
  },
  'yaffle': function() {
    as6.divide(a6);
  },
  'silentmatt-biginteger': function() {
    as8.divide(a8);
  }
});

add('mod', {
  'bn.js': function() {
    as1.mod(a1);
  },
  'bignum': function() {
    as2.mod(a2);
  },
  'bigi': function() {
    as4.mod(a4);
  },
  'yaffle': function () {
    var remainder = as6.remainder(a6);
    return remainder.compareTo(BigInteger.ZERO) < 0 ?
        remainder.add(a6) :
        remainder;
  },
  'silentmatt-biginteger': function() {
    var remainder = as8.remainder(a8);
    return remainder.compare(BigInteger.ZERO) < 0 ?
        remainder.add(a8) :
        remainder;
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

add('gcd', {
  'bn.js[gcd]': function() {
    a1.gcd(b1);
  },
  'bn.js[egcd]': function() {
    a1.egcd(b1);
  },
  'bigi': function() {
    a4.gcd(b4);
  },
});

add('egcd', {
  'bn.js': function() {
    a1.egcd(b1);
  }
});

add('bitLength', {
  'bn.js': function() {
    a1.bitLength();
  }
});

start();
