import { MessageType } from "./MessageType";

export interface ISocketMessage {
    // message ID so a response can be given for that message
    messageID: number;
    // Message type : enum for message types
    messageType: MessageType;
    // Payload: object of any type - the actual data
    payload: Object;
}

export class SocketMessage implements ISocketMessage {
    messageID: number;
    messageType: MessageType;
    payload: Object;
    constructor(messageID: number, messageType: MessageType, payload: Object) {
        this.messageID = messageID;
        this.messageType = messageType;
        this.payload = payload;
    }
}
export const SocketMessageRef = new SocketMessage(0, MessageType.CREATE_LOBBY, new Object);