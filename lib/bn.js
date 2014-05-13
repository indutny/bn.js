function assert(val, msg) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

function assertEqual(l, r, msg) {
  if (l != r)
    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
}

function BN(number, base) {
  // May be `new BN(bn)` ?
  if (number !== null &&
      typeof number === 'object' &&
      Array.isArray(number.words)) {
    return number;
  }

  this.sign = false;
  this.words = null;
  this.length = 0;

  // Montgomery context
  this.mont = null;

  if (number !== null)
    this._init(number || 0, base || 10);
}
module.exports = BN;

BN.BN = BN;

BN.prototype._init = function init(number, base) {
  if (typeof number === 'number') {
    if (number < 0) {
      this.sign = true;
      number = -number;
    }
    this.words = [ number & 0xffffff ];
    this.length = 1;
    return;
  } else if (typeof number === 'object') {
    // Perhaps a Uint8Array
    assert(typeof number.length === 'number');
    this.length = Math.ceil(number.length / 3);
    this.words = new Array(this.length);

    // Assume big-endian
    var delta = 3 - number.length % 3;
    if (delta === 3)
      delta = 0;
    for (var i = 0; i < this.length; i++) {
      var off = i * 3 - delta;
      var w = number[off + 2] | (number[off + 1] << 8) | (number[off] << 16);
      this.words[this.length - i - 1] = w;
    }

    return;
  }
  if (base === 'hex')
    base = 16;
  assert(base <= 16);

  number = number.toString().replace(/\s+/g, '');
  var start = 0;
  if (number[0] === '-')
    start++;

  if (base === 16)
    this._parseHex(number, start);
  else
    this._parseBase(number, base, start);

  if (number[0] === '-')
    this.sign = true;

  this.strip();
};

BN.prototype._parseHex = function parseHex(number, start) {
  // Scan 3-byte chunks
  this.length = Math.ceil((number.length - start) / 7);
  this.words = new Array(this.length);
  for (var i = number.length - 6, j = 0; i >= start; i -= 6, j++)
    this.words[j] = parseInt(number.slice(i, i + 6), 16);
  if (i + 6 !== start)
    this.words[j++] = parseInt(number.slice(start, i + 6), 16);
  this.length = this.words.length;
};

BN.prototype._parseBase = function parseBase(number, base, start) {
  // Initialize as zero
  this.words = [ 0 ];
  this.length = 1;

  var word = 0;
  var q = 1;
  var p = 0;
  var bigQ = null;
  for (var i = start; i < number.length; i++) {
    var digit;
    var ch = number[i];
    if (base === 10 || ch <= '9')
      digit = ch | 0;
    else if (ch >= 'a')
      digit = ch.charCodeAt(0) - 97 + 10;
    else
      digit = ch.charCodeAt(0) - 65 + 10;
    word *= base;
    word += digit;
    q *= base;
    p++;

    if (q > 0xfffff) {
      assert(q <= 0xffffff);
      if (!bigQ)
        bigQ = new BN(q);
      this.mul(bigQ).copy(this);
      this.iadd(new BN(word));
      word = 0;
      q = 1;
      p = 0;
    }
  }
  if (p !== 0) {
    this.mul(new BN(q)).copy(this);
    this.iadd(new BN(word));
  }
};

BN.prototype.copy = function copy(dest) {
  dest.words = this.words.slice();
  dest.length = this.length;
  dest.sign = this.sign;
  dest.mont = this.mont;
};

BN.prototype.clone = function clone() {
  var r = new BN(null);
  this.copy(r);
  return r;
};

// Remove leading `0` from `this`
BN.prototype.strip = function strip() {
  while (this.words.length > 1 && this.words[this.words.length - 1] === 0)
    this.words.length--;
  this.length = this.words.length;
  // -0 = 0
  if (this.length === 1 && this.words[0] === 0)
    this.sign = false;
  return this;
};

BN.prototype.inspect = function inspect() {
  return (this.mont ? '<BN-M: ' : '<BN: ') + this.toString(16) + '>';
};

/*
function _zero(n) {
  var code = '';
  for (var i = n - 1; i > 0; i--) {
    var pad = '';
    for (var j = 0; j < n - i; j++)
      pad += '0';
    code += 'if (w.length === ' + i + ') return \'' + pad + '\' + w;\n';
  }
  code += 'return w';

  return new Function('w', code);
}

var zero6 = _zero(6);
var zero14 = _zero(14);
*/

