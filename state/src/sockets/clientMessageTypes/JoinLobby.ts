
export interface IJoinLobby {
    lobbyID: string;
}

export class JoinLobby implements IJoinLobby {
    lobbyID: string;

    constructor(lobbyID: string) {
        this.lobbyID = lobbyID;
    }
}
export const JoinLobbyRef = new JoinLobby('');