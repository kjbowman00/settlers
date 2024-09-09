import { AbstractMenuContainer } from "./AbstractMenuContainer";
import { MenuManager } from "./MenuManager";
import { MenuStateUpdate, MenuStateUpdateType } from "../../../state/src/state/MenuState";
import { StartGame } from "../../../state/src/sockets/clientMessageTypes/StartGame";
import { ClientMessageType } from "../../../state/src/sockets/ClientMessageType";

export class LobbyMenu extends AbstractMenuContainer {
    lobbyMenu: HTMLElement;
    lobbyMenuIdText: HTMLElement;
    lobbyMenuIdCopyButton: HTMLElement;
    lobbyMenuPlayersNamesList: HTMLElement;
    menuManager: MenuManager;

    lobbyName: string;
    constructor(menuManager: MenuManager) {
        super(document.getElementById("lobby_menu")!);
        this.menuManager = menuManager;
        this.lobbyMenu = document.getElementById("lobby_menu")!;
        this.lobbyMenuIdText = document.getElementById("lobby_menu_id")!;
        this.lobbyMenuIdCopyButton = document.getElementById("lobby_menu_id_copy_button")!;
        this.lobbyMenuPlayersNamesList = document.getElementById("lobby_menu_players_list_text")!;
        this.lobbyName = "";

        this.lobbyMenuIdCopyButton.onclick = () => {
            const origin = window.location.origin;
            navigator.clipboard.writeText(origin + "?lobbyName=" + this.lobbyName);
        }

        document.getElementById("lobby_start_game_button")!.onclick = () => {
            menuManager.switchToLoading();
            menuManager.socketMessageHandler.send(new StartGame(), ClientMessageType.START_GAME, false);
        }
    }

    setLobbyNameDisplay(lobbyName:string) {
        this.lobbyName = lobbyName;
        this.lobbyMenuIdText.innerText = "LOBBY ID: " + lobbyName;
    }
    setPlayersNamesDisplay(players:string[]) {
        let display = "PLAYERS : ";
        for (let i = 0 ; i < players.length-1; i++) {
            display += players[i] + ", ";
        }
        display += players[players.length - 1];
        this.lobbyMenuPlayersNamesList.innerText = display;
    }

    updateFromState() {
        const lobbyState = this.menuManager.state;

        // Update lobby name
        this.setLobbyNameDisplay(lobbyState!.lobbyId);

        // Update player list display
        const players = lobbyState!.players;
        const playersNames = [];
        for (const player of players) {
            playersNames.push(player.username);
        }
        this.setPlayersNamesDisplay(playersNames);
    }
}