// Sadly chrome apps could not contain `new Function()` calls
function zero6(w) {
  if (w.length === 5) return '0' + w;
  if (w.length === 4) return '00' + w;
  if (w.length === 3) return '000' + w;
  if (w.length === 2) return '0000' + w;
  if (w.length === 1) return '00000' + w;
  return w;
}

function zero14(w) {
  if (w.length === 13) return '0' + w;
  if (w.length === 12) return '00' + w;
  if (w.length === 11) return '000' + w;
  if (w.length === 10) return '0000' + w;
  if (w.length === 9) return '00000' + w;
  if (w.length === 8) return '000000' + w;
  if (w.length === 7) return '0000000' + w;
  if (w.length === 6) return '00000000' + w;
  if (w.length === 5) return '000000000' + w;
  if (w.length === 4) return '0000000000' + w;
  if (w.length === 3) return '00000000000' + w;
  if (w.length === 2) return '000000000000' + w;
  if (w.length === 1) return '0000000000000' + w;
  return w;
}

// Precomputed divisor for `.toString(10)` = 10 ^ 14
var div10 = new BN(null);
div10.words = [ 0x7A4000, 0x5AF310 ];
div10.length = 2;

BN.prototype.toString = function toString(base) {
  base = base || 10;
  if (base === 16 || base === 'hex') {
    var out = this.sign ? '-' : '';
    for (var i = this.length - 1; i >= 0; i--) {
      var word = this.words[i].toString(16);
      if (i !== this.length - 1)
        out += zero6(word);
      else
        out += word;
    }
    return out;
  } else if (base === 10) {
    var out = '';
    var c = this.clone();
    c.sign = false;
    while (c.cmpn(0) !== 0) {
      var tmp = c.divmod(div10, 'all');
      var r = tmp.mod;
      c = tmp.div;

      assert(r.length <= 2);
      r = r.length === 2 ? (r.words[0] + r.words[1] * 0x1000000) : r.words[0];
      if (c.cmpn(0) !== 0)
        out = zero14(r + '') + out;
      else
        out = r + out;
    }
    if (this.cmpn(0) === 0)
      out = '0' + out;
    if (this.sign)
      out = '-' + out;
    return out;
  } else {
    assert(false, 'Only 16 and 10 base are supported');
  }
};

BN.prototype.toJSON = function toJSON() {
  return this.toString(16);
};

BN.prototype.toArray = function toArray() {
  this.strip();
  var res = new Array(this.byteLength());
  res[0] = 0;

  var q = this.clone();
  for (var i = 0; q.cmpn(0) !== 0; i++) {
    var b = q.andln(0xff);
    q.ishrn(8);

    // Assume big-endian
    res[res.length - i - 1] = b;
  }

  return res;
};

/*
function genCountBits(bits) {
  var arr = [];

  for (var i = bits - 1; i >= 0; i--) {
    var bit = '0x' + (1 << i).toString(16);
    arr.push('w >= ' + bit + ' ? ' + (i + 1));
  }

  return new Function('w', 'return ' + arr.join(':\n') + ':\n0;');
};

BN.prototype._countBits = genCountBits(24);
*/

// Sadly chrome apps could not contain `new Function()` calls
BN.prototype._countBits = function _countBits(w) {
  return w >= 0x800000 ? 24:
         w >= 0x400000 ? 23:
         w >= 0x200000 ? 22:
         w >= 0x100000 ? 21:
         w >= 0x80000 ? 20:
         w >= 0x40000 ? 19:
         w >= 0x20000 ? 18:
         w >= 0x10000 ? 17:
         w >= 0x8000 ? 16:
         w >= 0x4000 ? 15:
         w >= 0x2000 ? 14:
         w >= 0x1000 ? 13:
         w >= 0x800 ? 12:
         w >= 0x400 ? 11:
         w >= 0x200 ? 10:
         w >= 0x100 ? 9:
         w >= 0x80 ? 8:
         w >= 0x40 ? 7:
         w >= 0x20 ? 6:
         w >= 0x10 ? 5:
         w >= 0x8 ? 4:
         w >= 0x4 ? 3:
         w >= 0x2 ? 2:
         w >= 0x1 ? 1:
         0;
}

