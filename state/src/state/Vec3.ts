import { validateType } from "../sockets/Validator";

export class Vec3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    static validate(_o: any) : boolean {
        const o = _o as Vec3;
        return validateType(o, 'object') &&
            validateType(o.x, 'number') &&
            validateType(o.y, 'number') &&
            validateType(o.z, 'number');
    }

}