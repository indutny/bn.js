 /* eslint-disable new-cap, no-new */

var benchmark = require('benchmark');
var bn = require('../');
var bignum = require('bignum');
var sjcl = require('eccjs').sjcl.bn;
var bigi = require('bigi');
var BigInteger = require('js-big-integer').BigInteger;
var SilentMattBigInteger = require('biginteger').BigInteger;
var benchmarks = [];

var selfOnly = process.env.SELF_ONLY;

function add (op, obj) {
  benchmarks.push({
    name: op,
    start: function start () {
      var suite = new benchmark.Suite();

      console.log('Benchmarking: ' + op);

      Object.keys(obj).forEach(function (name) {
        if (!selfOnly || name === 'bn.js') {
          suite.add(name + '#' + op, obj[name]);
        }
      });

      suite
        .on('cycle', function (event) {
          console.log(String(event.target));
        })
        .on('complete', function () {
          console.log('------------------------');
          console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        })
        .run();
      console.log('========================');
    }
  });
}

function start () {
  var re = process.argv[2] ? new RegExp(process.argv[2], 'i') : /./;

  benchmarks.filter(function (b) {
    return re.test(b.name);
  }).forEach(function (b) {
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

var aj = 'a899c59999bf877d96442d284359783bdc64b5f878b688fe' +
  '51407f0526e616553ad0aaaac4d5bed3046f10a1faaf42bb' +
  '2342dc4b7908eea0c46e4c4576897675c2bfdc4467870d3d' +
  'cd90adaed4359237a4bc6924bfb99aa6bf5f5ede15b574ea' +
  'e977eac096f3c67d09bda574c6306c6123fa89d2f086b8dc' +
  'ff92bc570c18d83fe6c810ccfd22ce4c749ef5e6ead3fffe' +
  'c63d95e0e3fde1df9db6a35fa1d107058f37e41957769199' +
  'd945dd7a373622c65f0af3fd9eb1ddc5c764bbfaf7a3dc37' +
  '2548e683b970dac4aa4b9869080d2376c9adecebb84e172c' +
  '09aeeb25fb8df23e60033260c4f8aac6b8b98ab894b1fb84' +
  'ebb83c0fb2081c3f3eee07f44e24d8fabf76f19ed167b0d7' +
  'ff971565aa4efa3625fce5a43ceeaa3eebb3ce88a00f597f' +
  '048c69292b38dba2103ecdd5ec4ccfe3b2d87fa6202f334b' +
  'c1cab83b608dfc875b650b69f2c7e23c0b2b4adf149a6100' +
  'db1b6dbad4679ecb1ea95eafaba3bd00db11c2134f5a8686' +
  '358b8b2ab49a1b2e85e1e45caeac5cd4dc0b3b5fffba8871' +
  '1c6baf399edd48dad5e5c313702737a6dbdcede80ca358e5' +
  '1d1c4fe42e8948a084403f61baed38aa9a1a5ce2918e9f33' +
  '100050a430b47bc592995606440272a4994677577a6aaa1b' +
  'a101045dbec5a4e9566dab5445d1af3ed19519f07ac4e2a8' +
  'bd0a84b01978f203a9125a0be020f71fab56c2c9e344d4f4' +
  '12d53d3cd8eb74ca5122002e931e3cb0bd4b7492436be17a' +
  'd7ebe27148671f59432c36d8c56eb762655711cfc8471f70' +
  '83a8b7283bcb3b1b1d47d37c23d030288cfcef05fbdb4e16' +
  '652ee03ee7b77056a808cd700bc3d9ef826eca9a59be959c' +
  '947c865d6b372a1ca2d503d7df6d7611b12111665438475a' +
  '1c64145849b3da8c2d343410df892d958db232617f9896f1' +
  'de95b8b5a47132be80dd65298c7f2047858409bf762dbc05' +
  'a62ca392ac40cfb8201a0607a2cae07d99a307625f2b2d04' +
  'fe83fbd3ab53602263410f143b73d5b46fc761882e78c782' +
  'd2c36e716a770a7aefaf7f76cea872db7bffefdbc4c2f9e0' +
  '39c19adac915e7a63dcb8c8c78c113f29a3e0bc10e100ce0';

var bj = '3bf836229c7dd874fe37c1790d201e82ed8e192ed61571ca' +
  '7285264974eb2a0171f3747b2fc23969a916cbd21e14f7e2' +
  'f0d72dcd2247affba926f9e7bb99944cb5609aed85e71b89' +
  'e89d2651550cb5bd8281bd3144066af78f194032aa777739' +
  'cccb7862a1af401f99f7e5c693f25ddce2dedd9686633820' +
  'd28d0f5ed0c6b5a094f5fe6170b8e2cbc9dff118398baee6' +
  'e895a6301cb6e881b3cae749a5bdf5c56fc897ff68bc73f2' +
  '4811bb108b882872bade1f147d886a415cda2b93dd90190c' +
  'be5c2dd53fe78add5960e97f58ff2506afe437f4cf4c912a' +
  '397c1a2139ac6207d3ab76e6b7ffd23bb6866dd7f87a9ae5' +
  '578789084ff2d06ea0d30156d7a10496e8ebe094f5703539' +
  '730f5fdbebc066de417be82c99c7da59953071f49da7878d' +
  'a588775ff2a7f0084de390f009f372af75cdeba292b08ea8' +
  '4bd13a87e1ca678f9ad148145f7cef3620d69a891be46fbb' +
  'cad858e2401ec0fd72abdea2f643e6d0197b7646fbb83220' +
  '0f4cf7a7f6a7559f9fb0d0f1680822af9dbd8dec4cd1b5e1' +
  '7bc799e902d9fe746ddf41da3b7020350d3600347398999a' +
  'baf75d53e03ad2ee17de8a2032f1008c6c2e6618b62f225b' +
  'a2f350179445debe68500fcbb6cae970a9920e321b468b74' +
  '5fb524fb88abbcacdca121d737c44d30724227a99745c209' +
  'b970d1ff93bbc9f28b01b4e714d6c9cbd9ea032d4e964d8e' +
  '8fff01db095160c20b7646d9fcd314c4bc11bcc232aeccc0' +
  'fbedccbc786951025597522eef283e3f56b44561a0765783' +
  '420128638c257e54b972a76e4261892d81222b3e2039c61a' +
  'ab8408fcaac3d634f848ab3ee65ea1bd13c6cd75d2e78060' +
  'e13cf67fbef8de66d2049e26c0541c679fff3e6afc290efe' +
  '875c213df9678e4a7ec484bc87dae5f0a1c26d7583e38941' +
  'b7c68b004d4df8b004b666f9448aac1cc3ea21461f41ea5d' +
  'd0f7a9e6161cfe0f58bcfd304bdc11d78c2e9d542e86c0b5' +
  '6985cc83f693f686eaac17411a8247bf62f5ccc7782349b5' +
  'cc1f20e312fa2acc0197154d1bfee507e8db77e8f2732f2d' +
  '641440ccf248e8643b2bd1e1f9e8239356ab91098fcb431d';

// BN

var a1 = new bn('012345678901234567890123456789012345678901234567890', 10);
var b1 = new bn('213509123601923760129376102397651203958123402314875', 10);

var a1j = new bn(aj, 16);
var b1j = new bn(bj, 16);

// bignum

var a2 = new bignum('012345678901234567890123456789012345678901234567890', 10);
var b2 = new bignum('213509123601923760129376102397651203958123402314875', 10);

var a2j = new bignum(aj, 16);
var b2j = new bignum(bj, 16);

// bigi

var a4 = new bigi('012345678901234567890123456789012345678901234567890', 10);
var b4 = new bigi('213509123601923760129376102397651203958123402314875', 10);

var a4j = new bigi(aj, 16);
var b4j = new bigi(bj, 16);

// sjcl

var a5 = new sjcl(a1.toString(16));
var b5 = new sjcl(b1.toString(16));

var a5j = new sjcl(aj);
var b5j = new sjcl(bj);

// BigInteger

var a6 = new BigInteger('012345678901234567890123456789012345678901234567890', 10);
var b6 = new BigInteger('213509123601923760129376102397651203958123402314875', 10);

var a6j = new BigInteger(aj, 16);
var b6j = new BigInteger(bj, 16);

// SilentMattBigInteger

var a8 = SilentMattBigInteger.parse('012345678901234567890123456789012345678901234567890', 10);
var b8 = SilentMattBigInteger.parse('213509123601923760129376102397651203958123402314875', 10);

var a8j = SilentMattBigInteger.parse(aj, 16);
var b8j = SilentMattBigInteger.parse(aj, 16);

var as1 = a1.mul(a1).iaddn(0x2adbeef);
var as2 = a2.mul(a2).add(0x2adbeef);
var as4 = a4.multiply(a4).add(bigi.valueOf(0x2adbeef));
// var as5 = a5.mul(a5).add(0x2adbeef);
var as6 = a6.multiply(a6).add(new BigInteger('2adbeef', 16));
var as8 = a8.multiply(a8).add(SilentMattBigInteger.parse('2adbeef', 16));

add('create-10', {
  'bn.js': function () {
    new bn('012345678901234567890123456789012345678901234567890', 10);
  },
  'bignum': function () {
    new bignum('012345678901234567890123456789012345678901234567890', 10);
  },
  'bigi': function () {
    new bigi('012345678901234567890123456789012345678901234567890', 10);
  },
  'yaffle': function () {
    new BigInteger('012345678901234567890123456789012345678901234567890', 10);
  },
  'silentmatt-biginteger': function () {
    SilentMattBigInteger.parse('012345678901234567890123456789012345678901234567890', 10);
  }
});

add('create-hex', {
  'bn.js': function () {
    new bn('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  },
  'bignum': function () {
    new bignum('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  },
  'bigi': function () {
    new bigi('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  },
  'sjcl': function () {
    new sjcl('01234567890abcdef01234567890abcdef01234567890abcdef');
  },
  'yaffle': function () {
    new BigInteger('01234567890abcdef01234567890abcdef01234567890abcdef', 16);
  },
  'silentmatt-biginteger': function () {
    SilentMattBigInteger.parse('012345678901234567890123456789012345678901234567890', 16);
  }
});

add('toString-10', {
  'bn.js': function () {
    a1.toString(10);
  },
  'bignum': function () {
    a2.toString(10);
  },
  'bigi': function () {
    a4.toString(10);
  },
  'yaffle': function () {
    a6.toString(10);
  },
  'silentmatt-biginteger': function () {
    a8.toString(10);
  }
});

add('toString-hex', {
  'bn.js': function () {
    a1.toString(16);
  },
  'bignum': function () {
    a2.toString(16);
  },
  'bigi': function () {
    a4.toString(16);
  },
  'sjcl': function () {
    a5.toString(16);
  },
  'yaffle': function () {
    a6.toString(16);
  },
  'silentmatt-biginteger': function () {
    a8.toString(16);
  }
});

add('add', {
  'bn.js': function () {
    a1.add(b1);
  },
  'bignum': function () {
    a2.add(b2);
  },
  'bigi': function () {
    a4.add(b4);
  },
  'sjcl': function () {
    a5.add(b5);
  },
  'yaffle': function () {
    a6.add(b6);
  },
  'silentmatt-biginteger': function () {
    a8.add(a8);
  }
});

add('sub', {
  'bn.js': function () {
    b1.sub(a1);
  },
  'bignum': function () {
    b2.sub(a2);
  },
  'bigi': function () {
    b4.subtract(a4);
  },
  'sjcl': function () {
    b5.sub(a5);
  },
  'yaffle': function () {
    b6.subtract(a6);
  },
  'silentmatt-biginteger': function () {
    b8.subtract(a8);
  }
});

add('mul', {
  'bn.js': function () {
    a1.mul(b1);
  },
  'bn.js[FFT]': function () {
    a1.mulf(b1);
  },
  'bignum': function () {
    a2.mul(b2);
  },
  'bigi': function () {
    a4.multiply(b4);
  },
  'sjcl': function () {
    a5.mul(b5);
  },
  'yaffle': function () {
    a6.multiply(b6);
  },
  'silentmatt-biginteger': function () {
    a8.multiply(b8);
  }
});

add('mul-jumbo', {
  'bn.js': function () {
    a1j.mul(b1j);
  },
  'bn.js[FFT]': function () {
    a1j.mulf(b1j);
  },
  'bignum': function () {
    a2j.mul(b2j);
  },
  'bigi': function () {
    a4j.multiply(b4j);
  },
  'sjcl': function () {
    a5j.mul(b5j);
  },
  'yaffle': function () {
    a6j.multiply(b6j);
  },
  'silentmatt-biginteger': function () {
    a8j.multiply(b8j);
  }
});

add('sqr', {
  'bn.js': function () {
    a1.mul(a1);
  },
  'bignum': function () {
    a2.mul(a2);
  },
  'bigi': function () {
    a4.square();
  },
  'sjcl': function () {
    a5.mul(a5);
  },
  'yaffle': function () {
    a6.multiply(a6);
  },
  'silentmatt-biginteger': function () {
    a8.multiply(a8);
  }
});

add('div', {
  'bn.js': function () {
    as1.div(a1);
  },
  'bignum': function () {
    as2.div(a2);
  },
  'bigi': function () {
    as4.divide(a4);
  },
  'yaffle': function () {
    as6.divide(a6);
  },
  'silentmatt-biginteger': function () {
    as8.divide(a8);
  }
});

add('mod', {
  'bn.js': function () {
    as1.mod(a1);
  },
  'bignum': function () {
    as2.mod(a2);
  },
  'bigi': function () {
    as4.mod(a4);
  },
  'yaffle': function () {
    var remainder = as6.remainder(a6);
    return remainder.compareTo(BigInteger.ZERO) < 0
      ? remainder.add(a6)
      : remainder;
  },
  'silentmatt-biginteger': function () {
    var remainder = as8.remainder(a8);
    return remainder.compare(BigInteger.ZERO) < 0
      ? remainder.add(a8)
      : remainder;
  }
});

var am1 = a1.toRed(bn.red('k256'));
var am5 = new sjcl.prime.p256k(a5);

add('mul-mod k256', {
  'bn.js': function () {
    am1.redSqr();
  },
  'sjcl': function () {
    am5.square().fullReduce();
  }
});

var pow1 = am1.fromRed();
var prime1 = new bignum(
  'fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f',
  16);
// var prime4 = new bigi(
//   'fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f',
//   16);
var prime5 = new sjcl(
  'fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f');

add('pow k256', {
  'bn.js': function () {
    am1.redPow(pow1);
  },
  'bignum': function () {
    a2.powm(a2, prime1);
  }
});

add('invm k256', {
  'bn.js': function () {
    am1.redInvm();
  },
  'sjcl': function () {
    am5.inverseMod(prime5);
  }
});

add('gcd', {
  'bn.js': function () {
    a1.gcd(b1);
  },
  'bigi': function () {
    a4.gcd(b4);
  }
});

add('egcd', {
  'bn.js': function () {
    a1.egcd(b1);
  }
});

add('bitLength', {
  'bn.js': function () {
    a1.bitLength();
  }
});

start();
