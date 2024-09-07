import { ClientMessageType } from "../../state/src/sockets/ClientMessageType";
import { ClientSocketMessage, IClientSocketMessage } from "../../state/src/sockets/ClientSocketMessage";
import { LobbiesData } from "./dataHolders/LobbiesData";
import { UserData } from "./dataHolders/UserData";
import { CreateLobbyHandler } from "./handlers/CreateLobbyHandler";
import { EndTurnHandler } from "./handlers/EndTurnHandler";
import { JoinLobbyHandler } from "./handlers/JoinLobbyHandler";
import { StartGameHandler } from "./handlers/StartGameHandler";


export class SocketMessageHandler {
    running = true;

    userData = new UserData();
    lobbiesData = new LobbiesData(this.userData);

    createLobbyHandler = new CreateLobbyHandler(this.lobbiesData, this.userData);
    joinLobbyHandler = new JoinLobbyHandler(this.lobbiesData, this.userData);
    startGamehandler = new StartGameHandler(this.lobbiesData, this.userData);
    endTurnHandler = new EndTurnHandler(this.lobbiesData, this.userData);

    userConnected(id: string, socketWrapper: SocketWrapper) {
        if ( ! this.running) return;
        this.userData.addUser(id, socketWrapper);
    }

    onMessage(uuid :string, data: any) {
        if ( ! this.running) return;
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
        if ( ! ClientSocketMessage.validate(parsed) ) return;
        const socketMessage: IClientSocketMessage = parsed as IClientSocketMessage;
        console.log("Valid socket message");

        // Switch depending on what message type was sent.
        switch (socketMessage.messageType) {
        case ClientMessageType.JOIN_LOBBY:
            this.joinLobbyHandler.handle(parsed.payload, uuid, socketMessage.messageID);
            break;
        case ClientMessageType.CREATE_LOBBY:
            this.createLobbyHandler.handle(parsed.payload, uuid);
            break;
        case ClientMessageType.END_TURN:
            this.endTurnHandler.handle(parsed.payload, uuid);
            break;
        case ClientMessageType.LEAVE_LOBBY:
            break;
        case ClientMessageType.ROAD_HOUSE_CHANGE:
            break;
        case ClientMessageType.START_GAME:
            this.startGamehandler.handle(parsed.payload, uuid);
            break;
        case ClientMessageType.TRADE_REQUEST:
            break;
        case ClientMessageType.UPDATE_PLAYER:
            break;
        }
    }

    shutdown() {
        // Prevent any more connections
        this.running = false;

        // Clean up all lobby timers
        this.lobbiesData.lobbyIdToLobbyData.forEach((lobby) => {
            lobby.shutdown();
        });

        // Notify all clients that this server has gone down
        //TODO:
    }
}

// Need this so we can mock sockets easily and test fake clients
export interface SocketWrapper {
    send: Function
}