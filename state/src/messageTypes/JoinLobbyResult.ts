
export interface IJoinLobbyResult {
    success: boolean;
}

export class JoinLobbyResult implements IJoinLobbyResult {
    success: boolean;

    constructor(success: boolean) {
        this.success = success;
    }

}
export const JoinLobbyResultRef = new JoinLobbyResult(true);