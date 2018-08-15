/*
 * These types are based on [1] from @ukstv and [2] from @MicahZoltu.
 * If anything is wrong with these types, feel free to complain to @vsund.
 * 
 * [1] https://github.com/machinomy/types-bn
 * [2] https://github.com/indutny/bn.js/pull/179
 */


declare type Endianness = 'le' | 'be'

declare class BN {
  static isBN(b: any): b is BN;
  static min(left: BN, right: BN): BN;
  static max(left: BN, right: BN): BN;

  constructor(
    number: number | string | number[] | Buffer | Uint8Array,
    base?: number | 'hex',
    endian?: Endianness);

  // Utilities
  clone(): BN;
  copy(dest: BN): void;
  inspect(): string;
  toString(base?: number | 'hex', length?: number): string;
  toNumber(): number;
  toJSON(): string;
  toArray(endian?: Endianness, length?: number): number[];
  toArrayLike(constructor: Uint8ArrayConstructor, endian?: Endianness, length?: number): Uint8Array;
  toBuffer(endian?: Endianness, length?: number): Buffer;
  bitLength(): number;
  zeroBits(): number;
  byteLength(): number;
  isNeg(): boolean;
  isEven(): boolean;
  isOdd(): boolean;
  isZero(): boolean;
  cmp(b: BN): -1 | 0 | 1;
  ucmp(b: BN): -1 | 0 | 1;
  cmpn(b: number): -1 | 0 | 1;
  lt(b: BN): boolean;
  ltn(b: number): boolean;
  lte(b: BN): boolean;
  lten(b: number): boolean;
  gt(b: BN): boolean;
  gtn(b: number): boolean;
  gte(b: BN): boolean;
  gten(b: number): boolean;
  eq(b: BN): boolean;
  eqn(b: number): boolean;

  neg(): BN;
  abs(): BN;
  add(b: BN): BN;
  sub(b: BN): BN;
  mul(b: BN): BN;
  sqr(): BN;
  pow(b: BN): BN;
  div(b: BN): BN;
  mod(b: BN): BN;
  divRound(b: BN): BN;

  // Bitwise operations
  or(b: BN): BN;
  ior(b: BN): BN;
  uor(b: BN): BN;
  iuor(b: BN): BN;
  and(b: BN): BN;
  iand(b: BN): BN;
  uand(b: BN): BN;
  iuand(b: BN): BN;
  andln(b: BN): BN;
  xor(b: BN): BN;
  ixor(b: BN): BN;
  uxor(b: BN): BN;
  iuxor(b: BN): BN;
  setn(b: number): BN;
  shln(b: number): BN;
  ishln(b: number): BN;
  ushln(b: number): BN;
  iushln(b: number): BN;
  shrn(b: number): BN;
  ishrn(b: number): BN;
  ushrn(b: number): BN;
  iushrn(b: number): BN;
  testn(b: number): boolean;
  maskn(b: number): BN;
  imaskn(b: number): BN;
  bincn(b: number): BN;
  notn(w: number): BN;
  inotn(w: number): BN;

  gcd(b: BN): BN;
  egcd(b: BN): { a: BN, b: BN, gcd: BN };
  invm(b: BN): BN;
}

export = BN;
