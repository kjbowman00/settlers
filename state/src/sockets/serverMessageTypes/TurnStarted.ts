
export interface ITurnStarted {
    playerId: string;
}

export class TurnStarted implements ITurnStarted {
    playerId: string;
    constructor(playerId: string) {
        this.playerId = playerId;
    }
    static validate(o: any) {
        return typeof(o) === 'object' &&
            typeof(o.playerId) === 'string';
    }
}