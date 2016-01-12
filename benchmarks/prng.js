'use strict';

var crypto = require('crypto');

/**
 * @class PRNG
 * @constructor
 * @param {string} seed
 */
function PRNG (seed) {
  this._seed = seed;
  this._count = 0;
  this._digest = '';
}

/**
 * @param {number} count
 * @return {string}
 */
PRNG.prototype.getHexString = function (count) {
  while (count > this._digest.length) {
    var data = this._seed + (this._count++).toString(16);
    var digest = crypto.createHash('sha256').update(data).digest('hex');
    this._digest = this._digest.concat(digest);
  }

  var result = this._digest.slice(0, count);
  this._digest = this._digest.slice(count);
  return result;
};

module.exports = PRNG;