// Return number of used bits in a BN
BN.prototype.bitLength = function bitLength() {
  this.strip();
  var hi = 0;
  var w = this.words[this.length - 1];
  var hi = this._countBits(w);
  return (this.length - 1) * 24 + hi;
};

BN.prototype.byteLength = function byteLength() {
  this.strip();
  var hi = 0;
  var w = this.words[this.length - 1];
  var bytes = w <= 0xff ? 1 : w <= 0xffff ? 2 : 3;
  return (this.length - 1) * 3 + bytes;
};

// Return negative clone of `this`
BN.prototype.neg = function neg() {
  if (this.cmpn(0) === 0)
    return this.clone();

  var r = this.clone();
  r.sign = !this.sign;
  return r;
};

// Add `num` to `this` in-place
BN.prototype.iadd = function iadd(num) {
  // negative + positive
  if (this.sign && !num.sign) {
    this.sign = false;
    var r = this.isub(num);
    this.sign = !this.sign;
    return this;

  // positive + negative
  } else if (!this.sign && num.sign) {
    num.sign = false;
    var r = this.isub(num);
    num.sign = true;
    return r;
  }

  // a.length > b.length
  var a;
  var b;
  if (this.length > num.length) {
    a = this;
    b = num;
  } else {
    a = num;
    b = this;
  }

  var carry = 0;
  for (var i = 0; i < b.length; i++) {
    var r = a.words[i] + b.words[i] + carry;
    this.words[i] = r & 0xffffff;
    carry = r >> 24;
  }
  for (; carry !== 0 && i < a.length; i++) {
    var r = a.words[i] + carry;
    this.words[i] = r & 0xffffff;
    carry = r >> 24;
  }

  this.length = a.length;
  if (carry !== 0) {
    this.words.push(carry);
    this.length++;
  // Copy the rest of the words
  } else if (a !== this) {
    for (; i < a.length; i++)
      this.words[i] = a.words[i];
  }

  return this;
};

// Add `num` to `this`
BN.prototype.add = function add(num) {
  if (num.sign && !this.sign)
    return this.sub(num.neg());
  else if (!num.sign && this.sign)
    return num.sub(this.neg());

  if (this.length > num.length)
    return this.clone().iadd(num);
  else
    return num.clone().iadd(this);
};

// Subtract `num` from `this` in-place
BN.prototype.isub = function isub(num) {
  // this - (-num) = this + num
  if (num.sign) {
    num.sign = false;
    var r = this.iadd(num);
    num.sign = true;
    return r;

  // -this - num = -(this + num)
  } else if (this.sign) {
    this.sign = false;
    this.iadd(num);
    this.sign = true;
    return this;
  }

  // At this point both numbers are positive
  var cmp = this.cmp(num);

  // Optimization - zeroify
  if (cmp === 0) {
    this.sign = false;
    this.length = 1;
    this.words = [ 0 ];
    return this;
  }

  // a > b
  if (cmp > 0) {
    var a = this;
    var b = num;
  } else {
    var a = num;
    var b = this;
  }

  var carry = 0;
  for (var i = 0; i < b.length; i++) {
    var r = a.words[i] - b.words[i] - carry;
    if (r < 0) {
      r += 0x1000000;
      carry = 1;
    } else {
      carry = 0;
    }
    this.words[i] = r;
  }
  for (; carry !== 0 && i < a.length; i++) {
    var r = a.words[i] - carry;
    if (r < 0) {
      r += 0x1000000;
      carry = 1;
    } else {
      carry = 0;
    }
    this.words[i] = r;
  }

  // Copy rest of the words
  if (carry === 0 && i < a.length && a !== this)
    for (; i < a.length; i++)
      this.words[i] = a.words[i];
  this.length = this.words.length;

  if (a !== this)
    this.sign = true;

  return this.strip();
};

// Subtract `num` from `this`
BN.prototype.sub = function sub(num) {
  return this.clone().isub(num);
};

