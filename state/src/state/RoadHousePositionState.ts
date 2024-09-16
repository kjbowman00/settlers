import { validateType } from "../sockets/Validator";
import { PlayerState } from "./PlayerState";
import { RoadHouseType } from "./RoadHouseType";

/**
 * The state at a particular corner of a hexagon. house/road and what player owns it.
 */
export class RoadHousePositionState {
    player: PlayerState|undefined;
    
    type: RoadHouseType;

    constructor(player:PlayerState|undefined, type: RoadHouseType) {
        this.player = player;
        this.type = type;
    }

    static validate(_o: any): boolean {
        const o = _o as RoadHousePositionState;
        return validateType(o, 'object') &&
            validateType(o.player, 'undefined', PlayerState) &&
            validateType(o.type, 'number');
    }
}