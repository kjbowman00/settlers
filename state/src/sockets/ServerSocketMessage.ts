import { ServerMessageType } from "./ServerMessageType";

export interface IServerSocketMessage {
    // message ID so a response can be given for that message
    messageID: number;
    // Message type : enum for message types
    messageType: ServerMessageType;
    // Payload: object of any type - the actual data
    payload: Object;
}

export class ServerSocketMessage implements IServerSocketMessage {
    messageID: number;
    messageType: ServerMessageType;
    payload: Object;
    constructor(messageID: number, messageType: ServerMessageType, payload: Object) {
        this.messageID = messageID;
        this.messageType = messageType;
        this.payload = payload;
    }
}
export const ServerSocketMessageRef = new ServerSocketMessage(0, 
    ServerMessageType.CREATE_LOBBY_RESULT, new Object());