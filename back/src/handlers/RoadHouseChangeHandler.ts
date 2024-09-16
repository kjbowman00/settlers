import { RoadHouseChange } from "../../../state/src/sockets/clientMessageTypes/RoadHouseChange";
import { LobbiesData } from "../dataHolders/LobbiesData";
import { UserData } from "../dataHolders/UserData";

export class RoadHouseChangeHandler {
    lobbiesData: LobbiesData;
    userData: UserData;
    constructor(lobbiesData: LobbiesData, userData: UserData) {
        this.lobbiesData = lobbiesData;
        this.userData = userData;
    }

    handle(o: Object, senderUUID: string) {
        if ( ! RoadHouseChange.validate(o) ) return;
        const req = o as RoadHouseChange;

        const lobbyData = this.lobbiesData.getLobbyDataFromPlayer(senderUUID);
        if (lobbyData == undefined) return;

        lobbyData.placeRoadHouseCityRequest(req, senderUUID);
    }
}