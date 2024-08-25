import { ClientMessageType } from "./ClientMessageType";

export interface IClientSocketMessage {
    // message ID so a response can be given for that message
    messageID: number;
    // Message type : enum for message types
    messageType: ClientMessageType;
    // Payload: object of any type - the actual data
    payload: Object;
}

export class ClientSocketMessage implements IClientSocketMessage {
    messageID: number;
    messageType: ClientMessageType;
    payload: Object;
    constructor(messageID: number, messageType: ClientMessageType, payload: Object) {
        this.messageID = messageID;
        this.messageType = messageType;
        this.payload = payload;
    }
}
export const ClientSocketMessageRef = new ClientSocketMessage(0, ClientMessageType.CREATE_LOBBY, new Object());