import { SeededNumberGenerator } from "../misc/SeededNumberGenerator";
import { validateType } from "../sockets/Validator";
import { TileType } from "./TileType";

export class TileState {
    tileTypes: TileType[][];
    tileGridWidth: number;
    tileGridHeight: number;

    constructor(random: SeededNumberGenerator) {
        // Default to random tiles for now. This will be handled by the server later on.
        this.tileTypes = [];
        this.tileGridWidth = 6;
        this.tileGridHeight = 6;
        for (let i = 0; i < this.tileGridWidth; i++) {
            this.tileTypes.push([]);
            for (let j = 0; j < this.tileGridHeight; j++) {
                const typeNum = Math.floor(random.random() * 7);
                let tileType: TileType;
                if (typeNum === 0) {
                    tileType = TileType.STONE;
                } else if (typeNum === 1) {
                    tileType = TileType.SHEEP;
                } else if (typeNum === 2) {
                    tileType = TileType.WHEAT;
                } else if (typeNum === 3) {
                    tileType = TileType.WOOD;
                } else if (typeNum === 4) {
                    tileType = TileType.BRICK;
                } else if (typeNum === 5) {
                    tileType = TileType.DESERT;
                } else {
                    tileType = TileType.WATER;
                }
                this.tileTypes[i].push(tileType);
            }
        }
    }
    static validate(_o: any) : boolean {
        const o = _o as TileState;
        return validateType(o, 'object') &&
            validateType(o.tileTypes, [['number']]) &&
            validateType(o.tileGridHeight, 'number') &&
            validateType(o.tileGridWidth, 'number');
    }
}