/*jslint plusplus: true, vars: true, indent: 2 */

(function (exports) {
  "use strict";

  // BigInteger.js
  // Available under Public Domain
  // https://github.com/Yaffle/BigInteger/

  // For implementation details, see "The Handbook of Applied Cryptography" http://www.cacr.math.uwaterloo.ca/hac/about/chap14.pdf

  var floor = Math.floor;

  var parseInteger = function (s, from, to, radix) {
    var i = from - 1;
    var n = 0;
    var y = radix < 10 ? radix : 10;
    while (++i < to) {
      var code = s.charCodeAt(i);
      var v = code - 48;
      if (v < 0 || y <= v) {
        v = 10 - 65 + code;
        if (v < 10 || radix <= v) {
          v = 10 - 97 + code;
          if (v < 10 || radix <= v) {
            throw new RangeError();
          }
        }
      }
      n = n * radix + v;
    }
    return n;
  };

  var base = 67108864;

  var createArray = function (length) {
    var x = new Array(length);
    if (x.length !== length) {
      x.length = length; // see https://bugzilla.mozilla.org/show_bug.cgi?id=989586 , http://stackoverflow.com/questions/22726716/new-arraylength-gives-wrong-size
    }
    var i = -1;
    while (++i < length) {
      x[i] = 0;
    }
    return x;
  };

  var getLength = function (a, length) {
    var k = length;
    while (k > 0 && a[k - 1] === 0) {
      k -= 1;
    }
    return k;
  };

  var performMultiplication = function (carry, a, b, result, index) {
    var c = carry + a * b;
    var q = floor(c / base);
    result[index] = (c - q * base);
    return q;
  };

  var performDivision = function (a, b, divisor, result, index) {
    var carry = a * base + b;
    var q = floor(carry / divisor);
    result[index] = q;
    return (carry - q * divisor);
  };

  var checkRadix = function (radix) {
    if (radix < 2 || radix > 36) {
      throw new RangeError("radix argument must be between 2 and 36");
    }
  };

  var convertRadix = function (magnitude, size, radix) {
    var i = -1;
    while (++i < size) {
      var j = -1;
      var c = magnitude[i];
      magnitude[i] = 0;
      while (++j < i + 1) {
        c = performMultiplication(c, magnitude[j], radix, magnitude, j);
      }
    }
  };

  // BigInteger(String[, radix = 10]), (2 <= radix <= 36)
  // throws RangeError, TypeError
  function BigInteger(s, radix, m) {
    if (typeof s !== "string") {
      throw new TypeError();
    }
    var sign = 1;
    var magnitude = null;
    var magnitudeLength = 0;
    if (m !== undefined) {
      sign = radix < 0 ? -1 : 1;
      magnitude = m;
      magnitudeLength = sign * radix;
    } else {
      if (radix === undefined) {
        radix = 10;
      }
      if (typeof radix !== "number" || floor(radix) !== radix) {
        throw new TypeError();
      }
      checkRadix(radix);
      var length = s.length;
      if (length === 0) {
        throw new RangeError();
      }
      var signCharCode = s.charCodeAt(0);
      var from = 0;
      if (signCharCode === 43) { // "+"
        from = 1;
      }
      if (signCharCode === 45) { // "-"
        from = 1;
        sign = -1;
      }

      length -= from;
      if (length === 0) {
        throw new RangeError();
      }

      var groupLength = 0;
      var groupRadix = 1;
      var y = floor(base / radix);
      while (y >= groupRadix && groupLength < length) {
        groupLength += 1;
        groupRadix *= radix;
      }
      var size = -floor(-length / groupLength);

      magnitude = createArray(size);
      var k = size;
      var i = length;
      while (i > 0) {
        magnitude[--k] = parseInteger(s, from + (i > groupLength ? i - groupLength : 0), from + i, radix);
        i -= groupLength;
      }

      convertRadix(magnitude, size, groupRadix);
      magnitudeLength = getLength(magnitude, size);
    }
    this.signum = magnitudeLength === 0 ? 0 : sign;
    this.magnitude = magnitude;
    this.length = magnitudeLength;
  }

  var createBigInteger = function (signum, magnitude, length) {
    return new BigInteger("", signum * length, magnitude);
  };

  var compareMagnitude = function (aMagnitude, aLength, bMagnitude, bLength) {
    if (aLength !== bLength) {
      return aLength < bLength ? -1 : +1;
    }
    var i = aLength;
    while (--i >= 0) {
      if (aMagnitude[i] !== bMagnitude[i]) {
        return aMagnitude[i] < bMagnitude[i] ? -1 : +1;
      }
    }
    return 0;
  };

  var compareTo = function (aSignum, aMagnitude, aLength, bSignum, bMagnitude, bLength) {
    if (aSignum === bSignum) {
      var c = compareMagnitude(aMagnitude, aLength, bMagnitude, bLength);
      if (c === 0) {
        return c; // positive zero
      }
      return aSignum * c;
    }
    if (aSignum === 0) {
      return -bSignum;
    }
    return aSignum;
  };

  var add = function (aSignum, aMagnitude, aLength, bSignum, bMagnitude, bLength) {
    var z = compareMagnitude(aMagnitude, aLength, bMagnitude, bLength);
    if (z > 0) {
      return add(bSignum, bMagnitude, bLength, aSignum, aMagnitude, aLength);
    }
    // |a| <= |b|
    if (aSignum === 0) {
      return createBigInteger(bSignum, bMagnitude, bLength);
    }
    var subtract = false;
    if (aSignum !== bSignum) {
      if (z === 0) { // a === (-b)
        return createBigInteger(0, createArray(0), 0);
      }
      subtract = true;
      if (aLength === bLength) {
        while (bLength > 0 && aMagnitude[bLength - 1] === bMagnitude[bLength - 1]) {
          bLength -= 1;
        }
      }
    }
    // result !== 0
    var resultLength = bLength + (subtract ? 0 : 1);
    var result = createArray(resultLength);
    var i = -1;
    var c = 0;
    while (++i < bLength) {
      c += (i < aLength ? (subtract ? bMagnitude[i] - aMagnitude[i] : bMagnitude[i] + aMagnitude[i]) : bMagnitude[i]);
      if (c < 0) {
        result[i] = base + c;
        c = -1;
      } else if (c < base) {
        result[i] = c;
        c = 0;
      } else {
        result[i] = c - base;
        c = +1;
      }
    }
    if (c !== 0) {
      result[bLength] = c;
    }
    return createBigInteger(bSignum, result, getLength(result, resultLength));
  };

  var multiply = function (aSignum, aMagnitude, aLength, bSignum, bMagnitude, bLength) {
    if (aLength === 0 || bLength === 0) {
      return createBigInteger(0, createArray(0), 0);
    }
    var resultSign = aSignum * bSignum;
    if (aLength === 1 && aMagnitude[0] === 1) {
      return createBigInteger(resultSign, bMagnitude, bLength);
    }
    if (bLength === 1 && bMagnitude[0] === 1) {
      return createBigInteger(resultSign, aMagnitude, aLength);
    }
    var resultLength = aLength + bLength;
    var result = createArray(resultLength);
    var i = -1;
    while (++i < bLength) {
      var c = 0;
      var j = -1;
      while (++j < aLength) {
        c = performMultiplication(c + result[j + i], aMagnitude[j], bMagnitude[i], result, j + i);
      }
      result[aLength + i] = c;
    }
    return createBigInteger(resultSign, result, getLength(result, resultLength));
  };

  var divideBySmall = function (magnitude, length, lambda) {
    var c = 0;
    var i = length;
    while (--i >= 0) {
      c = performDivision(c, magnitude[i], lambda, magnitude, i);
    }
    return c;
  };

  var multiplyBySmall = function (magnitude, length, lambda) {
    var c = 0;
    var i = -1;
    while (++i < length) {
      c = performMultiplication(c, magnitude[i], lambda, magnitude, i);
    }
    magnitude[length] = c;
  };

  var divideAndRemainder = function (aSignum, aMagnitude, aLength, bSignum, bMagnitude, bLength, divide) {
    if (bLength === 0) {
      throw new RangeError();
    }
    if (aLength === 0) {
      return createBigInteger(0, createArray(0), 0);
    }
    if (bLength === 1 && bMagnitude[0] === 1) {
      return divide ? createBigInteger(aSignum === 0 ? 0 : aSignum * bSignum, aMagnitude, aLength) : createBigInteger(0, createArray(0), 0);
    }

    var divisorOffset = aLength + 1;
    var divisorAndRemainder = createArray(divisorOffset + bLength + 1); // `+ 1` to avoid `index < remainder.length` and for extra digit in case of normalization
    var divisor = divisorAndRemainder;
    var remainder = divisorAndRemainder;
    var n = aLength;
    while (--n >= 0) {
      remainder[n] = aMagnitude[n];
    }
    var m = bLength;
    while (--m >= 0) {
      divisor[divisorOffset + m] = bMagnitude[m];
    }

    var top = divisor[divisorOffset + bLength - 1];

    // normalization
    var lambda = 1;
    if (bLength > 1) {
      //lambda = -floor(-floor(base / 2) / top);
      lambda = floor(base / (top + 1));
      if (lambda > 1) {
        multiplyBySmall(divisorAndRemainder, divisorOffset + bLength, lambda);
        top = divisor[divisorOffset + bLength - 1];
      }
      if (top < floor(base / 2)) {
        throw new RangeError();
      }
    }

    var shift = aLength - bLength + 1;
    if (shift < 0) {
      shift = 0;
    }
    var quotinent = null;
    var quotinentLength = 0;

    var i = shift;
    while (--i >= 0) {
      var t = bLength + i;
      var tmp = remainder[t];
      performDivision(remainder[t], remainder[t - 1], top, remainder, t);
      var q = remainder[t];
      remainder[t] = tmp;

      var ax = 0;
      var bx = 0;
      var j = i - 1;
      while (++j <= t) {
        var rj = remainder[j];
        bx = performMultiplication(bx, q, divisor[divisorOffset + j - i], remainder, j);
        ax += rj - remainder[j];
        if (ax < 0) {
          remainder[j] = base + ax;
          ax = -1;
        } else {
          remainder[j] = ax;
          ax = 0;
        }
      }
      while (ax !== 0) {
        q -= 1;
        var c = 0;
        var k = i - 1;
        while (++k <= t) {
          c += remainder[k] + divisor[divisorOffset + k - i];
          if (c < base) {
            remainder[k] = c;
            c = 0;
          } else {
            remainder[k] = c - base;
            c = +1;
          }
        }
        ax += c;
      }
      if (divide && q !== 0) {
        if (quotinent === null) {
          quotinentLength = i + 1;
          quotinent = createArray(quotinentLength);
        }
        quotinent[i] = q;
      }
    }

    if (divide) {
      if (quotinent === null) {
        return createBigInteger(0, createArray(0), 0);
      }
      return createBigInteger(aSignum * bSignum, quotinent, quotinentLength);
    }

    var remainderLength = aLength + 1;
    if (lambda > 1) {
      divideBySmall(remainder, remainderLength, lambda);
    }
    while (remainderLength > 0 && remainder[remainderLength - 1] === 0) {
      remainderLength -= 1;
    }
    if (remainderLength === 0) {
      return createBigInteger(0, createArray(0), 0);
    }
    var result = createArray(remainderLength);
    var o = remainderLength;
    while (--o >= 0) {
      result[o] = remainder[o];
    }
    return createBigInteger(aSignum, result, remainderLength);
  };

  var toString = function (signum, magnitude, length, radix) {
    var result = signum < 0 ? "-" : "";

    var remainderLength = length;
    if (remainderLength === 0) {
      return "0";
    }
    if (remainderLength === 1) {
      result += magnitude[0].toString(radix);
      return result;
    }
    var groupLength = 0;
    var groupRadix = 1;
    var y = floor(base / radix);
    while (y >= groupRadix) {
      groupLength += 1;
      groupRadix *= radix;
    }
    var size = remainderLength - floor(-remainderLength / groupLength);
    var remainder = createArray(size);
    var n = -1;
    while (++n < remainderLength) {
      remainder[n] = magnitude[n];
    }

    var k = size;
    while (remainderLength !== 0) {
      var q = divideBySmall(remainder, remainderLength, groupRadix);
      while (remainderLength !== 0 && remainder[remainderLength - 1] === 0) {
        remainderLength -= 1;
      }
      remainder[--k] = q;
    }
    result += remainder[k].toString(radix);
    while (++k < size) {
      var t = remainder[k].toString(radix);
      var j = groupLength - t.length;
      while (--j >= 0) {
        result += "0";
      }
      result += t;
    }
    return result;
  };

  BigInteger.prototype = {

    compareTo: function (b) {
      return compareTo(this.signum, this.magnitude, this.length, b.signum, b.magnitude, b.length);
    },

    negate: function () {
      return createBigInteger(0 - this.signum, this.magnitude, this.length);
    },

    add: function (b) {
      return add(this.signum, this.magnitude, this.length, b.signum, b.magnitude, b.length);
    },

    subtract: function (b) {
      return add(this.signum, this.magnitude, this.length, 0 - b.signum, b.magnitude, b.length);
    },

    multiply: function (b) {
      return multiply(this.signum, this.magnitude, this.length, b.signum, b.magnitude, b.length);
    },

    divide: function (b) {
      return divideAndRemainder(this.signum, this.magnitude, this.length, b.signum, b.magnitude, b.length, true);
    },

    remainder: function (b) {
      return divideAndRemainder(this.signum, this.magnitude, this.length, b.signum, b.magnitude, b.length, false);
    },

    toString: function (radix) {
      if (radix === undefined) {
        radix = 10;
      }
      if (typeof radix !== "number" || floor(radix) !== radix) {
        throw new TypeError();
      }
      checkRadix(radix);
      return toString(this.signum, this.magnitude, this.length, radix);
    }

  };

  var ZERO = createBigInteger(0, createArray(0), 0);
  var oneMagnitude = createArray(1);
  oneMagnitude[0] = 1;
  var ONE = createBigInteger(1, oneMagnitude, 1);

  BigInteger.ZERO = ZERO;
  BigInteger.ONE = ONE;
  if (typeof module === "object" && module.exports) {
    module.exports = BigInteger;
  } else {
    exports.BigInteger = BigInteger;
  }

}(this));
