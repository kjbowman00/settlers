import { PlayerState } from "../../state/PlayerState";

export class JoinLobbyResult {
    success: boolean;
    lobbyID: string;
    players: PlayerState[];

    constructor(success: boolean, lobbyID: string, players: PlayerState[]) {
        this.success = success;
        this.lobbyID = lobbyID;
        this.players = players;
    }

    static validate(o: any) {
        let valid = typeof(o) === 'object' &&
            typeof(o.success) === 'boolean' && 
            typeof(o.lobbyID) === 'string' &&
            typeof(o.players) === 'object' &&
            Array.isArray(o.players);
        if (valid) {
            for (const item of o.players) {
                valid = valid && 
                    typeof(item) === 'object' &&
                    PlayerState.validate(item);
            }
        }
        return valid;
    }
}