// Multiply `this` by `num`
BN.prototype.mul = function mul(num) {
  if (this === num)
    return this.sqr();

  if (this.cmpn(0) === 0 || num.cmpn(0) === 0)
    return new BN(0);

  var result = new BN(null);
  result.sign = ((num.sign ? 1 : 0) ^ (this.sign ? 1 : 0)) ? true : false;
  result.words = new Array(this.length + num.length);
  for (var i = 0; i < result.words.length; i++)
    result.words[i] = 0;
  for (var i = 0; i < this.length; i++) {
    var a = this.words[i];
    var carry = 0;
    for (var j = 0; j < num.length; j++) {
      var b = num.words[j];
      var r = a * b + carry;
      var k = i + j;

      var lo = r & 0xffffff;
      var carry = (r - lo) / 0x1000000;
      lo = result.words[k] + lo;
      result.words[k] = lo & 0xffffff;
      carry += lo >> 24;
    }

    // Apply carry
    k++;
    assert(carry <= 0xffffff);
    for (; carry !== 0; k++) {
      if (result.words[k]) {
        carry += result.words[k];
        result.words[k] = carry & 0xffffff;
        carry >>= 24;
      } else {
        result.words[k] = carry;
        carry = 0;
      }
    }
  }
  result.length = result.words.length;

  return result.strip();
};

// `this` * `this`
BN.prototype.sqr = function sqr() {
  if (this.cmpn(0) === 0)
    return new BN(0);

  var res = new BN(null);
  res.words = new Array(2 * this.length);
  for (var i = 0; i < res.words.length; i++)
    res.words[i] = 0;
  for (var i = 0; i < this.length; i++) {
    var a = this.words[i];
    var carry = 0;
    for (var j = 0; j < this.length; j++) {
      var b = this.words[j];
      var r = a * b + carry;
      var k = i + j;

      var lo = r & 0xffffff;
      var carry = (r - lo) / 0x1000000;
      lo = res.words[k] + lo;
      res.words[k] = lo & 0xffffff;
      carry += lo >> 24;
    }

    // Apply carry
    k++;
    assert(carry <= 0xffffff);
    for (; carry !== 0; k++) {
      if (res.words[k]) {
        carry += res.words[k];
        res.words[k] = carry & 0xffffff;
        carry >>= 24;
      } else {
        res.words[k] = carry;
        carry = 0;
      }
    }
  }
  res.length = res.words.length;
  return res.strip();
};

// Shift-left in-place
BN.prototype.ishln = function ishln(bits) {
  assert(typeof bits === 'number' && bits >= 0);
  var r = bits % 24;
  var s = (bits - r) / 24;
  var carryMask = (0xffffff >> (24 - r)) << (24 - r);

  if (r !== 0) {
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var newCarry = this.words[i] & carryMask;
      var c = (this.words[i] - newCarry) << r;
      this.words[i] = c | carry;
      carry = newCarry >> (24 - r);
    }
    if (carry) {
      this.words[i] = carry;
      this.length++;
    }
  }

  if (s !== 0) {
    for (var i = this.words.length - 1; i >= 0; i--)
      this.words[i + s] = this.words[i];
    for (var i = 0; i < s; i++)
      this.words[i] = 0;
    this.length = this.words.length;
  }

  return this.strip();
};

// Shift-right in-place
// NOTE: `hint` is a lowest bit before trailing zeroes
BN.prototype.ishrn = function ishrn(bits, hint) {
  assert(typeof bits === 'number' && bits >= 0);
  if (!hint)
    hint = 0;
  else
    hint = (hint - (hint % 24)) / 24;

  var r = bits % 24;
  var s = (bits - r) / 24;
  var mask = 0xffffff ^ ((0xffffff >> r) << r);

  if (s !== 0) {
    hint -= s;
    hint = Math.max(0, hint);
    for (var i = s; i <= this.words.length; i++)
      this.words[i - s] = this.words[i];
    this.words.length = i - s - 1;
    this.length = this.words.length;
  }

  if (r !== 0) {
    var carry = 0;
    for (var i = this.length - 1; i >= 0 && (carry !== 0 || i >= hint); i--) {
      var word = this.words[i];
      this.words[i] = (carry << (24 - r)) | (this.words[i] >> r);
      carry = word & mask;
    }
  }

  if (this.length === 0) {
    this.words = [ 0 ];
    this.length = 1;
  }

  return this.strip();
};

// Shift-left
BN.prototype.shln = function shln(bits) {
  return this.clone().ishln(bits);
};

// Shift-right
BN.prototype.shrn = function shrn(bits) {
  return this.clone().ishrn(bits);
};

