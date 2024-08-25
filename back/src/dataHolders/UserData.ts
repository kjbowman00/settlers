import { SocketWrapper } from '../SocketMessageHandler';


export class UserData {
    uuids: string[];
    uuidToSocket: Map<string, SocketWrapper>;

    constructor() {
        this.uuids = [];
        this.uuidToSocket = new Map();
    }

    addUser(uuid: string, socket: SocketWrapper) {
        this.uuids.push(uuid);
        this.uuidToSocket.set(uuid, socket);
    }

    removeUser(uuid: string) {
        const idx = this.uuids.indexOf(uuid);
        if (idx != -1) this.uuids.splice(idx, 1);

        this.uuidToSocket.delete(uuid);
    }
}