import { CreateLobby } from "../../../state/src/sockets/clientMessageTypes/CreateLobby";
import { ClientSocketMessage } from "../../../state/src/sockets/ClientSocketMessage";
import { CreateLobbyResult } from "../../../state/src/sockets/serverMessageTypes/CreateLobbyResult";
import { MenuManager } from "../components/MenuManager";

export class CreateLobbyResultHandler {
    menuManager: MenuManager;

    constructor(menuManager:MenuManager) {
        this.menuManager = menuManager;
    }

    handle(data: any, waitingMsg: object | undefined) {
        console.log("HANDLING");
        console.log(data);
        if ( ! CreateLobbyResult.validate(data) ) return;

        const createLobbyResult = data as CreateLobbyResult;
        if ( ! createLobbyResult.success) return;

        const createLobbyReq = waitingMsg as CreateLobby;

        // Update the state
        this.menuManager.state = createLobbyResult.initialLobbyState;
        console.log("YO YO YO YO");
        console.log(this.menuManager.state);
        console.log(createLobbyResult);
        
        // Update menu to match new state
        this.menuManager.lobbyMenu.updateFromState();
        this.menuManager.switchToLobbyMenu();
    }
}