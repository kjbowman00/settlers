import { JoinLobby, JoinLobbyRef } from "../../../state/src/sockets/clientMessageTypes/JoinLobby";
import { isValid } from "../../../state/src/sockets/Validator";
import { LobbiesData } from "../dataHolders/LobbiesData";
import { UserData } from "../dataHolders/UserData";
import { JoinLobbyResult } from '../../../state/src/sockets/serverMessageTypes/JoinLobbyResult';
import { PlayerState } from "../../../state/src/state/PlayerState";



export class JoinLobbyHandler {
    lobbiesData: LobbiesData;
    userData: UserData;
    constructor(lobbiesData: LobbiesData, userData: UserData) {
        this.lobbiesData = lobbiesData;
        this.userData = userData;
    }

    handle(o: Object, senderUUID: string) {
        if (!isValid(o, JoinLobbyRef)) return;
        const req = o as JoinLobby;
        console.log("VALID JOIN LOBBY: ", req);

        const newState = new PlayerState(senderUUID, "USERNAME", "blue");

        const success = this.lobbiesData.joinLobby(newState, req.lobbyID);

        // Send success message
        const socket = this.userData.uuidToSocket.get(senderUUID);
        if (socket != undefined) {
            const res = new JoinLobbyResult(success);
            socket.send(JSON.stringify(res));
        }

        if (!success) return;
        // Send joined message to all other users in lobby
        const players = this.lobbiesData.lobbyIdToLobbyData.get(req.lobbyID)!.players;
        for (const player of players) {
            if (player.id != senderUUID) {
                const update = "TODO: player joined lobby";
                this.userData.uuidToSocket.get(player.id)?.send(JSON.stringify(update));
            }
        }
    }
}