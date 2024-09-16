import { RoadHouseChange } from '../../../state/src/sockets/clientMessageTypes/RoadHouseChange';
import { RoadHouseType } from "../../../state/src/state/RoadHouseType";
import { RoadHouseState } from '../../../state/src/state/RoadHouseState';
import { LobbyData } from "./LobbyData";
import { Vec3 } from '../../../state/src/state/Vec3';
import { TurnStarted } from '../../../state/src/sockets/serverMessageTypes/TurnStarted';
import { InitialTurnStarted } from '../../../state/src/sockets/serverMessageTypes/InitialTurnStarted';
import { ServerMessageType } from '../../../state/src/sockets/ServerMessageType';
import { RoadHouseUpdate } from '../../../state/src/sockets/serverMessageTypes/RoadHouseUpdate';


export class InitialRoadHousePlacementHelper {
    numPlayers: number = 0;
    playerCounter = -1;
    housesLeftToPlace = 1;
    roadsLeftToPlace = 1;

    isFirstRoundPlacements = true; // whether or not the first round of placements has happened. Must go backwards on second placement

    lobbyData: LobbyData;

    constructor(lobbyData: LobbyData) {
        this.lobbyData = lobbyData;
    }

    startInitialRoadHousePlacement(numPlayers: number) {
        this.numPlayers = numPlayers;
        this.playerCounter = -1;
        this.nextPlayersTurn();
    }

    handle(roadHouseChange: RoadHouseChange, playerId: string) {
        // Check correct player
        if (playerId !== this.lobbyData.lobbyState.currentTurnPlayerId) return; 

        // Check valid placement
        if (! this.isValid(roadHouseChange, this.lobbyData.lobbyState.gameState!.roadHouseState,
            playerId
        )) return;

        
        this.placeRoadHouseAndNotifyPlayers(roadHouseChange, playerId);
        if (this.shouldNextPlayersTurnHappen()) {
            this.nextPlayersTurn();
        }
    }

    private nextPlayersTurn() {
        this.playerCounter++;
        if (this.isFirstRoundPlacements) {
            this.lobbyData.lobbyState.activeTurnUserIndex++;
        } else {
            this.lobbyData.lobbyState.activeTurnUserIndex--;
            if (this.lobbyData.lobbyState.activeTurnUserIndex == -1) {
                // End initial placement
                this.lobbyData.endInitialPlacementPhase();
                return;
            }
        }
        this.housesLeftToPlace = 1;
        this.roadsLeftToPlace = 1;

        // Last player places twice
        if (this.playerCounter == this.numPlayers - 1) {
            this.housesLeftToPlace++;
            this.roadsLeftToPlace++;
            this.isFirstRoundPlacements = false;
        }

        // Notify Players
        const playerId = this.lobbyData.lobbyState.players[this.lobbyData.lobbyState.activeTurnUserIndex].id;
        this.lobbyData.lobbyState.currentTurnPlayerId = playerId;
        const msg = new InitialTurnStarted(playerId);
        this.lobbyData.notifyPlayers(msg, ServerMessageType.INITIAL_TURN_STARTED);
    }

    private placeRoadHouseAndNotifyPlayers(roadHouseChange: RoadHouseChange, userId: string) {
        switch (roadHouseChange.roadHouseType) {
            case RoadHouseType.HOUSE:
                this.housesLeftToPlace--;
                break;
            case RoadHouseType.ROAD:
                this.roadsLeftToPlace--;
                break;
        }

        const user = this.lobbyData.getPlayer(userId);
        this.lobbyData.lobbyState.gameState?.roadHouseState.putState(
            new Vec3(roadHouseChange.i, roadHouseChange.j, roadHouseChange.k),
            roadHouseChange.roadHouseType,
            user
        );

        // Notify players
        const msg = new RoadHouseUpdate(roadHouseChange.i, roadHouseChange.j, roadHouseChange.k, roadHouseChange.roadHouseType);
        this.lobbyData.notifyPlayers(msg, ServerMessageType.ROAD_HOUSE_UPDATE);
    }

    private shouldNextPlayersTurnHappen() {
        return this.housesLeftToPlace == 0 && this.roadsLeftToPlace == 0;
    }

    private isValid(roadHouseChange: RoadHouseChange, roadHouseState: RoadHouseState, playerId: string) {
        if (! roadHouseState.isValidPlacementLocationInitial(roadHouseChange.i, roadHouseChange.j, roadHouseChange.k,
            roadHouseChange.roadHouseType, playerId)
        ) return false;

        switch (roadHouseChange.roadHouseType) {
            case RoadHouseType.HOUSE:
                if (this.housesLeftToPlace > 0) return true;
            case RoadHouseType.ROAD:
                if (this.roadsLeftToPlace > 0) return true;
            default:
                return false;
        }
    }


}