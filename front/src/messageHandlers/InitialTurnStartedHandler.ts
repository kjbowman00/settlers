import { InitialTurnStarted } from "../../../state/src/sockets/serverMessageTypes/InitialTurnStarted";
import { MenuManager } from "../components/MenuManager";

export class InitialTurnStartedHandler {
    menuManager: MenuManager;

    constructor(menuManager: MenuManager) {
        this.menuManager = menuManager;
    }

    handle(data: any) {
        if ( ! InitialTurnStarted.validate(data) ) return;

        const turnStarted = data as InitialTurnStarted;
        
        this.menuManager
    }
}