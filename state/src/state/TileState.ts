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
        this.tileGridWidth = 5;
        this.tileGridHeight = 5;
        const totalTiles = this.tileGridWidth * this.tileGridHeight;

        // Form hexagonal map - ocean tiles on edges. Keep as wide and tall as possible but always decrease away from center.
        // Count up how many non ocean tiles to make
        let tallestX = Math.floor(this.tileGridWidth / 2);
        if (this.tileGridWidth % 2 == 0) tallestX = tallestX - 1;
        let totalNonOcean = 0;
        for (let x = 0; x < this.tileGridWidth; x++) {
            const nonOceanTilesInColumn = this.tileGridHeight - Math.abs(tallestX - x);
            totalNonOcean += nonOceanTilesInColumn;
        }

        // Pre fill the array
        for (let i = 0; i < this.tileGridWidth; i++) {
            this.tileTypes.push([]);
            for (let j = 0; j < this.tileGridHeight; j++) {
                this.tileTypes[i].push(TileType.WATER);
            }
        }
        // Actually create the tiles
        const nonWaterTiles = this.createNonOceanList(totalNonOcean, random);
        for (let x = 0; x < this.tileGridWidth; x++) {
            const nonOceanTilesInColumn = this.tileGridHeight - Math.abs(tallestX - x);
            const waterTiles = this.tileGridHeight - nonOceanTilesInColumn;

            let nonWaterMinY = Math.floor(waterTiles / 2);
            if (tallestX % 2 == 1 && x % 2 == 0) nonWaterMinY++;
            const nonWaterMaxY = nonWaterMinY +  nonOceanTilesInColumn - 1;
            for (let y = 0; y < this.tileGridWidth; y++) {
                if (y >= nonWaterMinY && y <= nonWaterMaxY) {
                    this.tileTypes[x][y] = (nonWaterTiles.pop()!);
                } 
            }
        }
        console.log(this.tileTypes);
    }
    

    createNonOceanList(nonOceanTiles: number, random: SeededNumberGenerator) : TileType[]{
        // Create non ocean tile types
        // Catan normally has 19 non ocean tiles
        // 4 forest, 4 grass, 4 wheat, 3 rock, 3 brick, 1 desert
        let forest = Math.floor(nonOceanTiles * (4/19));
        let grass = Math.floor(nonOceanTiles * (4/19));
        let wheat = Math.floor(nonOceanTiles * (4/19));
        let rock = Math.floor(nonOceanTiles * (3/19));
        let brick = Math.floor(nonOceanTiles * (3/19));
        let desert = Math.floor(nonOceanTiles * (1/19));

        let leftover = nonOceanTiles - (forest + grass + wheat + rock + brick + desert);
        while (leftover > 0) {
            const mod = leftover % 6; // 6 types of tiles
            if (mod == 0) forest++;
            if (mod == 1) grass++;
            if (mod == 2) wheat++;
            if (mod == 3) rock++;
            if (mod == 4) brick++;
            if (mod == 5) desert++;

            leftover--;
        }

        // Fill tile array
        const tiles: TileType[] = [];
        for (let i = 0; i < forest; i++) { tiles.push(TileType.WOOD); }
        for (let i = 0; i < grass; i++) { tiles.push(TileType.SHEEP); }
        for (let i = 0; i < wheat; i++) { tiles.push(TileType.WHEAT); }
        for (let i = 0; i < rock; i++) { tiles.push(TileType.STONE); }
        for (let i = 0; i < brick; i++) { tiles.push(TileType.BRICK); }
        for (let i = 0; i < desert; i++) { tiles.push(TileType.DESERT); }

        // Shuffle tiles
        for (var i = tiles.length - 1; i >= 0; i--) {
            var j = Math.floor(random.random() * (i + 1));
            var temp = tiles[i];
            tiles[i] = tiles[j];
            tiles[j] = temp;
        }

        return tiles;
    }


    static validate(_o: any) : boolean {
        const o = _o as TileState;
        return validateType(o, 'object') &&
            validateType(o.tileTypes, [['number']]) &&
            validateType(o.tileGridHeight, 'number') &&
            validateType(o.tileGridWidth, 'number');
    }
}