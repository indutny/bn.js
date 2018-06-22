import BN = require('../../');

let bn1: BN, bn2: BN;


console.log('Started to test TypeScript declarations with executing "test/typescript-test.ts"\n');



console.log('\nTesting BN.isBN()');

console.log(BN.isBN(42));
console.log(BN.isBN('not a number'));
console.log(BN.isBN(new BN(42)));
if(typeof BN.isBN(42) !== 'boolean') {
    throw new Error('BN.isBN() should return a boolean');
}


console.log('\nTesting BN.min()');

console.log(BN.min(new BN(42), new BN(43)).toNumber())
console.log(BN.min(new BN(44), new BN(43)).toNumber())
if(!BN.isBN(BN.min(new BN(42), new BN(43)))) {
    throw new Error('BN.min() should return a BN');
}


console.log('\nTesting BN.max()');

console.log(BN.max(new BN(42), new BN(43)).toNumber())
console.log(BN.max(new BN(44), new BN(43)).toNumber())
if(!BN.isBN(BN.max(new BN(42), new BN(43)))) {
    throw new Error('BN.max() should return a BN');
}


console.log('\nTesting new BN()');

console.log(new BN('1'));
console.log(new BN(1));
console.log(new BN([1, 2, 3]));
console.log(new BN(new Uint8Array([0x22, 0x77, 0xcc])));
console.log(new BN(new Buffer('1')));
console.log(new BN(11, 16));
console.log(new BN(11, 'hex'));
console.log(new BN(11, 16, 'le'));
console.log(new BN(11, 16, 'be'));
if(!BN.isBN(new BN(1))) {
    throw new Error('new BN() should return a BN');
}


console.log('\nTesting BN.clone()');

console.log(new BN(1).clone());
if(!BN.isBN(new BN(1).clone())) {
    throw new Error('BN.clone() should return a BN');
}


console.log('\nTesting BN.copy()');

bn1 = new BN(1);
bn2 = new BN(2);
console.log(bn2);
bn1.copy(bn2)
console.log(bn2);


console.log('\nTesting BN.inspect()');

console.log(new BN(1).inspect());
if(typeof (new BN(1)).inspect() !== 'string') {
    throw new Error('BN.inspect() should return a string');
}


console.log('\nTesting BN.toString()');

console.log(new BN(11).toString());
console.log(new BN(11).toString(16));
console.log(new BN(11).toString('hex'));
console.log(new BN(11, 16).toString(16));
console.log(new BN(11, 16).toString(16, 8));
if(typeof (new BN(11)).toString() !== 'string') {
    throw new Error('BN.toString() should return a string');
}


console.log('\nTesting BN.toNumber()');

console.log(new BN(11).toNumber());
if(typeof (new BN(11)).toNumber() !== 'number') {
    throw new Error('BN.toNumber() should return a number');
}


console.log('\nTesting BN.toArray()');

console.log(new BN(11).toArray());
if(!(new BN(11).toArray() instanceof Array)) {
    throw new Error('BN.toArray() should return an Array');
}
// uint32 max value
console.log(new BN(4294967295).toArray());


console.log('\nTesting BN.toBuffer()');

console.log(new BN(11).toBuffer());
if(!(new BN(11).toBuffer() instanceof Buffer)) {
    throw new Error('BN.toBuffer() should return a Buffer');
}


console.log('\nTesting BN.bitLength()');

console.log(new BN(11).bitLength());
if(typeof new BN(11).bitLength() !== 'number') {
    throw new Error('BN.bitLength() should return a number');
}


console.log('\nTesting BN.zeroBits()');

console.log(new BN(11).zeroBits());
if(typeof new BN(11).zeroBits() !== 'number') {
    throw new Error('BN.zeroBits() should return a number');
}


console.log('\nTesting BN.byteLength()');

console.log(new BN(11).byteLength());
if(typeof new BN(11).byteLength() !== 'number') {
    throw new Error('BN.byteLength() should return a number');
}


console.log('\nTesting BN.isNeg()');

console.log(new BN(11).isNeg());
console.log(new BN(-11).isNeg());
if(typeof new BN(11).isNeg() !== 'boolean') {
    throw new Error('BN.isNeg() should return a boolean');
}


console.log('\nTesting BN.isEven()');

console.log(new BN(11).isEven());
console.log(new BN(12).isEven());
if(typeof new BN(11).isEven() !== 'boolean') {
    throw new Error('BN.isEven() should return a boolean');
}


console.log('\nTesting BN.isOdd()');

console.log(new BN(11).isOdd());
console.log(new BN(12).isOdd());
if(typeof new BN(11).isOdd() !== 'boolean') {
    throw new Error('BN.isOdd() should return a boolean');
}


console.log('\nTesting BN.isZero()');

console.log(new BN(11).isZero());
console.log(new BN(0).isZero());
if(typeof new BN(11).isZero() !== 'boolean') {
    throw new Error('BN.isZero() should return a boolean');
}


console.log('\nTesting BN.cmp()');

bn1 = new BN(1);
bn2 = new BN(2);
console.log(bn1.cmp(bn2));
console.log(bn1.cmp(bn1));
if(typeof bn1.cmp(bn1) !== 'number') {
    throw new Error('BN.cmp() should return a number');
}


console.log('\nTesting BN.lt()');

console.log(bn1.lt(bn2));
console.log(bn1.lt(bn1));
if(typeof bn1.lt(bn1) !== 'boolean') {
    throw new Error('BN.lt() should return a boolean');
}


console.log('\nTesting BN.lte()');