// Return only lowers bits of number (in-place)
BN.prototype.imaskn = function imaskn(bits) {
  assert(typeof bits === 'number' && bits >= 0);
  var r = bits % 24;
  var s = (bits - r) / 24;

  assert(!this.sign, 'imaskn works only with positive numbers');

  if (r !== 0)
    s++;
  this.words.length = Math.min(s, this.words.length);
  this.length = this.words.length;

  if (r !== 0) {
    var mask = 0xffffff ^ ((0xffffff >> r) << r);
    this.words[this.words.length - 1] &= mask;
  }

  return this.strip();
};

// Return only lowers bits of number
BN.prototype.maskn = function maskn(bits) {
  return this.clone().imaskn(bits);
};

// Add plain number `num` to `this`
BN.prototype.iaddn = function iaddn(num) {
  assert(typeof num === 'number');
  if (num < 0)
    return this.isubn(num);
  this.words[0] += num;

  // Carry
  for (var i = 0; i < this.length && this.words[i] >= 0x1000000; i++) {
    this.words[i] -= 0x1000000;
    if (i == this.length - 1)
      this.words[i + 1] = 1;
    else
      this.words[i + 1]++;
  }
  this.length = this.words.length;

  return this;
};

// Subtract plain number `num` from `this`
BN.prototype.isubn = function isubn(num) {
  assert(typeof num === 'number');
  assert(this.cmpn(num) >= 0, 'Sign change is not supported in isubn');
  if (num < 0)
    return this.iaddn(-num);
  this.words[0] -= num;

  // Carry
  for (var i = 0; i < this.length && this.words[i] < 0; i++) {
    this.words[i] += 0x1000000;
    this.words[i + 1] -= 1;
  }

  return this;
};

BN.prototype._shiftDiv = function _shiftDiv(num, mode) {
  // Find maximum Q, Q * num <= this
  var shift = Math.max(0, this.bitLength() - num.bitLength());
  var max = num.shln(shift);
  if (shift > 0 && this.cmp(max) < 0) {
    max.ishrn(1, shift);
    shift--;
  }
  var maxLen = max.bitLength();

  var c = this.clone();
  if (mode === 'mod') {
    var r = null;
    while (c.cmp(num) >= 0) {
      assert(shift >= 0);
      if (c.cmp(max) >= 0)
        c.isub(max);
      var delta = Math.max(1, maxLen - c.bitLength());
      max.ishrn(delta, shift);
      maxLen -= delta;
      shift -= delta;
    }
  } else {
    var r = new BN(0);
    while (c.cmp(num) >= 0) {
      assert(shift >= 0);
      if (c.cmp(max) >= 0) {
        c.isub(max);
        r.bincn(shift);
      }
      var delta = Math.max(1, maxLen - c.bitLength());
      max.ishrn(delta, shift);
      maxLen -= delta;
      shift -= delta;
    }
  }

  return { mod: c, div: r };
};

BN.prototype.divmod = function divmod(num, mode) {
  assert(num.cmpn(0) !== 0);

  if (this.sign && !num.sign) {
    var res = this.neg().divmod(num, mode);
    var div;
    var mod;
    if (mode !== 'mod')
      div = res.div.neg();
    if (mode !== 'div')
      mod = res.mod.cmpn(0) === 0 ? res.mod : num.sub(res.mod);
    return {
      div: div,
      mod: mod
    };
  } else if (!this.sign && num.sign) {
    var res = this.divmod(num.neg(), mode);
    var div;
    if (mode !== 'mod')
      div = res.div.neg();
    return { div: div, mod: res.mod };
  } else if (this.sign && num.sign) {
    return this.neg().divmod(num.neg(), mode);
  }

  // Both numbers are positive at this point

  // Strip both numbers to approximate shift value
  this.strip();
  num.strip();
  if (num.length > this.length || this.cmp(num) < 0)
    return { div: new BN(0), mod: this };
  else
    return this._shiftDiv(num, mode);
};

// Find `this` / `num`
BN.prototype.div = function div(num) {
  return this.divmod(num, 'div').div;
};

// Find `this` % `num`
BN.prototype.mod = function mod(num) {
  return this.divmod(num, 'mod').mod;
};

