declare module 'bn.js' {
    class BN {
        constructor(value: string | number, radix?: number);
        toString(radix: number): string;
        toNumber(): number;
        add(other: BN): BN;
        sub(other: BN): BN;
        mul(other: BN): BN;
        div(other: BN): BN;
        pow(other: BN): BN;

        static min(... args: Array<number|string|BN>): BN;
        static max(... args: Array<number|string|BN>): BN;
    }

    export = BN;
}
