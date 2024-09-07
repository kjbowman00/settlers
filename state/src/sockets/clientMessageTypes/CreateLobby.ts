
export interface ICreateLobby {
    // In the future, we will pass lobby settings here. World size, player limit, etc.
}

export class CreateLobby implements ICreateLobby {


    static validate(o: any) {
        return true;
    }
}