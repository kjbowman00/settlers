
export interface ITurnStarted {
    playerId: string;
}

export class TurnStarted implements ITurnStarted {
    playerId: string;
    constructor(playerId: string) {
        this.playerId = playerId;
    }
}
export const TurnStartedRef = new TurnStarted("");