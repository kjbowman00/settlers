import { GameStarted } from "../../../state/src/sockets/serverMessageTypes/GameStarted";
import { GameState } from "../../../state/src/state/GameState";
import { MenuManager } from '../components/MenuManager';

export class GameStartedHandler {
    menuManager;

    constructor(menuManager: MenuManager) {
        this.menuManager = menuManager;
    }

    handle(data: any) {
        if ( ! GameStarted.validate(data ) ) return;

        const gameStarted = data as GameStarted;
        
        this.menuManager.state!.gameState = new GameState(gameStarted.seed);
        this.menuManager.switchToGame();
    }
}