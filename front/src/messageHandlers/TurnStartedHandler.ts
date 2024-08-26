import { TurnStarted, TurnStartedRef } from "../../../state/src/sockets/serverMessageTypes/TurnStarted";
import { isValid } from "../../../state/src/sockets/Validator";

export class TurnStartedHandler {

    handle(data: any) {
        if ( ! isValid(data, TurnStartedRef) ) return;

        const turnStarted = data as TurnStarted;
        
    }
}