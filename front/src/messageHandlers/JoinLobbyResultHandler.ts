import { JoinLobbyResult } from "../../../state/src/sockets/serverMessageTypes/JoinLobbyResult";
import { MenuManager } from "../components/MenuManager";

export class JoinLobbyResultHandler {
    menuManager: MenuManager;

    constructor(menuManager:MenuManager) {
        this.menuManager = menuManager;
    }

    handle(data: any) {
        if ( ! JoinLobbyResult.validate(data) ) return;

        const joinLobbyResult = data as JoinLobbyResult;
        if (! joinLobbyResult.success) return; //TODO: set to main menu maybe?

        // Update internal state
        
        // Update menu to show lobby
        const players = joinLobbyResult.players;
        const playerNames = [];
        for (const player of players) {
            playerNames.push(player.username);
        }
        this.menuManager.lobbyMenu.setPlayersNamesDisplay(playerNames);
        this.menuManager.lobbyMenu.setLobbyNameDisplay(joinLobbyResult.lobbyID);
        this.menuManager.switchToLobbyMenu();
    }
}