console.log(bn1.lte(bn2));
console.log(bn1.lte(bn1));
if(typeof bn1.lte(bn1) !== 'boolean') {
    throw new Error('BN.lte() should return a boolean');
}


console.log('\nTesting BN.gt()');

console.log(bn1.gt(bn2));
console.log(bn1.gt(bn1));
if(typeof bn1.gt(bn1) !== 'boolean') {
    throw new Error('BN.gt() should return a boolean');
}


console.log('\nTesting BN.gte()');

console.log(bn1.gte(bn2));
console.log(bn1.gte(bn1));
if(typeof bn1.gte(bn1) !== 'boolean') {
    throw new Error('BN.gte() should return a boolean');
}


console.log('\nTesting BN.eq()');

console.log(bn1.eq(bn2));
console.log(bn1.eq(bn1));
if(typeof bn1.eq(bn1) !== 'boolean') {
    throw new Error('BN.eq() should return a boolean');
}


console.log('\nTesting BN.neg()');

console.log(bn1.neg());
if(!BN.isBN(bn1.neg())) {
    throw new Error('BN.neg() should return a BN');
}


console.log('\nTesting BN.abs()');

console.log(bn1.neg().abs());
if(!BN.isBN(bn1.neg().abs())) {
    throw new Error('BN.abs() should return a BN');
}


console.log('\nTesting BN.add()');

console.log(bn1.add(bn2));
if(!BN.isBN(bn1.add(bn2))) {
    throw new Error('BN.add() should return a BN');
}


console.log('\nTesting BN.sub()');

console.log(bn1.sub(bn2));
if(!BN.isBN(bn1.sub(bn2))) {
    throw new Error('BN.sub() should return a BN');
}


console.log('\nTesting BN.mul()');

console.log(bn1.mul(bn2));
if(!BN.isBN(bn1.mul(bn2))) {
    throw new Error('BN.mul() should return a BN');
}


console.log('\nTesting BN.sqr()');

console.log(bn1.sqr());
if(!BN.isBN(bn1.sqr())) {
    throw new Error('BN.sqr() should return a BN');
}


console.log('\nTesting BN.pow()');

console.log(bn1.pow(bn2));
if(!BN.isBN(bn1.pow(bn2))) {
    throw new Error('BN.pow() should return a BN');
}


console.log('\nTesting BN.div()');

console.log(bn1.div(bn2));
if(!BN.isBN(bn1.div(bn2))) {
    throw new Error('BN.div() should return a BN');
}


console.log('\nTesting BN.mod()');

console.log(bn1.mod(bn2));
if(!BN.isBN(bn1.mod(bn2))) {
    throw new Error('BN.mod() should return a BN');
}


console.log('\nTesting BN.divRound()');

console.log(bn1.divRound(bn2));
if(!BN.isBN(bn1.divRound(bn2))) {
    throw new Error('BN.divRound() should return a BN');
}


console.log('\nTesting BN.or()');

console.log(bn1.or(bn2));
if(!BN.isBN(bn1.or(bn2))) {
    throw new Error('BN.or() should return a BN');
}


console.log('\nTesting BN.and()');

console.log(bn1.and(bn2));
if(!BN.isBN(bn1.and(bn2))) {
    throw new Error('BN.and() should return a BN');
}


console.log('\nTesting BN.xor()');

console.log(bn1.xor(bn2));
if(!BN.isBN(bn1.xor(bn2))) {
    throw new Error('BN.xor() should return a BN');
}


console.log('\nTesting BN.setn()');

console.log(bn1.setn(1));
if(!BN.isBN(bn1.setn(1))) {
    throw new Error('BN.setn() should return a BN');
}


console.log('\nTesting BN.shln()');

console.log(bn1.shln(1));
if(!BN.isBN(bn1.shln(1))) {
    throw new Error('BN.shln() should return a BN');
}


console.log('\nTesting BN.shrn()');

console.log(bn1.shrn(1));
if(!BN.isBN(bn1.shrn(1))) {
    throw new Error('BN.shrn() should return a BN');
}


console.log('\nTesting BN.testn()');

console.log(bn1.testn(1));
if(typeof bn1.testn(1) !== 'boolean') {
    throw new Error('BN.testn() should return a boolean');
}


console.log('\nTesting BN.maskn()');

console.log(bn1.maskn(1));
if(!BN.isBN(bn1.maskn(1))) {
    throw new Error('BN.maskn() should return a BN');
}


console.log('\nTesting BN.bincn()');

console.log(bn1.bincn(1));
if(!BN.isBN(bn1.bincn(1))) {
    throw new Error('BN.bincn() should return a BN');
}


console.log('\nTesting BN.notn()');

console.log(bn1.notn(1));
if(!BN.isBN(bn1.notn(1))) {
    throw new Error('BN.notn() should return a BN');
}


console.log('\nTesting BN.gcd()');

console.log(bn1.gcd(bn2));
if(!BN.isBN(bn1.gcd(bn2))) {
    throw new Error('BN.gcd() should return a BN');
}


console.log('\nTesting BN.egcd()');

console.log(bn1.egcd(bn2));
if(!(bn1.egcd(bn2).a instanceof BN) || !(bn1.egcd(bn2).b instanceof BN) || !(bn1.egcd(bn2).gcd instanceof BN)) {
    throw new Error('BN.egcd() should return a { a: BN, b: BN, gcd: BN }');
}


console.log('\nTesting BN.invm()');

console.log(bn1.invm(bn2));
if(!BN.isBN(bn1.invm(bn2))) {
    throw new Error('BN.invm() should return a BN');
}



console.log('\n\nFinished with testing TypeScript declarations');
console.log('If you see this, everything might have worked');
