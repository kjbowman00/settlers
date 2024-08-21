import { CreateLobby, CreateLobbyRef } from "../../../state/src/messageTypes/CreateLobby";
import { isValid } from "../../../state/src/Validator";
import { LobbiesData } from "../dataHolders/LobbiesData";
import { UserData } from "../dataHolders/UserData";
import { CreateLobbyResult } from '../../../state/src/messageTypes/CreateLobbyResult';


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

        const lobbyId = this.lobbiesData.createLobby(senderUUID);

        // Send success message
        const socket = this.userData.uuidToSocket.get(senderUUID);
        if (socket != undefined) {
            const res = new CreateLobbyResult(true, lobbyId);
            socket.send(JSON.stringify(res));
        }
    }
}