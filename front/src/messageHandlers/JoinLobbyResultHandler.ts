import { JoinLobby } from "../../../state/src/sockets/clientMessageTypes/JoinLobby";
import { JoinLobbyResult } from "../../../state/src/sockets/serverMessageTypes/JoinLobbyResult";
import { MenuManager } from "../components/MenuManager";

export class JoinLobbyResultHandler {
    menuManager: MenuManager;

    constructor(menuManager:MenuManager) {
        this.menuManager = menuManager;
    }

    handle(data: any, waitingMessage: object | undefined) {
        if ( ! JoinLobbyResult.validate(data) ) return;

        const joinLobbyResult = data as JoinLobbyResult;
        if (! joinLobbyResult.success) return; //TODO: set to main menu maybe?

        const joinLobbyReq = waitingMessage as JoinLobby;

        console.log("HELLO");

        // Update internal state
        
        // Update menu to show lobby
        const players = joinLobbyResult.players;
        const playerNames = [];
        for (const player of players) {
            playerNames.push(player.username);
        }
        this.menuManager.lobbyMenu.setPlayersNamesDisplay(playerNames);
        this.menuManager.lobbyMenu.setLobbyNameDisplay(joinLobbyReq.lobbyID);
        this.menuManager.switchToLobbyMenu();
    }
}