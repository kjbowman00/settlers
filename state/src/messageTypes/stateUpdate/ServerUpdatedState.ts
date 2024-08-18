import { StateUpdateType } from "./StateUpdateType";

// As of now this has the same data as StateUpdate, but it could be different in the future
export interface IServerUpdatedState {
    stateUpdateType: StateUpdateType;
    stateUpdatePayload: Object;
}

export class ServerUpdatedState implements IServerUpdatedState {
    stateUpdateType: StateUpdateType;
    stateUpdatePayload: Object;

    constructor(stateUpdateType: StateUpdateType, stateUpdatePayload: Object) {
        this.stateUpdateType = stateUpdateType;
        this.stateUpdatePayload = stateUpdatePayload;
    }
}
export const ServerUpdatedStateRef = new ServerUpdatedState(StateUpdateType.DEFAULT, new Object());
