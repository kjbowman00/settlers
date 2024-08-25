import { PlayerState } from "../../state/PlayerState";

export interface IPlayerJoinedLobby {
    player: PlayerState;
}

export class PlayerJoinedLobby implements IPlayerJoinedLobby{
    player: PlayerState;

    constructor(player: PlayerState) {
        this.player = player;
    }

}
export const PlayerJoinedLobbyRef = new PlayerJoinedLobby(new PlayerState('','',''));