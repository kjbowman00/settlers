import { validateType } from "../sockets/Validator";

export class Vec2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    static validate(_o: any) : boolean {
        const o = _o as Vec2;
        return validateType(o, 'object') &&
            validateType(o.x, 'number') &&
            validateType(o.y, 'number');
    }

}