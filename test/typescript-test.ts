import { BN } from '../';


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

let bn1 = new BN(1);
let bn2 = new BN(2);
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



console.log('\n\nFinished with testing TypeScript declarations');
console.log('If you see this, everything might have worked');
