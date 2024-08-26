import { JoinLobbyResult, JoinLobbyResultRef } from "../../../state/src/sockets/serverMessageTypes/JoinLobbyResult";
import { isValid } from "../../../state/src/sockets/Validator";
import { MenuManager } from "../components/MenuManager";

export class JoinLobbyResultHandler {
    menuManager: MenuManager;

    constructor(menuManager:MenuManager) {
        this.menuManager = menuManager;
    }

    handle(data: any, ) {
        if ( ! isValid(data, JoinLobbyResultRef) ) return;

        const joinLobbyResult = data as JoinLobbyResult;
        if (! joinLobbyResult.success) return; //TODO: set to main menu maybe?

        // Update menu to show lobby
        // this.menuManager.lobbyMenu.setLobbyNameDisplay(joinLobbyResult.lobbyID);
        this.menuManager.lobbyMenu.setPlayersNamesDisplay([]);
        this.menuManager.switchToLobbyMenu();
    }
}