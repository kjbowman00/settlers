import { randomUUID } from "crypto";
import { PlayerState } from './PlayerState';

const DEFAULT_TURN_LENGTH_MILLI = 1000;

export class LobbyState {
    lobbyId: string;
    players: PlayerState[];
    hostPlayerId: string;
    currentTurnPlayerId: string | undefined; // Player whose turn it is
    currentTurnTimerMilliseconds: number;
    fullTurnLengthMilliseconds: number;

    isPlaying: boolean; // Whether or not the game is in the menu or playing state

    // roadHouseState: RoadHouseState;
    // materialsState: MaterialsState;

    constructor(hostPlayerData: PlayerState) {
        this.lobbyId = randomUUID();
        this.players = [hostPlayerData];
        this.hostPlayerId = hostPlayerData.id;
        this.currentTurnTimerMilliseconds = DEFAULT_TURN_LENGTH_MILLI;
        this.fullTurnLengthMilliseconds = DEFAULT_TURN_LENGTH_MILLI;
        this.isPlaying = false;
    }

    addPlayer(player: PlayerState) {
        this.players.push(player);
    }

    removePlayer(playerId: string) {
        let idx = -1;
        let i = 0;
        for (const playerData of this.players) {
            if (playerData.id == playerId) {
                idx = i;
                break;
            }
            i++;
        }
        if (idx == -1) return;
        this.players.splice(idx, 1);
    }
    startGame() {
        this.isPlaying = true;
    }
}