import { randomUUID } from "crypto";
import { PlayerState } from './PlayerState';
import { UserData } from "../../../back/src/dataHolders/UserData";
import { GameStarted } from "../sockets/serverMessageTypes/GameStarted";
import { TurnStarted } from "../sockets/serverMessageTypes/TurnStarted";
import { ServerSocketMessage } from "../sockets/ServerSocketMessage";
import { ServerMessageType } from "../sockets/ServerMessageType";
import { GameState } from "./GameState";

const DEFAULT_TURN_LENGTH_MILLI = 1000;

export class LobbyState {
    lobbyId: string;
    players: PlayerState[];
    hostPlayerId: string;
    currentTurnPlayerId: string | undefined; // Player whose turn it is
    currentTurnTimerMilliseconds: number;
    fullTurnLengthMilliseconds: number;

    isPlaying: boolean; // Whether or not the game is in the menu or playing state
    gameState: GameState | undefined; // Undefined if not in game yet

    activeTurnUserIndex: number;

    constructor(hostPlayerData: PlayerState, userData: UserData) {
        this.lobbyId = randomUUID();
        this.players = [hostPlayerData];
        this.hostPlayerId = hostPlayerData.id;
        this.currentTurnTimerMilliseconds = DEFAULT_TURN_LENGTH_MILLI;
        this.fullTurnLengthMilliseconds = DEFAULT_TURN_LENGTH_MILLI;
        this.isPlaying = false;

        this.activeTurnUserIndex = -1;
    }

    validate(o: any): boolean {
        let valid = typeof(o) === 'object' &&
            typeof(o.lobbyId) == 'string' &&
            Array.isArray(o.players);
        for (const player of o.players) {
            valid = valid &&
                typeof(player) === 'object' &&
                PlayerState.validate(player);
        }
        valid = valid &&
            typeof(o.hostPlayerid) === 'string' &&
            (typeof(o.currentTurnPlayerId) === 'string' || typeof(o.currentTurnPlayerId === 'undefined')) &&
            typeof(o.currentTurnTimerMilliseconds) === 'number' &&
            typeof(o.fullTurnLengthMilliseconds) === 'number' &&
            typeof(o.isPlaying) === 'boolean' &&
            (typeof(o.gameState) === 'object' || typeof(o.gameState) === 'undefined');
        if (typeof(o.gameState) === 'object') {
            valid = valid && GameState.validate(o.gameState);
        }
        valid = valid &&
            typeof(o.activeTurnUserIndex) === 'number';
        return valid;
    }
    

}