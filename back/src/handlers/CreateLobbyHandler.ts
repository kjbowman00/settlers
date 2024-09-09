import { CreateLobby } from "../../../state/src/sockets/clientMessageTypes/CreateLobby";
import { LobbiesData } from "../dataHolders/LobbiesData";
import { UserData } from "../dataHolders/UserData";
import { CreateLobbyResult } from '../../../state/src/sockets/serverMessageTypes/CreateLobbyResult';
import { PlayerState } from "../../../state/src/state/PlayerState";
import { ServerSocketMessage } from '../../../state/src/sockets/ServerSocketMessage';
import { ServerMessageType } from '../../../state/src/sockets/ServerMessageType';


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
        if ( ! CreateLobby.validate(o) ) return;
        const req = o as CreateLobby;
        console.log("WE HERE");
        
        const firstPlayer = new PlayerState(senderUUID, "USERNAME", "blue");

        const lobby = this.lobbiesData.createLobby(firstPlayer);
        console.log("YEAH");

        // Send success message
        const socket = this.userData.uuidToSocket.get(senderUUID);
        if (socket != undefined) {
            const res = new ServerSocketMessage(
                0, ServerMessageType.CREATE_LOBBY_RESULT, new CreateLobbyResult(
                    true, lobby.lobbyState
                )
            );
            socket.send(JSON.stringify(res));
        }
    }
}