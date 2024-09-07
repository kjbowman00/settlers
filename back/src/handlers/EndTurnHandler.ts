import { EndTurn } from "../../../state/src/sockets/clientMessageTypes/EndTurn";
import { LobbiesData } from "../dataHolders/LobbiesData";
import { UserData } from "../dataHolders/UserData";

export class EndTurnHandler {
    lobbiesData: LobbiesData;
    userData: UserData;
    constructor(lobbiesData: LobbiesData, userData: UserData) {
        this.lobbiesData = lobbiesData;
        this.userData = userData;
    }

    handle(o: Object, senderUUID: string) {
        if ( ! EndTurn.validate(o) ) return;
        const req = o as EndTurn;

        const lobbyData = this.lobbiesData.getLobbyDataFromPlayer(senderUUID);
        if (lobbyData == undefined) return;

        lobbyData.endTurnRequest(senderUUID);
    }
}