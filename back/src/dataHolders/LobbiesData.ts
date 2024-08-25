import { randomUUID } from "crypto";
import { LobbyState } from "../../../state/src/state/LobbyState";
import { PlayerState } from "../../../state/src/state/PlayerState";

export class LobbiesData {
    playerIdToLobbyId: Map<string, string>;
    lobbyIdToLobbyData: Map<string, LobbyState>; 

    constructor() {
        this.playerIdToLobbyId = new Map();
        this.lobbyIdToLobbyData = new Map();
    }

    createLobby(firstPlayer: PlayerState): string {
        // Remove from old lobby if player was in one
        this.removePlayer(firstPlayer.id);

        const lobby = new LobbyState(firstPlayer);
        const lobbyId = lobby.lobbyId;

        this.lobbyIdToLobbyData.set(lobbyId, lobby);
        this.playerIdToLobbyId.set(firstPlayer.id, lobbyId);
        return lobbyId;
    }

    joinLobby(player: PlayerState, lobbyId: string): boolean {
        this.removePlayer(player.id);

        const lobby = this.lobbyIdToLobbyData.get(lobbyId);
        if (lobby == undefined) return false;
        lobby.addPlayer(player);
        this.playerIdToLobbyId.set(player.id, lobbyId);
        return true;
    }

    getLobbyDataFromPlayer(playerId: string): undefined | LobbyState {
        const lobbyId = this.playerIdToLobbyId.get(playerId);
        if (lobbyId == undefined) return undefined;
        return this.lobbyIdToLobbyData.get(lobbyId);
    }

    private removePlayer(uuid: string) {
        const lobbyId = this.playerIdToLobbyId.get(uuid);
        if (lobbyId == undefined) return;
        this.playerIdToLobbyId.delete(uuid);

        const lobby = this.lobbyIdToLobbyData.get(lobbyId);
        if (lobby == undefined) return;
        lobby.removePlayer(uuid);
        if (lobby.players.length == 0) {
            this.removeLobby(lobbyId);
        }
    }

    private removeLobby(lobbyId: string) {
        const lobby = this.lobbyIdToLobbyData.get(lobbyId);
        if (lobby == undefined) return;

        for (const player of lobby.players) {
            this.playerIdToLobbyId.delete(player.id);
        }

        this.lobbyIdToLobbyData.delete(lobbyId);
    }
}