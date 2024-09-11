import { SeededNumberGenerator } from '../../../state/src/misc/SeededNumberGenerator';
import { TileType } from '../../../state/src/state/TileType';
import { Hexagon } from './Hexagon';
import { Noise } from './Noise';

export class NoiseFactory {
    static noiseFromTileType(type: TileType, hexagon: Hexagon, random: SeededNumberGenerator): Noise {
        const x = hexagon.centerX - hexagon.radius;
        const y = hexagon.centerY - (hexagon.radius * Math.sqrt(3)) / 2;
        let noise: Noise;
        switch (type) {
        case TileType.STONE:
            noise = new Noise(10, x, y, hexagon.radius * 2, hexagon, 1.8, random);
            return noise;
        case TileType.SHEEP:
            noise = new Noise(5, x, y, hexagon.radius * 2, hexagon, 0.25, random);
            return noise;
        case TileType.DESERT:
            noise = new Noise(10, x, y, hexagon.radius * 2, hexagon, 0.1, random);
            return noise;
        case TileType.WHEAT:
            noise = new Noise(10, x, y, hexagon.radius * 2, hexagon, 0, random);
            return noise;
        default:
            noise = new Noise(1, x, y, hexagon.radius * 2, hexagon, 0, random);
            return noise;
        }
    }
}
