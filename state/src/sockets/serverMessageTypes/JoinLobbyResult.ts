import { LobbyState } from "../../state/LobbyState";
import { PlayerState } from "../../state/PlayerState";
import { validateType } from "../Validator";

export class JoinLobbyResult {
    success: boolean;
    currentLobbyState: LobbyState | undefined;

    constructor(success: boolean, currentLobbyState: LobbyState | undefined) {
        this.success = success;
        this.currentLobbyState = currentLobbyState;
    }

    static validate(_o: any) {
        const o = _o as JoinLobbyResult;
        return validateType(o, 'object') &&
            validateType(o.currentLobbyState, LobbyState, 'undefined') &&
            validateType(o.success, 'boolean');
    }
}