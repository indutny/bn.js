var BN = require("../lib/bn.js").BN
var fixtures = require("./fixtures.js")

//var a = new BN("1");
//var b = new BN("1");

//var a = new BN("123");
//var b = new BN("123");

//var a = new BN("123456");
//var b = new BN("123456");

//var a = new BN("12345690");
//var b = new BN("1234560");

//var a = new BN("123456900");
//var b = new BN("12345601");

//var a = new BN("123456789");
//var b = new BN("123456780");

//var a = new BN("123456789");
//var b = new BN("123456789");

//var a = new BN(
//                '13f29a3e0bc10e100ce0', 16);
//var b = a.clone();


var a = new BN(fixtures.dhGroups.p17.q, 16);
var b = a.clone();
var qs = fixtures.dhGroups.p17.qs;

var c   = a.mulf(b);
var c_  = a.mul(b);

//console.log(c.words);
console.log(c);
console.log("------")
//console.log(c_.words);
console.log(c_);

//assert(c === new BN(2))
