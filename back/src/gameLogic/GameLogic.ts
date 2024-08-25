import { StartGame } from "../../../state/src/sockets/clientMessageTypes/StartGame";
import { GameStarted } from "../../../state/src/sockets/serverMessageTypes/GameStarted";
import { TurnStarted } from "../../../state/src/sockets/serverMessageTypes/TurnStarted";
import { LobbyState } from "../../../state/src/state/LobbyState";
import { UserData } from "../dataHolders/UserData";

export class GameLogic {
    lobby: LobbyState;
    userData: UserData;
    activeTurnUserIndex: number;
    activeTurnTimer: NodeJS.Timeout | undefined;
    constructor(lobby: LobbyState, userData: UserData) {
        this.lobby = lobby;
        this.userData = userData;
        this.activeTurnUserIndex = -1;
    }

    startGame() {
        this.activeTurnUserIndex = 0;

        const msg = new GameStarted(
            new TurnStarted(this.lobby.players[0].id),
            {},
            Math.random()
        );
        this.notifyPlayers(msg);
        this.activeTurnTimer = setTimeout(this.startNextTurn, this.lobby.fullTurnLengthMilliseconds);
    }

    private startNextTurn() {
        if (this.activeTurnTimer != undefined) {
            clearTimeout(this.activeTurnTimer);
        }

        let idx = this.activeTurnUserIndex++;
        if (idx >= this.lobby.players.length) {
            this.activeTurnUserIndex = 0;
            idx = 0;
        }

        const msg = new TurnStarted(this.lobby.players[idx].id);

        this.notifyPlayers(msg);
        this.activeTurnTimer = setTimeout(this.startNextTurn, this.lobby.fullTurnLengthMilliseconds);
    }

    private notifyPlayers(msg: Object) {
        const msgJ = JSON.stringify(msg);
        for (const player of this.lobby.players) {
            const socket = this.userData.uuidToSocket.get(player.id);
            if (socket != undefined) {
                socket.send(msgJ);
            }
        }
    }
}