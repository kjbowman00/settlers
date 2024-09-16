import { RoadHouseType } from "../../state/RoadHouseType";

export class RoadHouseUpdate {
    i: number;
    j: number;
    k: number;
    roadHouseType: RoadHouseType;

    constructor(i: number, j: number, k: number, roadHouseType: RoadHouseType) {
        this.i = i;
        this.j = j;
        this.k = k;
        this.roadHouseType = roadHouseType;
    }

    static validate(o: any) {
        return typeof(o.i) === 'number' &&
            typeof (o.j) === 'number' &&
            typeof (o.k) === 'number' &&
            typeof(o.roadHouseType) === 'number';
    }
}