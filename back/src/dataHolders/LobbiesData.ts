import { randomUUID } from "crypto";
import { LobbyData } from "./LobbyData";

export class LobbiesData {
    playerIdToLobbyId: Map<string, string>;
    lobbyIdToLobbyData: Map<string, LobbyData>; 

    constructor() {
        this.playerIdToLobbyId = new Map();
        this.lobbyIdToLobbyData = new Map();
    }

    createLobby(firstPlayerId: string): string {
        // Remove from old lobby if player was in one
        this.removePlayer(firstPlayerId);

        const lobby = new LobbyData();
        const lobbyId = lobby.lobbyId;
        lobby.players.push(firstPlayerId);

        this.lobbyIdToLobbyData.set(lobbyId, lobby);
        this.playerIdToLobbyId.set(firstPlayerId, lobbyId);
        return lobbyId;
    }

    joinLobby(playerId: string, lobbyId: string): boolean {
        this.removePlayer(playerId);

        const lobby = this.lobbyIdToLobbyData.get(lobbyId);
        if (lobby == undefined) return false;
        lobby.players.push(playerId);
        this.playerIdToLobbyId.set(playerId, lobbyId);
        return true;
    }

    private removePlayer(uuid: string) {
        const lobbyId = this.playerIdToLobbyId.get(uuid);
        if (lobbyId == undefined) return;
        this.playerIdToLobbyId.delete(uuid);

        const lobby = this.lobbyIdToLobbyData.get(lobbyId);
        if (lobby == undefined) return;
        const idx = lobby.players.indexOf(uuid);
        if (idx == -1) return;
        lobby.players.splice(idx, 1);

        if (lobby.players.length == 0) {
            this.removeLobby(lobbyId);
        }
    }

    private removeLobby(lobbyId: string) {
        const lobby = this.lobbyIdToLobbyData.get(lobbyId);
        if (lobby == undefined) return;

        for (const player of lobby.players) {
            this.playerIdToLobbyId.delete(player);
        }

        this.lobbyIdToLobbyData.delete(lobbyId);
    }
}