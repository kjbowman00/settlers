export enum MessageType {
    // CLIENT TO SERVER
    CREATE_LOBBY,
    JOIN_LOBBY,
    STATE_UPDATE,

    // SERVER TO CLIENT
    CREATE_LOBBY_RESULT, // Sucess/fail, give the details of the lobby
    JOIN_LOBBY_RESULT, // Success/fail, give the details of the lobby
    STATE_UPDATE_RESULT, // Success/fail, fail could happen if their turn has passed
    SERVER_UPDATED_STATE,

}