
export interface IStartGame {
    // In the future, we will pass lobby settings here. World size, player limit, etc.
}

export class StartGame implements IStartGame {

    static validate(o: any) {
        return true;
    }
}