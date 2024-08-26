import { CreateLobbyResult, CreateLobbyResultRef } from "../../../state/src/sockets/serverMessageTypes/CreateLobbyResult";
import { isValid } from "../../../state/src/sockets/Validator";
import { MenuManager } from "../components/MenuManager";

export class CreateLobbyResultHandler {
    menuManager: MenuManager;

    constructor(menuManager:MenuManager) {
        this.menuManager = menuManager;
    }

    handle(data: any) {
        console.log("HANDLING");
        console.log(data);
        if ( ! isValid(data, CreateLobbyResultRef) ) return;

        const createLobbyResult = data as CreateLobbyResult;
        if ( ! createLobbyResult.success) return;
        
        // Update menu to show lobby
        this.menuManager.lobbyMenu.setLobbyNameDisplay(createLobbyResult.lobbyID);
        this.menuManager.lobbyMenu.setPlayersNamesDisplay([]);
        this.menuManager.switchToLobbyMenu();
    }
}