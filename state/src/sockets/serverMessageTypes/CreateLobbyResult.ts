import { LobbyState } from "../../state/LobbyState";
import { validateType } from "../Validator";

export class CreateLobbyResult {
    initialLobbyState: LobbyState;
    success: boolean;

    constructor(success: boolean, initialLobbyState: LobbyState) {
        this.success = success;
        this.initialLobbyState = initialLobbyState;
    }

    static validate(_o: any): boolean {
        const o = _o as CreateLobbyResult;
        return validateType(o, 'object') &&
            validateType(o.initialLobbyState, LobbyState) &&
            validateType(o.success, 'boolean');
    }
}