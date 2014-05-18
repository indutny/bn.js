var assert = require('assert');
var BN = require('../').BN;

describe('BN.js/Reduction context', function() {
  function testMethod(name, fn) {
    describe(name + ' method', function() {
      it('should support montgomery operations', function() {
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
});
