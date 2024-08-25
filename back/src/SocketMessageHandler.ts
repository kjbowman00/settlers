import { ClientMessageType } from "../../state/src/sockets/ClientMessageType";
import { ClientSocketMessageRef, IClientSocketMessage } from "../../state/src/sockets/ClientSocketMessage";
import { isValid } from "../../state/src/sockets/Validator";
import { LobbiesData } from "./dataHolders/LobbiesData";
import { UserData } from "./dataHolders/UserData";
import { CreateLobbyHandler } from "./handlers/CreateLobbyHandler";
import { JoinLobbyHandler } from "./handlers/JoinLobbyHandler";

const lobbiesData = new LobbiesData();
const userData = new UserData();

const createLobbyHandler = new CreateLobbyHandler(lobbiesData, userData);
const joinLobbyHandler = new JoinLobbyHandler(lobbiesData, userData);

export class SocketMessageHandler {


    userConnected(id: string, socketWrapper: SocketWrapper) {
        userData.addUser(id, socketWrapper);

    }

    onMessage(uuid :string, data: any) {
        console.log('received: %s', data);
        console.log("uuid: ", uuid);
        
        let parsed;
        try {
            console.log(data.toString());
            parsed = JSON.parse(data.toString());
        } catch (e){
            console.log("BAD DATA");
            return;
        }

        console.log("RIGHT BEFORE VALIDATION CHECK");
        // Ensure data types match
        if (!isValid(parsed, ClientSocketMessageRef)) return;
        const socketMessage: IClientSocketMessage = parsed as IClientSocketMessage;
        console.log("Valid socket message");

        // Switch depending on what message type was sent.
        switch (socketMessage.messageType) {
        case ClientMessageType.JOIN_LOBBY:
            joinLobbyHandler.handle(parsed.payload, uuid);
            break;
        case ClientMessageType.CREATE_LOBBY:
            createLobbyHandler.handle(parsed.payload, uuid);
            break;
        case ClientMessageType.END_TURN:
            break;
        case ClientMessageType.LEAVE_LOBBY:
            break;
        case ClientMessageType.ROAD_HOUSE_CHANGE:
            break;
        case ClientMessageType.START_GAME:
            break;
        case ClientMessageType.TRADE_REQUEST:
            break;
        case ClientMessageType.UPDATE_PLAYER:
            break;
        }
    }

}

// Need this so we can mock sockets easily and test fake clients
export interface SocketWrapper {
    send: Function
}