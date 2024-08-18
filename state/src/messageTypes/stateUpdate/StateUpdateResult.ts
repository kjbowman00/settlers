

export interface IStateUpdateResult {
    success: boolean;
}

export class StateUpdateResult implements IStateUpdateResult {
    success: boolean;

    constructor(success: boolean) {
        this.success = success;
    }
}
export const StateUpdateResultRef = new StateUpdateResult(true);