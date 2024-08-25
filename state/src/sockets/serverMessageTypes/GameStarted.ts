import { ITurnStarted, TurnStarted } from "./TurnStarted";

export interface IGameStarted {
    firstPlayersTurn: ITurnStarted;
    seed: number;
    settings: object;
}

export class GameStarted implements IGameStarted {
    seed: number;
    settings: object;
    firstPlayersTurn: ITurnStarted;

    constructor(firstPlayersTurn: ITurnStarted,
                settings: object,
                seed: number
    ) {
        this.seed = seed;
        this.firstPlayersTurn = firstPlayersTurn;
        this.settings = settings;
    }
}
export const GameStartedRef = new GameStarted(new TurnStarted(""), {}, 1);