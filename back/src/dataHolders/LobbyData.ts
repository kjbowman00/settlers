import { RoadHouseChange } from "../../../state/src/sockets/clientMessageTypes/RoadHouseChange";
import { ServerMessageType } from "../../../state/src/sockets/ServerMessageType";
import { GameStarted } from "../../../state/src/sockets/serverMessageTypes/GameStarted";
import { TurnStarted } from "../../../state/src/sockets/serverMessageTypes/TurnStarted";
import { ServerSocketMessage } from "../../../state/src/sockets/ServerSocketMessage";
import { GameState } from "../../../state/src/state/GameState";
import { LobbyState } from "../../../state/src/state/LobbyState";
import { PlayerState } from "../../../state/src/state/PlayerState";
import { RoadHouseState } from "../../../state/src/state/RoadHouseState";
import { InitialRoadHousePlacementHelper } from "./InitialRoadHousePlacementHelper";
import { UserData } from "./UserData";


export class LobbyData {
    // Shared lobby state
    lobbyState: LobbyState;

    // Server only lobby data
    activeTurnTimer: NodeJS.Timeout | undefined;
    userData: UserData;
    initialRoadHousePlacementHelper: InitialRoadHousePlacementHelper;


    constructor(lobbyState: LobbyState, userData: UserData) {
        this.lobbyState = lobbyState;
        this.userData = userData;

        this.initialRoadHousePlacementHelper = new InitialRoadHousePlacementHelper(this);
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

    getPlayer(playerId: string) {
        for (const player of this.lobbyState.players) {
            if (player.id == playerId) return player;
        }
        return undefined;
    }

    startGame() {
        if (this.lobbyState.isPlaying) return;

        this.lobbyState.isPlaying = true;
        this.lobbyState.inInitialPlacementStage = true;
        this.lobbyState.activeTurnUserIndex = -1;
        const seed = Math.random();
        this.lobbyState.gameState = new GameState(seed);

        const msg = new GameStarted(
            {},
            seed
        );
        this.notifyPlayers(msg, ServerMessageType.GAME_STARTED);

        this.initialRoadHousePlacementHelper.startInitialRoadHousePlacement(this.lobbyState.players.length);
    }

    endInitialPlacementPhase() {
        this.lobbyState.inInitialPlacementStage = false;
        this.lobbyState.activeTurnUserIndex = -1;

        this.startNextTurn();
    }
    
    placeRoadHouseCityRequest(roadHouseChange: RoadHouseChange, userID: string) {
        if (!this.lobbyState.isPlaying) return;
        if (this.lobbyState.currentTurnPlayerId !== userID) return;

        // Initial placement at game start
        if (this.lobbyState.inInitialPlacementStage) {
            this.initialRoadHousePlacementHelper.handle(roadHouseChange, userID);
        }

        // Normal placement

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
        const playerId = this.lobbyState.players[idx].id;
        this.lobbyState.currentTurnPlayerId = playerId;

        const msg = new TurnStarted(playerId);
        this.notifyPlayers(msg, ServerMessageType.TURN_STARTED);
        this.activeTurnTimer = setTimeout(this.startNextTurn, this.lobbyState.fullTurnLengthMilliseconds);
    }

    notifyPlayers(msg: Object, msgType: ServerMessageType) {
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