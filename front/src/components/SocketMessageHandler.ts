import { IServerSocketMessage, ServerSocketMessage } from '../../../state/src/sockets/ServerSocketMessage';
import { ServerMessageType } from '../../../state/src/sockets/ServerMessageType';
import { CreateLobbyResultHandler } from '../messageHandlers/CreateLobbyResultHandler';
import { GameStartedHandler } from '../messageHandlers/GameStartedHandler';
import { JoinLobbyResultHandler } from '../messageHandlers/JoinLobbyResultHandler';
import { PlayerJoinedLobbyHandler } from '../messageHandlers/PlayerJoinedLobbyHandler';
import { TurnStartedHandler } from '../messageHandlers/TurnStartedHandler';
import { MenuManager } from './MenuManager';
import { ClientSocketMessage } from '../../../state/src/sockets/ClientSocketMessage';
import { ClientMessageType } from '../../../state/src/sockets/ClientMessageType';
import { WebsocketController } from './WebsocketController';

export class SocketMessageHandler {
    //Handlers
    createLobbyResultHandler;
    gameStartedHandler;
    joinLobbyResultHanlder; 
    playerJoinedLobbyHandler;
    turnStartedHandler = new TurnStartedHandler();

    websocketController: WebsocketController;
    responseWaitingMessages:ClientSocketMessage[] = [];
    msgCounter = 0;

    constructor(menuManager: MenuManager) {
        this.websocketController = new WebsocketController(this);

        this.createLobbyResultHandler = new CreateLobbyResultHandler(menuManager);
        this.joinLobbyResultHanlder = new JoinLobbyResultHandler(menuManager);
        this.playerJoinedLobbyHandler = new PlayerJoinedLobbyHandler(menuManager);
        this.gameStartedHandler = new GameStartedHandler(menuManager);
    }
    
    send(msg: object, msgType: ClientMessageType, responseExpected: boolean) {
        this.msgCounter++;
        const clientMessage = new ClientSocketMessage(
            this.msgCounter, msgType, msg
        );
        if (responseExpected) {
            this.responseWaitingMessages.push(clientMessage);
        }
        
        const str = JSON.stringify(clientMessage);
        this.websocketController.send(str);
    }


    onMessage(data: any) {
        let parsed;
        try {
            parsed = JSON.parse(data.toString());
        } catch (e){
            console.log("BAD DATA");
            return;
        }

        console.log("RECEIEVED");
        console.log(parsed);
        // Ensure data types match
        if ( ! ServerSocketMessage.validate(parsed) ) return;
        const socketMessage: IServerSocketMessage = parsed as IServerSocketMessage;

        // See if it is responding to something we are waiting for
        let waitingMessage = undefined;
        if (socketMessage.responseID != -1) {
            let i = 0;
            for (; i < this.responseWaitingMessages.length; i++) {
                const waiting = this.responseWaitingMessages[i];
                if (waiting.messageID == socketMessage.responseID) {
                    waitingMessage = waiting;
                    break;
                }
            }
            if (waitingMessage != undefined) {
                this.responseWaitingMessages.splice(i, 1);
            }
        }

        // Switch depending on what message type was sent.
        switch (socketMessage.messageType) {
            case ServerMessageType.CREATE_LOBBY_RESULT:
                this.createLobbyResultHandler.handle(socketMessage.payload, waitingMessage?.payload);
                break;
            case ServerMessageType.GAME_STARTED:
                this.gameStartedHandler.handle(socketMessage.payload);
                break;
            case ServerMessageType.JOIN_LOBBY_RESULT:
                this.joinLobbyResultHanlder.handle(socketMessage.payload, waitingMessage?.payload);
                break;
            case ServerMessageType.PLAYER_JOINED_LOBBY:
                this.playerJoinedLobbyHandler.handle(socketMessage.payload);
                break;
            case ServerMessageType.TURN_STARTED:
                this.turnStartedHandler.handle(socketMessage.payload);
                break;
        }
    }

}