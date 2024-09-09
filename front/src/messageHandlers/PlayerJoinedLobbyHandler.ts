import { PlayerJoinedLobby } from "../../../state/src/sockets/serverMessageTypes/PlayerJoinedLobby";
import { MenuManager } from "../components/MenuManager";

export class PlayerJoinedLobbyHandler {
    menuManager;

    constructor(menuManager: MenuManager) {
        this.menuManager = menuManager;
    }

    handle(data: any) {
        if ( ! PlayerJoinedLobby.validate(data) ) return;

        const playerJoinedLobby = data as PlayerJoinedLobby;
        const player = playerJoinedLobby.player;

        this.menuManager.state?.players.push(player);
        this.menuManager.lobbyMenu.updateFromState();
    }
}