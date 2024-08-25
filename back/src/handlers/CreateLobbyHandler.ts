import { CreateLobby, CreateLobbyRef } from "../../../state/src/sockets/clientMessageTypes/CreateLobby";
import { isValid } from "../../../state/src/sockets/Validator";
import { LobbiesData } from "../dataHolders/LobbiesData";
import { UserData } from "../dataHolders/UserData";
import { CreateLobbyResult } from '../../../state/src/sockets/serverMessageTypes/CreateLobbyResult';
import { PlayerState } from "../../../state/src/state/PlayerState";


// General idea: FooData classes handle modifying the underlying data model. House/road location, players
//  but the FooHandler classes actually handle sending data around to different sockets and data validation
export class CreateLobbyHandler {
    lobbiesData: LobbiesData;
    userData: UserData;
    constructor(lobbiesData: LobbiesData, userData: UserData) {
        this.lobbiesData = lobbiesData;
        this.userData = userData;
    }

    handle(o: Object, senderUUID: string) {
        if (!isValid(o, CreateLobbyRef)) return;
        const req = o as CreateLobby;
        console.log("WE HERE");
        
        const firstPlayer = new PlayerState(senderUUID, "USERNAME", "blue");

        const lobbyId = this.lobbiesData.createLobby(firstPlayer);
        console.log("YEAH");

        // Send success message
        const socket = this.userData.uuidToSocket.get(senderUUID);
        if (socket != undefined) {
            const res = new CreateLobbyResult(true, lobbyId);
            console.log("SENDING");
            socket.send(JSON.stringify(res));
            console.log("SENT");
            console.log(socket);
        }
    }
}