import { ServerMessageType } from "../../../state/src/sockets/ServerMessageType";
import { GameStarted } from "../../../state/src/sockets/serverMessageTypes/GameStarted";
import { TurnStarted } from "../../../state/src/sockets/serverMessageTypes/TurnStarted";
import { ServerSocketMessage } from "../../../state/src/sockets/ServerSocketMessage";
import { LobbyState } from "../../../state/src/state/LobbyState";
import { PlayerState } from "../../../state/src/state/PlayerState";
import { UserData } from "./UserData";


export class LobbyData {
    // Shared lobby state
    lobbyState: LobbyState;

    // Server only lobby data
    activeTurnTimer: NodeJS.Timeout | undefined;
    userData: UserData;


    constructor(lobbyState: LobbyState, userData: UserData) {
        this.lobbyState = lobbyState;
        this.userData = userData;
    }


    addPlayer(player: PlayerState) {
        this.lobbyState.players.push(player);
    }

    removePlayer(playerId: string) {
        let idx = -1;
        let i = 0;
        for (const playerData of this.lobbyState.players) {
            if (playerData.id == playerId) {
                idx = i;
                break;
            }
            i++;
        }
        if (idx == -1) return;
        this.lobbyState.players.splice(idx, 1);
    }

    startGame() {
        if (this.lobbyState.isPlaying) return;
        this.lobbyState.isPlaying = true;
        this.lobbyState.activeTurnUserIndex = 0;

        const msg = new GameStarted(
            new TurnStarted(this.lobbyState.players[0].id),
            {},
            Math.random()
        );
        this.notifyPlayers(msg, ServerMessageType.GAME_STARTED);
        this.activeTurnTimer = setTimeout(() => {
            this.startNextTurn}, this.lobbyState.fullTurnLengthMilliseconds);
    }

    endTurnRequest(userId: string) {
        if ( ! this.lobbyState.isPlaying) return;
        if(userId !== this.lobbyState.players[this.lobbyState.activeTurnUserIndex].id) return;

        this.startNextTurn();
    }

    private startNextTurn() {
        console.log("NEXT");
        if (this.activeTurnTimer != undefined) {
            clearTimeout(this.activeTurnTimer);
        }

        this.lobbyState.activeTurnUserIndex++;
        let idx = this.lobbyState.activeTurnUserIndex;
        if (idx >= this.lobbyState.players.length) {
            this.lobbyState.activeTurnUserIndex = 0;
            idx = 0;
        }

        const msg = new TurnStarted(this.lobbyState.players[idx].id);

        this.notifyPlayers(msg, ServerMessageType.TURN_STARTED);
        this.activeTurnTimer = setTimeout(this.startNextTurn, this.lobbyState.fullTurnLengthMilliseconds);
    }

    private notifyPlayers(msg: Object, msgType: ServerMessageType) {
        const serverMsg = new ServerSocketMessage(
            0, msgType, msg
        );
        const json = JSON.stringify(serverMsg);
        for (const player of this.lobbyState.players) {
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