BN.prototype._egcd = function _egcd(x1, p) {
  assert(!p.sign);
  assert(p.cmpn(0) !== 0);

  var a = this;
  var b = p.clone();

  if (a.sign)
    a = a.mod(p);
  else
    a = a.clone();
  assert(a.cmpn(0) !== 0);

  x1 = x1.clone();
  var x2 = new BN(0);
  while (a.cmpn(1) !== 0 && b.cmpn(1) !== 0) {
    while (a.isEven()) {
      a.ishrn(1);
      if (x1.isEven())
        x1.ishrn(1);
      else
        x1 = x1.add(p).ishrn(1);
    }
    while (b.isEven()) {
      b.ishrn(1);
      if (x2.isEven())
        x2.ishrn(1);
      else
        x2 = x2.add(p).ishrn(1);
    }
    if (a.cmp(b) >= 0) {
      a.isub(b);
      x1.isub(x2);
    } else {
      b.isub(a);
      x2.isub(x1);
    }
  }
  if (a.cmpn(1) === 0)
    return x1.mod(p);
  else
    return x2.mod(p);
};

// Invert number in the field F(num)
BN.prototype.invm = function invm(num) {
  return this._egcd(new BN(1), num);
};

BN.prototype.isEven = function isEven(num) {
  return (this.words[0] & 1) === 0;
};

BN.prototype.isOdd = function isOdd(num) {
  return (this.words[0] & 1) === 1;
};

// And first word and num
BN.prototype.andln = function andln(num) {
  return this.words[0] & num;
};

// Increment at the bit position in-line
BN.prototype.bincn = function bincn(bit) {
  assert(typeof bit === 'number');
  var r = bit % 24;
  var s = (bit - r) / 24;
  var q = 1 << r;

  // Fast case: bit is much higher than all existing words
  if (this.length <= s) {
    for (var i = this.length; i < s + 1; i++)
      this.words[i] = 0;
    this.words[s] |= q;
    this.length = this.words.length;
    return this;
  }

  // Add bit and propagate, if needed
  var carry = q;
  for (var i = s; carry !== 0 && i < this.length; i++) {
    var w = this.words[i];
    w += carry;
    carry = w >> 24;
    w &= 0xffffff;
    this.words[i] = w;
  }
  if (carry !== 0)
    this.words[i] = carry;
  this.length = this.words.length;
  return this;
};

BN.prototype.cmpn = function cmpn(num) {
  var sign = num < 0;
  if (sign)
    num = -num;

  if (this.sign && !sign)
    return -1;
  else if (!this.sign && sign)
    return 1;

  num &= 0xffffff;
  this.strip();

  var res;
  if (this.length > 1) {
    res = 1;
  } else {
    var w = this.words[0];
    res = w === num ? 0 : w < num ? -1 : 1;
  }
  if (this.sign)
    res = -res;
  return res;
};

// Compare two numbers and return:
// 1 - if `this` > `num`
// 0 - if `this` == `num`
// -1 - if `this` < `num`
BN.prototype.cmp = function cmp(num) {
  if (this.sign && !num.sign)
    return -1;
  else if (!this.sign && num.sign)
    return 1;

  this.strip();
  num.strip();

  // At this point both numbers have the same sign
  if (this.length > num.length)
    return this.sign ? -1 : 1;
  else if (this.length < num.length)
    return this.sign ? 1 : -1;

  var res = 0;
  for (var i = this.length - 1; i >= 0; i--) {
    var a = this.words[i];
    var b = num.words[i];

    if (a === b)
      continue;
    if (a < b)
      res = -1;
    else if (a > b)
      res = 1;
    break;
  }
  if (this.sign)
    return -res;
  else
    return res;
};

BN.prototype.forceMont = function forceMont(ctx) {
  assert(!this.mont, 'Already a montgomery number');
  this.mont = ctx;
  return this;
};

BN.prototype.toMont = function toMont(ctx) {
  assert(!this.mont, 'Already a montgomery number');
  assert(!this.sign, 'mont works only with positives');
  var res = this.shln(ctx.shift).mod(ctx.m);
  res.mont = ctx;
  return res;
};

BN.prototype.fromMont = function fromMont() {
  assert(this.mont, 'fromMont works only with mont numbers');
  var ctx = this.mont;
  return this.mul(ctx.rinv).mod(ctx.m);
};

BN.prototype._montVerify = function _montVerify(num) {
  assert(!this.sign && !num.sign, 'mont works only with positives');
  assert(this.mont && this.mont === num.mont,
         'montAdd works only with mont numbers');
};

BN.prototype.montAdd = function montAdd(num) {
  this._montVerify(num);

  var mont = this.mont;
  var res = this.add(num);
  if (res.cmp(mont.m) >= 0)
    res.isub(mont.m);
  res.mont = mont;
  return res;
};

