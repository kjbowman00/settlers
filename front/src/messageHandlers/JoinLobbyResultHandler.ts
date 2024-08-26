import { JoinLobby, JoinLobbyRef } from "../../../state/src/sockets/clientMessageTypes/JoinLobby";
import { JoinLobbyResult, JoinLobbyResultRef } from "../../../state/src/sockets/serverMessageTypes/JoinLobbyResult";
import { isValid } from "../../../state/src/sockets/Validator";
import { MenuManager } from "../components/MenuManager";

export class JoinLobbyResultHandler {
    menuManager: MenuManager;

    constructor(menuManager:MenuManager) {
        this.menuManager = menuManager;
    }

    handle(data: any, waitingMessage: object | undefined) {
        console.log("HANDLING");
        if ( ! isValid(data, JoinLobbyResultRef) ) return;
        if ( ! isValid(waitingMessage, JoinLobbyRef)) return;
        console.log("WAS VALID");

        const joinLobbyResult = data as JoinLobbyResult;
        if (! joinLobbyResult.success) return; //TODO: set to main menu maybe?

        const joinLobbyReq = waitingMessage as JoinLobby;

        console.log("HELLO");

        // Update menu to show lobby
        this.menuManager.lobbyMenu.setLobbyNameDisplay(joinLobbyReq.lobbyID);
        this.menuManager.lobbyMenu.setPlayersNamesDisplay([]);
        this.menuManager.switchToLobbyMenu();
    }
}