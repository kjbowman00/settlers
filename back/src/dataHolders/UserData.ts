import { WebSocket } from 'ws';


export class UserData {
    uuids: string[];
    uuidToSocket: Map<string, WebSocket>;

    constructor() {
        this.uuids = [];
        this.uuidToSocket = new Map();
    }

    addUser(uuid: string, socket: WebSocket) {
        this.uuids.push(uuid);
        this.uuidToSocket.set(uuid, socket);
    }

    removeUser(uuid: string) {
        const idx = this.uuids.indexOf(uuid);
        if (idx != -1) this.uuids.splice(idx, 1);

        this.uuidToSocket.delete(uuid);
    }
}