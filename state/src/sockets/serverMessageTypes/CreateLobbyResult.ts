import { LobbyState } from "../../state/LobbyState";

export class CreateLobbyResult {
    initialLobbyState: LobbyState;
    success: boolean;

    constructor(success: boolean, initialLobbyState: LobbyState) {
        this.success = success;
    }

    static validate(o: any) {
        return typeof(o) !== 'undefined' &&
            typeof(o.success) === 'boolean' &&
            typeof(o.initialLobbyState) === 'object' &&
            LobbyState.validate(o.initialLobbyState);
    }
}