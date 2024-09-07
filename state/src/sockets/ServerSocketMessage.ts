import { ServerMessageType } from "./ServerMessageType";

export interface IServerSocketMessage {
    // the number corresponding to the thing being responded to. -1 if not responding
    responseID: number;
    // Message type : enum for message types
    messageType: ServerMessageType;
    // Payload: object of any type - the actual data
    payload: Object;
}

export class ServerSocketMessage implements IServerSocketMessage {
    responseID: number;
    messageType: ServerMessageType;
    payload: Object;
    constructor(responseID: number, messageType: ServerMessageType, payload: Object) {
        this.responseID = responseID;
        this.messageType = messageType;
        this.payload = payload;
    }

    static validate(o: any) {
        return typeof(o) === 'object' &&
            typeof(o.responseID) === 'number' &&
            typeof(o.messageType) === 'number' &&
            typeof(o.payload) === 'object';
    }
}