
export interface IJoinLobby {
    lobbyID: string;
}

export class JoinLobby implements IJoinLobby {
    lobbyID: string;

    constructor(lobbyID: string) {
        this.lobbyID = lobbyID;
    }

    static validate(o: any) {
        return typeof o.lobbyID === 'string';
    }
}