import { StateUpdateType, StateUpdate } from "../state/StateUpdate";
import { PlayerLobbyStateUpdate, PlayerLobbyStateUpdateType } from "../state/lobby/PlayerLobbyStateUpdate";
import { AppSync } from "./AWSAppSync";
import { GameBox } from "./GameMenu";
import { LobbyMenu } from "./LobbyMenu";
import { MainMenu } from "./MainMenu";
import { randomPlayerColor, randomPlayerName } from "../utility/PlayerRandomizer";
import { ThreeJSCanvas } from "./ThreeJSCanvas";
import { LoadingMenu } from "./LoadingMenu";
import { StateUpdateController } from "../state/StateUpdateController";
import { AWSWebSocketConnector } from "./AWSWebSocketConnector";
import { WebsocketController } from "./WebsocketController";
import { SocketMessageHandler } from "./SocketMessageHandler";
import { JoinLobby } from "../../../state/src/sockets/clientMessageTypes/JoinLobby";
import { ClientMessageType } from "../../../state/src/sockets/ClientMessageType";
import { LobbyState } from "../../../state/src/state/LobbyState";

export class MenuManager {
    mainMenu: MainMenu;
    lobbyMenu: LobbyMenu;
    gameBox: GameBox;
    loadingMenu: LoadingMenu;

    socketMessageHandler: SocketMessageHandler;
    state: LobbyState | undefined; // Undefined if haven't joined a lobby yet

    constructor() {
        this.mainMenu = new MainMenu(this);
        this.lobbyMenu = new LobbyMenu(this);
        this.gameBox = new GameBox(this);
        this.loadingMenu = new LoadingMenu(this);

        this.socketMessageHandler = new SocketMessageHandler(this);

        // Auto-join lobby
        let params = new URLSearchParams(document.location.search);
        let lobbyName = params.get("lobbyName");
        if (lobbyName != null) {
            // this.switchToLoading(false, null, null, lobbyName);  
            this.switchToLoading();
            this.socketMessageHandler.send(new JoinLobby(lobbyName), ClientMessageType.JOIN_LOBBY, true);
        }
    }

    initializeState(state: LobbyState) {
        this.state = state;
    }

    switchToMainMenu() {
        this.hideAll();
        this.mainMenu.show();
    }

    switchToLobbyMenu() {
        this.hideAll();
        this.lobbyMenu.show();
    }

    switchToLoading() {
        this.hideAll();
        this.loadingMenu.show();
    }

    switchToGame() {
        this.hideAll();
        this.gameBox.show();
        ThreeJSCanvas(this.state!.gameState!);
    }

    hideAll() {
        this.mainMenu.hide();
        this.lobbyMenu.hide();
        this.gameBox.hide();
        this.loadingMenu.hide();
    }
}