import { validateType } from "../sockets/Validator";

export enum PositionStateType {
    TOWN,
    CITY,
    ROAD,
    EMPTY,
}

/**
 * The state at a particular corner of a hexagon. house/road and what player owns it.
 */
export class PositionState {
    player: string|null;
    color: string;
    
    type: PositionStateType;

    constructor(player:string, type: PositionStateType, color: string) {
        this.player = player;
        this.type = type;
        this.color = color;
    }

    static validate(_o: any): boolean {
        const o = _o as PositionState;
        return validateType(o, 'object') &&
            validateType(o.player, 'string', 'undefined') &&
            validateType(o.color, 'string') &&
            validateType(o.type, 'number');
    }
}