
export interface IEndTurn {
}

export class EndTurn implements IEndTurn {
    constructor() {
    }

    static validate(o: any) {
        return true;
    }
}