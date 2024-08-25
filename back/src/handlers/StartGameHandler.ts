import { StartGame, StartGameRef } from "../../../state/src/sockets/clientMessageTypes/StartGame";
import { isValid } from "../../../state/src/sockets/Validator";
import { LobbiesData } from "../dataHolders/LobbiesData";
import { UserData } from "../dataHolders/UserData";

export class StartGameHandler {
    lobbiesData: LobbiesData;
    userData: UserData;
    constructor(lobbiesData: LobbiesData, userData: UserData) {
        this.lobbiesData = lobbiesData;
        this.userData = userData;
    }

    handle(o: Object, senderUUID: string) {
        if (!isValid(o, StartGameRef)) return;
        const req = o as StartGame;

        const lobbyData = this.lobbiesData.getLobbyDataFromPlayer(senderUUID);
        if (lobbyData == undefined) return;

        // Start the game
        lobbyData.startGame();
        
    }
}