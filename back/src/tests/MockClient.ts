import { randomUUID } from "crypto";
import { SocketWrapper } from "../SocketMessageHandler";
import { ServerSocketMessage } from "../../../state/src/sockets/ServerSocketMessage";


export class MockClient implements SocketWrapper {
    messages: ServerSocketMessage[];
    id: string;

    constructor(id: string) {
        this.messages = [];
        this.id = id;
    }
    
    send(object: any) {
        this.messages.push(JSON.parse(object));
    }
}