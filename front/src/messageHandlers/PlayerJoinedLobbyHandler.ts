import { PlayerJoinedLobby, PlayerJoinedLobbyRef } from "../../../state/src/sockets/serverMessageTypes/PlayerJoinedLobby";
import { isValid } from "../../../state/src/sockets/Validator";

export class PlayerJoinedLobbyHandler {

    handle(data: any) {
        if ( ! isValid(data, PlayerJoinedLobbyRef) ) return;

        const playerJoinedLobby = data as PlayerJoinedLobby;
        
    }
}