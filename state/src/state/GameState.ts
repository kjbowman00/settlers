import { SeededNumberGenerator } from "../misc/SeededNumberGenerator";
import { validateType } from "../sockets/Validator";
import { RoadHouseState } from "./RoadHouseState";
import { TileState } from "./TileState";

// All the state associated with actual gameplay on the canvas
export class GameState {
    roadHouseState: RoadHouseState;
    tileState: TileState;

    seed: number;

    // seeded random generator

    constructor(seed: number) {
        this.seed = seed;

        const random = new SeededNumberGenerator(seed);
        this.tileState = new TileState(random);
        this.roadHouseState = new RoadHouseState(this.tileState.tileTypes);

    }


    static validate(_o: any): boolean {
        const o = _o as GameState;
        return validateType(o, 'object') &&
            validateType(o.roadHouseState, RoadHouseState) &&
            validateType(o.tileState, TileState) &&
            validateType(o.seed, 'number');
    }

}