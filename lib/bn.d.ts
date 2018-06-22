/*
 * These types are based on [1] from @ukstv and [2] from @MicahZoltu.
 * If anything is wrong with these types, feel free to complain to @vsund.
 * 
 * [1] https://github.com/machinomy/types-bn
 * [2] https://github.com/indutny/bn.js/pull/179
 */


declare type Endianness = 'le' | 'be'

declare class BN {
  static isBN(b: any): boolean;
  static min(left: BN, right: BN): BN;
  static max(left: BN, right: BN): BN;

  constructor(number: number | string | number[] | Buffer, base?: number | 'hex', endian?: Endianness);
  clone(): BN;
  copy(dest: BN): void;
  inspect(): string;
  toString(base?: number | 'hex', length?: number): string;
  toNumber(): number;
  toJSON(): string;
  toArray(endian?: Endianness, length?: number): number[];
  toBuffer(endian?: Endianness, length?: number): Buffer;
  bitLength(): number;
  zeroBits(): number;
  byteLength(): number;
  isNeg(): boolean;
  isEven(): boolean;
  isOdd(): boolean;
  isZero(): boolean;
  cmp(b: BN): number;
  lt(b: BN): boolean;
  lte(b: BN): boolean;
  gt(b: BN): boolean;
  gte(b: BN): boolean;
  eq(b: BN): boolean;

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

  or(b: BN): BN;
  and(b: BN): BN;
  xor(b: BN): BN;
  setn(b: number): BN;
  shln(b: number): BN;
  shrn(b: number): BN;
  testn(b: number): boolean;
  maskn(b: number): BN;
  bincn(b: number): BN;
  notn(w: number): BN;

  gcd(b: BN): BN;
  egcd(b: BN): { a: BN, b: BN, gcd: BN };
  invm(b: BN): BN;
}

export = BN;
