import { SeededNumberGenerator } from '../misc/SeededNumberGenerator';

test("Test random", () => {
    const random = new SeededNumberGenerator(1);

    for (let i = 0; i < 100; i++) {
        const r = random.random();
        expect(r >= 0).toBe(true);
        expect(r <= 1).toBe(true);
    }
});

test("Test random range", () => {
    const random = new SeededNumberGenerator(1);
    const low = 20;
    const high = 25;

    for (let i = 0; i < 100; i++) {
        const r = random.randomFloatRange(low, high);
        expect(r >= low).toBe(true);
        expect(r <= high).toBe(true);
    }
});