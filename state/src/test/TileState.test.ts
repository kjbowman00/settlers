import { SeededNumberGenerator } from "../misc/SeededNumberGenerator";
import { TileState } from "../state/TileState";

test("Test tile types", () => {
    const tileState = new TileState(new SeededNumberGenerator(1));
});