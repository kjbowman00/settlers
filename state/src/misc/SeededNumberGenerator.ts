
export class SeededNumberGenerator {
    seed: number;
    constructor(seed: number) {
        this.seed = seed;
    }

    random() {
        // Re-seed
        let a = this.seed;
        a |= 0;
        a = a + 0x9e3779b9 | 0;
        this.seed = a;

        // Randomize
        let t = a ^ a >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }

    randomFloatRange(low: number, high: number) {
        const r = this.random();
        return low + (high-low)*r;
    }
}