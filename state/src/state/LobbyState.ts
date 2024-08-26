import { randomUUID } from "crypto";
import { PlayerState } from './PlayerState';
import { UserData } from "../../../back/src/dataHolders/UserData";
import { GameStarted } from "../sockets/serverMessageTypes/GameStarted";
import { TurnStarted } from "../sockets/serverMessageTypes/TurnStarted";
import { ServerSocketMessage } from "../sockets/ServerSocketMessage";
import { ServerMessageType } from "../sockets/ServerMessageType";

const DEFAULT_TURN_LENGTH_MILLI = 1000;

export class LobbyState {
    lobbyId: string;
    players: PlayerState[];
    hostPlayerId: string;
    currentTurnPlayerId: string | undefined; // Player whose turn it is
    currentTurnTimerMilliseconds: number;
    fullTurnLengthMilliseconds: number;

    isPlaying: boolean; // Whether or not the game is in the menu or playing state

    userData: UserData;
    activeTurnUserIndex: number;
    activeTurnTimer: NodeJS.Timeout | undefined;

    // roadHouseState: RoadHouseState;
    // materialsState: MaterialsState;

    constructor(hostPlayerData: PlayerState, userData: UserData) {
        this.lobbyId = randomUUID();
        this.players = [hostPlayerData];
        this.hostPlayerId = hostPlayerData.id;
        this.currentTurnTimerMilliseconds = DEFAULT_TURN_LENGTH_MILLI;
        this.fullTurnLengthMilliseconds = DEFAULT_TURN_LENGTH_MILLI;
        this.isPlaying = false;

        this.userData = userData;
        this.activeTurnUserIndex = -1;

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
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.activeTurnUserIndex = 0;

        const msg = new GameStarted(
            new TurnStarted(this.players[0].id),
            {},
            Math.random()
        );
        this.notifyPlayers(msg, ServerMessageType.GAME_STARTED);
        this.activeTurnTimer = setTimeout(this.startNextTurn, this.fullTurnLengthMilliseconds);
    }

    endTurnRequest(userId: string) {
        console.log("HEREHEREHERE");
        console.log(userId);
        console.log(this.players);
        console.log(this.activeTurnUserIndex);
        if ( ! this.isPlaying) return;
        if(userId !== this.players[this.activeTurnUserIndex].id) return;

        this.startNextTurn();
    }

    private startNextTurn() {
        console.log("NEXT");
        if (this.activeTurnTimer != undefined) {
            clearTimeout(this.activeTurnTimer);
        }

        this.activeTurnUserIndex++;
        let idx = this.activeTurnUserIndex;
        if (idx >= this.players.length) {
            this.activeTurnUserIndex = 0;
            idx = 0;
        }

        const msg = new TurnStarted(this.players[idx].id);

        this.notifyPlayers(msg, ServerMessageType.TURN_STARTED);
        this.activeTurnTimer = setTimeout(this.startNextTurn, this.fullTurnLengthMilliseconds);
    }

    private notifyPlayers(msg: Object, msgType: ServerMessageType) {
        const serverMsg = new ServerSocketMessage(
            0, msgType, msg
        );
        const json = JSON.stringify(serverMsg);
        for (const player of this.players) {
            const socket = this.userData.uuidToSocket.get(player.id);
            if (socket != undefined) {
                socket.send(json);
            }
        }
    }

    shutdown() {
        clearTimeout(this.activeTurnTimer);
    }
}