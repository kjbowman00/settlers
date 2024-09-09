import { PlayerState } from './PlayerState';
import { UserData } from "../../../back/src/dataHolders/UserData";
import { GameStarted } from "../sockets/serverMessageTypes/GameStarted";
import { TurnStarted } from "../sockets/serverMessageTypes/TurnStarted";
import { ServerSocketMessage } from "../sockets/ServerSocketMessage";
import { ServerMessageType } from "../sockets/ServerMessageType";
import { GameState } from "./GameState";
import { validateType } from '../sockets/Validator';

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

    constructor(hostPlayerData: PlayerState, userData: UserData, lobbyId: string) {
        this.lobbyId = lobbyId;
        this.players = [hostPlayerData];
        this.hostPlayerId = hostPlayerData.id;
        this.currentTurnTimerMilliseconds = DEFAULT_TURN_LENGTH_MILLI;
        this.fullTurnLengthMilliseconds = DEFAULT_TURN_LENGTH_MILLI;
        this.isPlaying = false;

        this.activeTurnUserIndex = -1;
    }

    static validate(_o: any): boolean {
        const o = _o as LobbyState;
        return validateType(o, 'object') &&
            validateType(o.lobbyId, 'string') &&
            validateType(o.players, [PlayerState]) &&
            validateType(o.hostPlayerId, 'string') &&
            validateType(o.currentTurnPlayerId, 'string', 'undefined') &&
            validateType(o.currentTurnTimerMilliseconds, 'number') &&
            validateType(o.fullTurnLengthMilliseconds, 'number') &&
            validateType(o.isPlaying, 'boolean') &&
            validateType(o.gameState, GameState, 'undefined') &&
            validateType(o.activeTurnUserIndex, 'number');
    }
}