
export interface ILeaveLobby {
}

export class LeaveLobby implements ILeaveLobby {

    static validate(o: any) {
        return true;
    }
}