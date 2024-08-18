import { StateUpdateType } from "./StateUpdateType";

export interface IStateUpdate {
    stateUpdateType: StateUpdateType;
    stateUpdatePayload: Object;
}

export class StateUpdate implements IStateUpdate {
    stateUpdateType: StateUpdateType;
    stateUpdatePayload: Object;

    constructor(stateUpdateType: StateUpdateType, stateUpdatePayload: Object) {
        this.stateUpdateType = stateUpdateType;
        this.stateUpdatePayload = stateUpdatePayload;
    }
}
export const StateUpdateRef = new StateUpdate(StateUpdateType.DEFAULT, new Object());