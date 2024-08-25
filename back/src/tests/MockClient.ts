import { randomUUID } from "crypto";
import { SocketWrapper } from "../SocketMessageHandler";


export class MockClient implements SocketWrapper {
    messages: any[];
    id: string;

    constructor(id: string) {
        this.messages = [];
        this.id = id;
    }
    
    send(object: any) {
        this.messages.push(JSON.parse(object));
    }
}