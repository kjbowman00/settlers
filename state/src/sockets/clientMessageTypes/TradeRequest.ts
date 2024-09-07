
export interface ITradeRequest {
    // TODO: Materials for trading here
}

export class TradeRequest implements ITradeRequest {

    static validate(o: any) {
        return true;
    }
}