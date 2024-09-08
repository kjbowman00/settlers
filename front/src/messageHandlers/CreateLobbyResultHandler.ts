import { CreateLobby } from "../../../state/src/sockets/clientMessageTypes/CreateLobby";
import { ClientSocketMessage } from "../../../state/src/sockets/ClientSocketMessage";
import { CreateLobbyResult, CreateLobbyResultRef } from "../../../state/src/sockets/serverMessageTypes/CreateLobbyResult";
import { isValid } from "../../../state/src/sockets/Validator";
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
        this.menuManager.lobbyState = createLobbyResult.initialLobbyState;
        
        // Update menu to match new state
        this.menuManager.lobbyMenu.updateFromState();
    }
}