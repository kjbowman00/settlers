import { ServerSocketMessageRef, IServerSocketMessage } from '../../../state/src/sockets/ServerSocketMessage';
import { isValid } from '../../../state/src/sockets/Validator';
import { ServerMessageType } from '../../../state/src/sockets/ServerMessageType';
import { CreateLobbyResultHandler } from '../messageHandlers/CreateLobbyResultHandler';
import { GameStartedHandler } from '../messageHandlers/GameStartedHandler';
import { JoinLobbyResultHandler } from '../messageHandlers/JoinLobbyResultHandler';
import { PlayerJoinedLobbyHandler } from '../messageHandlers/PlayerJoinedLobbyHandler';
import { TurnStartedHandler } from '../messageHandlers/TurnStartedHandler';
import { MenuManager } from './MenuManager';

export class SocketMessageHandler {
    //Handlers
    createLobbyResultHandler;
    gameStartedHandler = new GameStartedHandler();
    joinLobbyResultHanlder = new JoinLobbyResultHandler();
    playerJoinedLobbyHandler = new PlayerJoinedLobbyHandler();
    turnStartedHandler = new TurnStartedHandler();

    constructor(menuManager: MenuManager) {
        this.createLobbyResultHandler = new CreateLobbyResultHandler(menuManager);

    }


    onMessage(data: any) {
        let parsed;
        try {
            parsed = JSON.parse(data.toString());
        } catch (e){
            console.log("BAD DATA");
            return;
        }

        // Ensure data types match
        if (!isValid(parsed, ServerSocketMessageRef)) return;
        const socketMessage: IServerSocketMessage = parsed as IServerSocketMessage;

        // Switch depending on what message type was sent.
        switch (socketMessage.messageType) {
            case ServerMessageType.CREATE_LOBBY_RESULT:
                this.createLobbyResultHandler.handle(socketMessage.payload);
                break;
            case ServerMessageType.GAME_STARTED:
                this.gameStartedHandler.handle(socketMessage.payload);
                break;
            case ServerMessageType.JOIN_LOBBY_RESULT:
                this.joinLobbyResultHanlder.handle(socketMessage.payload);
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