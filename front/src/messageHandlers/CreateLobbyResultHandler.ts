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
        //TODO: createLobbyReq.name
        
        // Update menu to show lobby
        this.menuManager.lobbyMenu.setLobbyNameDisplay(createLobbyResult.lobbyID);
        this.menuManager.lobbyMenu.setPlayersNamesDisplay(['your_name_here']);
        this.menuManager.switchToLobbyMenu();
    }
}