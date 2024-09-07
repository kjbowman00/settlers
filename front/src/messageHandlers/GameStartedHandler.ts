import { GameStarted, GameStartedRef } from "../../../state/src/sockets/serverMessageTypes/GameStarted";
import { isValid } from "../../../state/src/sockets/Validator";

export class GameStartedHandler {

    handle(data: any) {
        if ( ! GameStarted.validate(data ) ) return;

        const gameStarted = data as GameStarted;
        
    }
}