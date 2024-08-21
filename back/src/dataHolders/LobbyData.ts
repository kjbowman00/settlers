import { randomUUID } from "crypto";

export class LobbyData {
    lobbyId: string;
    players: string[];

    // Menu state - lobby, started, 

    constructor() {
        this.lobbyId = randomUUID();
        this.players = [];
    }
}