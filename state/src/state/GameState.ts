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

        this.tileState = new TileState();
        this.roadHouseState = new RoadHouseState(this.tileState.tileTypes);

    }


    validate(o: any): boolean {
        return typeof(o) !== 'undefined' &&
            typeof(o.roadHouseState) === 'object' &&
            RoadHouseState.validate(o.roadHouseState) &&
            typeof(o.tileState) === 'object' &&
            TileState.validate(o.tileState) &&
            typeof(o.seed) === 'number';
    }

}