BN.prototype.montIAdd = function montIAdd(num) {
  this._montVerify(num);

  var mont = this.mont;
  var res = this.iadd(num);
  if (res.cmp(mont.m) >= 0)
    res.isub(mont.m);
  res.mont = mont;
  return res;
};

BN.prototype.montSub = function montSub(num) {
  this._montVerify(num);

  var mont = this.mont;
  var res = this.sub(num);
  if (res.cmpn(0) < 0)
    res.iadd(mont.m);

  res.mont = mont;
  return res;
};

BN.prototype.montISub = function montISub(num) {
  this._montVerify(num);

  var mont = this.mont;
  var res = this.isub(num);
  if (res.cmpn(0) < 0)
    res.iadd(mont.m);
  res.mont = mont;
  return res;
};

BN.prototype.montShl = function montShl(num) {
  assert(!this.sign, 'mont works only with positives');
  assert(this.mont, 'montShl works only with mont numbers');

  var mont = this.mont;
  var res = this.shln(num).mod(mont.m);

  res.mont = mont;
  return res;
};

BN.prototype.montMul = function montMul(num) {
  this._montVerify(num);

  var mont = this.mont;
  if (this.cmpn(0) === 0 || num.cmpn(0) === 0) {
    var res = new BN(0);
    res.mont = mont;
    return res;
  }

  var t = this.mul(num);
  var c = t.mul(mont.minv).imaskn(mont.shift).mul(mont.m);
  var u = t.isub(c).ishrn(mont.shift);
  var res = u;
  if (u.cmp(mont.m) >= 0)
    res = u.isub(mont.m);
  else if (u.cmpn(0) < 0)
    res = u.iadd(mont.m);

  res.mont = mont;
  return res;
};

BN.prototype.montSqr = function montSqr() {
  return this.montMul(this);
};

// Square root over p
BN.prototype.montSqrt = function montSqrt() {
  assert(!this.sign, 'mont works only with positives');
  assert(this.mont, 'montInvm works only with mont numbers');
  assert(this.cmpn(0) !== 0);

  var mont = this.mont;

  // Fast case
  if (mont.m.andln(3) === 3) {
    var pow = mont.m.add(new BN(1)).ishrn(2);
    var r = this.montPow(pow);
    return r;
  }

  // TODO(indutny): Tonelli-Shanks algorithm
  throw new Error('Not implemented yet, for p % 4 !== 3');
};

BN.prototype.montInvm = function montInvm() {
  assert(!this.sign, 'mont works only with positives');
  assert(this.mont, 'montInvm works only with mont numbers');
  // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
  var res = this.invm(this.mont.m).mul(this.mont.r2).mod(this.mont.m);
  res.mont = this.mont;
  return res;
};

// Return negative clone of `this` % `mont modulo`
BN.prototype.montNeg = function montNeg() {
  assert(!this.sign, 'mont works only with positives');
  assert(this.mont, 'montNeg works only with mont numbers');
  var r = this.clone();
  r.sign = !this.sign;
  r = r.iadd(this.mont.m);
  r.mont = this.mont;
  return r;
};

BN.prototype.montPow = function montPow(num) {
  assert(this.mont && !num.mont, 'montPow(montNum, normalNum)');

  var w = [];
  var q = num.clone();
  while (q.cmpn(0) !== 0) {
    w.push(q.andln(1));
    q.ishrn(1);
  }

  // Skip leading zeroes
  var res = this;
  for (var i = 0; i < w.length; i++, res = res.montSqr()) {
    if (w[i] !== 0)
      break;
  }

  if (++i < w.length) {
    for (var q = res.montSqr(); i < w.length; i++, q = q.montSqr()) {
      if (w[i] === 0)
        continue;
      res = res.montMul(q);
    }
  }

  return res;
};

BN.mont = function mont(num) {
  return new Mont(num);
};

function Mont(m) {
  this.m = m;
  this.shift = this.m.bitLength();
  if (this.shift % 24 !== 0)
    this.shift += 24 - (this.shift % 24);
  this.r = new BN(1).ishln(this.shift);
  this.r2 = this.r.sqr().mod(this.m);
  this.rinv = this.r.invm(this.m);

  // TODO(indutny): simplify it
  this.minv = this.rinv.mul(this.r)
                       .sub(new BN(1))
                       .div(this.m)
                       .neg()
                       .mod(this.r);
}
