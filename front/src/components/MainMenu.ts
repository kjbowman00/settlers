import { generateUUID } from "three/src/math/MathUtils";
import { AppSync } from "./AWSAppSync";
import { MenuManager } from "./MenuManager";
import { AbstractMenuContainer } from "./AbstractMenuContainer";
import { randomPlayerColor, randomPlayerName } from "../utility/PlayerRandomizer";
import { ClientSocketMessage } from "../../../state/src/sockets/ClientSocketMessage";
import { CreateLobby } from "../../../state/src/sockets/clientMessageTypes/CreateLobby";
import { ClientMessageType } from "../../../state/src/sockets/ClientMessageType";
import { PlayerState } from "../../../state/src/state/PlayerState";

export class MainMenu extends AbstractMenuContainer {

    constructor(menuManager: MenuManager) {
        super(document.getElementById("main_menu")!);
        const createRoomInputButton = document.getElementById("create_room_input_button")!;
        const playerColorInput = document.getElementById("main_menu_player_color_input")! as HTMLInputElement;
        const playerNameInput = document.getElementById("main_menu_player_name_input")! as HTMLInputElement;

        playerColorInput.value = randomPlayerColor();

        createRoomInputButton.onclick = () => {
            let playerName: string = playerNameInput.value;
            let playerColor = playerColorInput.value;

            if (playerName == "") {
                playerName = randomPlayerName();
            }
            if (playerColor == "") {
                playerColor = randomPlayerColor();
            }
            menuManager.switchToLoading();
            menuManager.socketMessageHandler.send(new CreateLobby(
                new PlayerState('', playerName, playerColor)
            ), ClientMessageType.CREATE_LOBBY, false);
        }
    }

}