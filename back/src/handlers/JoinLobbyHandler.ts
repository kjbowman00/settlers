import { JoinLobby, JoinLobbyRef } from "../../../state/src/messageTypes/JoinLobby";
import { isValid } from "../../../state/src/Validator";
import { LobbiesData } from "../dataHolders/LobbiesData";
import { UserData } from "../dataHolders/UserData";
import { JoinLobbyResult } from '../../../state/src/messageTypes/JoinLobbyResult';



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

        const success = this.lobbiesData.joinLobby(senderUUID, req.lobbyID);

        // Send success message
        const socket = this.userData.uuidToSocket.get(senderUUID);
        if (socket != undefined) {
            const res = new JoinLobbyResult(success);
            socket.send(JSON.stringify(res));
        }

        if (!success) return;
        // Send joined message to all other users in lobby
        const playerIds = this.lobbiesData.lobbyIdToLobbyData.get(req.lobbyID)!.players;
        for (const playerId of playerIds) {
            if (playerId != senderUUID) {
                const update = "TODO: player joined lobby";
                this.userData.uuidToSocket.get(playerId)?.send(JSON.stringify(update));
            }
        }
    }
}