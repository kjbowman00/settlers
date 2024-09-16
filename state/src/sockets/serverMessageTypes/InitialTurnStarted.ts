
export class InitialTurnStarted {
    playerId: string;
    constructor(playerId: string) {
        this.playerId = playerId;
    }
    static validate(o: any) {
        return typeof(o) === 'object' &&
            typeof(o.playerId) === 'string';
    }
}