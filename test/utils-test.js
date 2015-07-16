var assert = require('assert');
var BN = require('../').BN;
var fixtures = require('./fixtures/bn');

describe('BN.js/Utils', function() {
  describe('.toString()', function() {
    fixtures.valid.forEach(function(f) {
      it('should return ' + f.dec + ' when built with ' + f.dec, function() {
        var bi = new BN(f.dec);

        assert.equal(bi.toString(), f.dec);
      });

      it('should return ' + f.dec + ' when built with ' + f.hex, function() {
        var bi = new BN(f.hex, 16);

        assert.equal(bi.toString(), f.dec);
      });

      it('should return big-endian twos complement' +
         'hex for ' + f.dec, function() {
        var bi = new BN(f.dec);

        assert.equal(bi.toString('hex'), f.hex);
      });
    });

    describe('hex padding', function() {
      it('should have length of 8 from leading 15', function() {
        var a = new BN('ffb9602', 16);

        assert.equal(a.toString('hex', 2).length, 8);
      });

      it('should have length of 8 from leading zero', function() {
        var a = new BN('fb9604', 16);

        assert.equal(a.toString('hex', 8).length, 8);
      });

      it('should have length of 8 from leading zeros', function() {
        var a = new BN(0);

        assert.equal(a.toString('hex', 8).length, 8);
      });

      it('should have length of 64 from leading 15', function() {
        var a = new BN(
            'ffb96ff654e61130ba8422f0debca77a0ea74ae5ea8bca9b54ab64aabf01003',
            16);

        assert.equal(a.toString('hex', 2).length, 64);
      });

      it('should have length of 64 from leading zero', function() {
        var a = new BN(
            'fb96ff654e61130ba8422f0debca77a0ea74ae5ea8bca9b54ab64aabf01003',
            16);

        assert.equal(a.toString('hex', 64).length, 64);
      });
    });
  });

  describe('.toArray()', function() {
    fixtures.valid.forEach(function(f) {
      it('should return a big-endian ' +
         'twos complement integer for ' + f.dec, function() {
        var bi = new BN(f.dec);
        var ba = new Buffer(bi.toArray());

        assert.equal(ba.toString('hex'), f.hex);
      });
    });

    fixtures.invalid.forEach(function(f) {
      if (f.dec) {
        it('should throw on ' + f.dec, function() {
          assert.throws(function() {
            new BN(f.dec);
          });
        });
      }

      if (f.hex) {
        it('should throw on ' + f.hex, function() {
          assert.throws(function() {
            new BN(f.hex, 16);
          });
        });
      }
    });
  });

  describe('.bitLength()', function() {
    it('should return proper bitLength', function() {
      assert.equal(new BN(0).bitLength(), 0);
      assert.equal(new BN(0x1).bitLength(), 1);
      assert.equal(new BN(0x2).bitLength(), 2);
      assert.equal(new BN(0x3).bitLength(), 2);
      assert.equal(new BN(0x4).bitLength(), 3);
      assert.equal(new BN(0x8).bitLength(), 4);
      assert.equal(new BN(0x10).bitLength(), 5);
      assert.equal(new BN(0x100).bitLength(), 9);
      assert.equal(new BN(0x123456).bitLength(), 21);
      assert.equal(new BN('123456789', 16).bitLength(), 33);
      assert.equal(new BN('8023456789', 16).bitLength(), 40);
    });
  });

  describe('.toArray()', function() {
    it('should zero pad to desired lengths', function() {
      var n = new BN(0x123456);
      assert.deepEqual(n.toArray('be', 5), [ 0x00, 0x00, 0x12, 0x34, 0x56 ]);
      assert.deepEqual(n.toArray('le', 5), [ 0x56, 0x34, 0x12, 0x00, 0x00 ]);
    });

    it('should throw when naturally larger than desired length', function() {
      var n = new BN(0x123456);
      assert.throws(function() {
        n.toArray('be', 2);
      });
    });
  });

  describe('.zeroBits()', function() {
    it('should return proper zeroBits', function() {
      assert.equal(new BN(0).zeroBits(), 0);
      assert.equal(new BN(0x1).zeroBits(), 0);
      assert.equal(new BN(0x2).zeroBits(), 1);
      assert.equal(new BN(0x3).zeroBits(), 0);
      assert.equal(new BN(0x4).zeroBits(), 2);
      assert.equal(new BN(0x8).zeroBits(), 3);
      assert.equal(new BN(0x10).zeroBits(), 4);
      assert.equal(new BN(0x100).zeroBits(), 8);
      assert.equal(new BN(0x1000000).zeroBits(), 24);
      assert.equal(new BN(0x123456).zeroBits(), 1);
    });
  });

  describe('.toJSON', function() {
    it('should return hex string', function() {
      assert.equal(new BN(0x123).toJSON(), '123');
    });
  });
});
