import { JoinLobby } from "../../../state/src/sockets/clientMessageTypes/JoinLobby";
import { LobbiesData } from "../dataHolders/LobbiesData";
import { UserData } from "../dataHolders/UserData";
import { JoinLobbyResult } from '../../../state/src/sockets/serverMessageTypes/JoinLobbyResult';
import { PlayerState } from "../../../state/src/state/PlayerState";
import { ServerSocketMessage } from "../../../state/src/sockets/ServerSocketMessage";
import { ServerMessageType } from "../../../state/src/sockets/ServerMessageType";
import { PlayerJoinedLobby } from "../../../state/src/sockets/serverMessageTypes/PlayerJoinedLobby";



export class JoinLobbyHandler {
    lobbiesData: LobbiesData;
    userData: UserData;
    constructor(lobbiesData: LobbiesData, userData: UserData) {
        this.lobbiesData = lobbiesData;
        this.userData = userData;
    }

    handle(o: Object, senderUUID: string, msgNumber: number) {
        if ( ! JoinLobby.validate(o) ) return;
        const req = o as JoinLobby;
        console.log("VALID JOIN LOBBY: ", req);

        const newState = new PlayerState(senderUUID, "USERNAME", "blue");

        const success = this.lobbiesData.joinLobby(newState, req.lobbyID);

        // Send success message
        const socket = this.userData.uuidToSocket.get(senderUUID);
        const lobby = this.lobbiesData.lobbyIdToLobbyData.get(req.lobbyID)!;

        if (socket != undefined) {
            const res = new ServerSocketMessage(
                msgNumber, ServerMessageType.JOIN_LOBBY_RESULT, 
                new JoinLobbyResult(success, lobby.lobbyState));
            socket.send(JSON.stringify(res));
        }

        if (!success) return;
        // Send joined message to all other users in lobby
        for (const player of lobby.lobbyState.players) {
            if (player.id != senderUUID) {
                const msg = new ServerSocketMessage(
                    -1, ServerMessageType.PLAYER_JOINED_LOBBY, new PlayerJoinedLobby(
                        newState
                    )
                );
                this.userData.uuidToSocket.get(player.id)?.send(JSON.stringify(msg));
            }
        }
    }
}