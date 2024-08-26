import { JoinLobbyResult, JoinLobbyResultRef } from "../../../state/src/sockets/serverMessageTypes/JoinLobbyResult";
import { isValid } from "../../../state/src/sockets/Validator";

export class JoinLobbyResultHandler {

    handle(data: any) {
        if ( ! isValid(data, JoinLobbyResultRef) ) return;

        const joinLobbyResult = data as JoinLobbyResult;
        
    }
}