var assert = require('assert');
var BN = require('../').BN;

describe('BN.js/Reduction context', function() {
  function testMethod(name, fn) {
    describe(name + ' method', function() {
      it('should support add, iadd, sub, isub operations', function() {
        var p = new BN(257);
        var m = fn(p);
        var a = new BN(123).toRed(m);
        var b = new BN(231).toRed(m);

        assert.equal(a.redAdd(b).fromRed().toString(10), '97');
        assert.equal(a.redSub(b).fromRed().toString(10), '149');
        assert.equal(b.redSub(a).fromRed().toString(10), '108');

        assert.equal(a.clone().redIAdd(b).fromRed().toString(10), '97');
        assert.equal(a.clone().redISub(b).fromRed().toString(10), '149');
        assert.equal(b.clone().redISub(a).fromRed().toString(10), '108');
      });

      it('should support pow and mul operations', function() {
        var p192 = new BN(
            'fffffffffffffffffffffffffffffffeffffffffffffffff',
            16);
        var m = fn(p192);
        var a = new BN(123);
        var b = new BN(231);
        var c = a.toRed(m).redMul(b.toRed(m)).fromRed();
        assert(c.cmp(a.mul(b).mod(p192)) === 0);

        assert.equal(a.toRed(m).redPow(new BN(3)).fromRed()
                                .cmp(a.sqr().mul(a)), 0);
        assert.equal(a.toRed(m).redPow(new BN(4)).fromRed()
                                .cmp(a.sqr().sqr()), 0);
        assert.equal(a.toRed(m).redPow(new BN(8)).fromRed()
                                .cmp(a.sqr().sqr().sqr()), 0);
        assert.equal(a.toRed(m).redPow(new BN(9)).fromRed()
                                .cmp(a.sqr().sqr().sqr().mul(a)), 0);
      });

      it('should sqrtm numbers', function() {
        var p = new BN(263);
        var m = fn(p);
        var q = new BN(11).toRed(m);
        var qr = q.redSqrt(true, p);
        assert.equal(qr.redSqr().cmp(q), 0);
        var qr = q.redSqrt(false, p);
        assert.equal(qr.redSqr().cmp(q), 0);

        var p = new BN(
            'fffffffffffffffffffffffffffffffeffffffffffffffff',
            16);
        var m = fn(p);
        var q = new BN(13).toRed(m);
        var qr = q.redSqrt(true, p);
        assert.equal(qr.redSqr().cmp(q), 0);
        var qr = q.redSqrt(false, p);
        assert.equal(qr.redSqr().cmp(q), 0);
      });
    });
  }

  testMethod('Plain', BN.red);
  testMethod('Montgomery', BN.mont);

  describe('Pseudo-Mersenne Primes', function() {
    it('should reduce numbers mod k256', function() {
      var p = BN._prime('k256');

      assert.equal(p.reduce(new BN(0xdead)).toString(16), 'dead');
      assert.equal(p.reduce(new BN('deadbeef', 16)).toString(16), 'deadbeef');

      var num = new BN('fedcba9876543210fedcba9876543210dead' +
                           'fedcba9876543210fedcba9876543210dead',
                       16);
      assert.equal(p.reduce(num).toString(16), num.mod(p.p).toString(16));
    });
  });
});
