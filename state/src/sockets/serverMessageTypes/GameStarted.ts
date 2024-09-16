import { ITurnStarted, TurnStarted } from "./TurnStarted";


export class GameStarted {
    seed: number;
    settings: object;

    constructor(
                settings: object,
                seed: number
    ) {
        this.seed = seed;
        this.settings = settings;
    }

    static validate(o: any) {
        return typeof(o.seed) === 'number' &&
            typeof(o.settings) === 'object';
    }
}