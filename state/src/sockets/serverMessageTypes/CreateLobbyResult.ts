
export interface ICreateLobbyResult {
    success: boolean;
    lobbyID: string;
}

export class CreateLobbyResult implements ICreateLobbyResult {
    lobbyID: string;
    success: boolean;

    constructor(success: boolean, lobbyID: string) {
        this.success = success;
        this.lobbyID = lobbyID;
    }
}
export const CreateLobbyResultRef = new CreateLobbyResult(true, '');