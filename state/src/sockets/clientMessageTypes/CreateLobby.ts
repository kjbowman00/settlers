import { PlayerState } from "../../state/PlayerState";
import { validateType } from "../Validator";


export class CreateLobby {
    player: PlayerState;

    constructor(player: PlayerState) {
        this.player = player;
    }


    static validate(_o: any) {
        const o = _o as CreateLobby;
        return validateType(o, 'object') &&
            validateType(o.player, PlayerState);
    }
}