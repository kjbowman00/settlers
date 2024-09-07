import { PlayerState } from "../../state/PlayerState";

export interface IPlayerJoinedLobby {
    player: PlayerState;
}

export class PlayerJoinedLobby implements IPlayerJoinedLobby{
    player: PlayerState;

    constructor(player: PlayerState) {
        this.player = player;
    }

    static validate(o: any) {
        return typeof(o) === 'object' &&
            typeof(o.player) === 'object' &&
            PlayerState.validate(o.player);
    }
}