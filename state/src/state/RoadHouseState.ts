import { validateType } from '../sockets/Validator';
import { Vec2 } from './Vec2';
import { Vec3 } from './Vec3';
import { TileType } from './TileType';
import { platform } from 'os';
import { RoadHousePositionState } from './RoadHousePositionState';
import { RoadHouseType } from './RoadHouseType';
import { PlayerState } from './PlayerState';


/**
 * Computes world XZ coordinates for a hexagon corner.
 */
export function getXZPosition(i:number, j:number, k:number, r: number): Vec2 {
    // X calculation
    let kmod; // x offset from k=2 depending on k
    if (k === 0) {
        kmod = -0.75*r;
    } else if (k === 1) {
        kmod = -0.5*r;
    } else if (k === 2) {
        kmod = 0;
    } else if (k === 3) {
        kmod = 0.5*r;
    } else { // k===4
        kmod = 0.75*r;
    }

    const x = -0.5*r + 1.5*r*i + kmod;

    // Y Calculation
    const hexHeight = Math.sqrt(3)*r;
    if (k === 1 || k === 2 || k === 3) {
        kmod = 0;
    } else {
        kmod = -0.25 * hexHeight;
    }

    let startY:number;
    if (i % 2 === 0) {
        startY = 0.5 * hexHeight;
    } else {
        startY = 0;
    }
    const y = startY + hexHeight*j + kmod;

    return new Vec2(x,y);
}


/**
 * Given a corner of a hexagon that can hold a house, finds the 3 closest coordinates for other houses.
 */
function getHousesOneAway(i:number, j:number, k:number): Vec3[] {
    if (i % 2 === 0) {
        if (k === 0) {
            return [
                new Vec3(i-1,j, 3),
                new Vec3(i,j, 1),
            ];
        }
        if (k === 1) {
            return [
                new Vec3(i-1, j, 3),
                new Vec3(i-1, j+1, 3),
                new Vec3(i, j, 3),
            ];
        }
        if (k === 2) {
            return [
                new Vec3(i,j,1),
                new Vec3(i,j,3),
            ];
        }
        if (k === 3) {
            return [
                new Vec3(i, j, 1),
                new Vec3(i+1, j, 1),
                new Vec3(i+1, j+1, 1),
            ];
        }
        // k === 4
        return [
            new Vec3(i,j,3),
            new Vec3(i+1,j,1),
        ];
    }
    // odd i
    if (k === 0) {
        return [
            new Vec3(i,j,1),
            new Vec3(i-1,j-1,3),
        ];
    }
    if (k === 1) {
        return [
            new Vec3(i-1, j, 3),
            new Vec3(i-1, j-1, 3),
            new Vec3(i, j, 3),
        ];
    }
    if (k === 2) {
        return [
            new Vec3(i,j,1),
            new Vec3(i,j,3),
        ];
    }
    if (k === 3) {
        return [
            new Vec3(i, j, 1),
            new Vec3(i+1, j, 1),
            new Vec3(i+1, j-1, 1),
        ];
    }
    // k === 4
    return [
        new Vec3(i,j,3),
        new Vec3(i+1,j-1,1),
    ];

}

/**
 * Given an ijk position, finds the nearest road ijk positions.
 * Does NOT filter out positions that are out of bounds or invalid.
 * @return list of each road position as a vector3 where x=i, y=j, z=k
 */
function getRoadsOneAway(i:number, j:number, k:number): Vec3[] {
    if (i % 2 === 0) {
        if (k === 0) {
            return [
                new Vec3(i-1, j, 2),
                new Vec3(i-1, j, 4),
                new Vec3(i, j, 2),
                new Vec3(i-1, j+1, 4),
            ];
        }
        if (k === 1) {
            return [
                new Vec3(i, j, 0),
                new Vec3(i, j, 2),
                new Vec3(i-1, j+1, 4),
            ];
        }
        if (k === 2) {
            return [
                new Vec3(i, j, 0),
                new Vec3(i, j, 4),
                new Vec3(i - 1, j + 1, 4),
                new Vec3(i + 1, j + 1, 0),
            ];
        }
        if (k === 3) {
            return [
                new Vec3(i, j, 2),
                new Vec3(i, j, 4),
                new Vec3(i+1, j+1, 0),
            ];

        }
        // k === 4
        return [
            new Vec3(i,j, 2),
            new Vec3(i + 1, j, 0),
            new Vec3(i+1, j, 2),
            new Vec3(i+1, j+1, 0),
        ];
    }
    // odd i
    if (k === 0) {
        return [
            new Vec3(i-1, j-1, 2),
            new Vec3(i-1, j-1, 4),
            new Vec3(i,j, 2),
            new Vec3(i-1, j, 4),
        ];
    }
    if (k === 1) {
        return [
            new Vec3(i, j, 0),
            new Vec3(i, j, 2),
            new Vec3(i-1, j, 4),
        ]; //
    }
    if (k === 2) {
        return [
            new Vec3(i,j, 0),
            new Vec3(i,j, 4),
            new Vec3(i+1, j, 0),
            new Vec3(i-1, j, 4),
        ];
    }
    if (k === 3) {
        return [
            new Vec3(i, j, 2),
            new Vec3(i, j, 4),
            new Vec3(i+1, j, 0),
        ];
    }
    // k === 4
    return [
        new Vec3(i,j, 2),
        new Vec3(i+1, j, 0),
        new Vec3(i+1, j-1, 0),
        new Vec3(i+1, j-1, 2),
    ];

    return [];
}

/**
 * Finds which hexagon game tiles are surrounding an i,j,k coordinate. Returns coordinates, not actual tiles.
 * NOTE: May return coordinates that are out of bounds.
 */
function getAdjacentTiles(i:number, j:number, k:number): Vec2[] {
    // Even i value tiles have different rules because of offset
    if (i % 2 === 0) {
        if (k === 0) {
            return [
                new Vec2(i-2, j),
                new Vec2(i-1, j-1),
            ];
        }
        if (k === 1) {
            return [
                new Vec2(i-2, j),
                new Vec2(i-1, j-1),
                new Vec2(i-1, j),
            ];
        }
        if (k === 2) {
            return [
                new Vec2(i-1, j-1),
                new Vec2(i-1, j),
            ];
        }
        if (k === 3) {
            return [
                new Vec2(i-1, j-1),
                new Vec2(i-1, j),
                new Vec2(i, j),
            ];
        }
        // k === 4
        return [
            new Vec2(i-1, j-1),
            new Vec2(i, j),
        ];
    }
    // odd i value
    if (k === 0) {
        return [
            new Vec2(i-1, j-1),
            new Vec2(i-2,j-1)
        ];
    }
    if (k === 1) {
        return [
            new Vec2(i-1, j-1),
            new Vec2(i-2,j-1),
            new Vec2(i-1, j)
        ];
    } 
    if (k === 2) {
        return [
            new Vec2(i-1, j-1),
            new Vec2(i-1, j)
        ];
    }
    if (k === 3) {
        return [
            new Vec2(i-1, j-1),
            new Vec2(i,j-1),
            new Vec2(i-1, j)
        ];
    }
    // k === 4
    return [
        new Vec2(i-1, j-1),
        new Vec2(i, j-1)
    ];
}

/**
 * Checks if a given i,j,k state position is in the bounds of the map.
 * @param i goes along x axis (which column)
 * @param j goes along y axis (which row)
 * @param k 0-4 which corner along the bottom of the hexagon
 * @param tileTypes the map tile types. Needed for width and height
 * @param adjacentTilesParam Optional list of tiles adjacent to this point. Will be used for computation
 * @returns 
 */
function isStatePositionInBounds(i:number, j:number, k:number, tileTypes:TileType[][], adjacentTilesParam?: Vec2[]) {
    const w = tileTypes.length;
    const h = tileTypes[0].length;

    // Optional parameter to save calling adjacent tiles twice
    let adjacentTiles = adjacentTilesParam;
    if (adjacentTiles === undefined) {
        adjacentTiles = getAdjacentTiles(i, j, k);
    }

    // If no tiles around this point are in bounds, then this is out of bounds
    let isAtLeastOneTileValid = false;
    adjacentTiles.forEach((tile) => {
        if (tile.x >= 0 && tile.x < w && 
            tile.y >= 0 && tile.y < h) {
            isAtLeastOneTileValid = true;
        }
    });
    return isAtLeastOneTileValid;
}
function isStatePositionInBoundsVec(ijk: Vec3, tileTypes:TileType[][], adjacentTilesParam?: Vec2[]) {
    if (adjacentTilesParam === undefined) return isStatePositionInBounds(ijk.x, ijk.y, ijk.z, tileTypes);
    return isStatePositionInBounds(ijk.x, ijk.y, ijk.z, tileTypes, adjacentTilesParam);
}

/**
 * Checks if a world tile is in the bounds of the world grid
 * @param i the i position of the tile
 * @param j the j position of the tile
 * @param tileTypes The world grid of tile types
 * @returns True if contained in the grid, false otherwise
 */
function isTilePositionInBounds(i:number, j:number, tileTypes:TileType[][]) {
    return !(i < 0 ||
        j < 0 ||
        i >= tileTypes.length ||
        j >= tileTypes[0].length);  
}

/**
 * Determines if an i,j,k location is valid to place a house that doesn't need to be connected to a road.
 * Used at the begining of a game to allow players to place houses anywhere on the map.
 */
function validHouseLocationDisconnected(i:number, j:number, k:number, tileTypes:TileType[][],
        state:RoadHousePositionState[][][]): boolean {
    // Houses can only be on corners of hexagons
    if (k === 0 || k === 2 || k === 4) return false;

    // Must be in bounds
    const adjacentTiles = getAdjacentTiles(i, j, k);
    if (!isStatePositionInBounds(i, j, k, tileTypes, adjacentTiles)) return false;

    // At least one tile non water
    let atLeastOneNotWater = false;
    adjacentTiles.forEach((tile) => {
        if (isTilePositionInBounds(tile.x, tile.y, tileTypes) &&
            tileTypes[tile.x][tile.y] !== TileType.WATER) {
            atLeastOneNotWater = true;
        }
    });
    if (!atLeastOneNotWater) return false;

    // Can't be next to another house
    const adjacentHouseCoords = getHousesOneAway(i, j, k);
    let atLeastOneHouseAdjacent = false;
    adjacentHouseCoords.forEach((houseCoord) => {
        if (isStatePositionInBoundsVec(houseCoord, tileTypes) &&
        state[houseCoord.x][houseCoord.y][houseCoord.z].type !== RoadHouseType.NONE) {
            atLeastOneHouseAdjacent = true;
        }
    });
    if (atLeastOneHouseAdjacent) return false;

    // Can't be a house/town already in this position
    return state[i][j][k].type === RoadHouseType.NONE;
}

/**
 * Determines if an i,j,k position state is valid to place a house in that is connected to the road network.
 * Used AFTER the initial house placements.
 */
function validHouseLocationConnected(i:number, j:number, k:number, tileTypes:TileType[][],
        state:RoadHousePositionState[][][], playerId: string): boolean {

    // Houses only placed on k == 1 and 3
    if (k !== 1 && k !== 3) return false;

    // Must be valid disconnected
    const isValidDisconnected = validHouseLocationDisconnected(i,j,k, tileTypes, state);
    if (!isValidDisconnected) return false;

    // Must be connected to a road that is owned by the same player
    let connectedToAtLeastOneRoad = false;
    const adjacentRoads = getRoadsOneAway(i,j,k);
    adjacentRoads.forEach((roadPos) => {
        if (isStatePositionInBoundsVec(roadPos, tileTypes)) {
            const stateAtPos = state[roadPos.x][roadPos.y][roadPos.z];
            if (stateAtPos.type !== RoadHouseType.NONE && stateAtPos.player?.id === playerId) {
                connectedToAtLeastOneRoad = true;
            }
        }
    });

    return connectedToAtLeastOneRoad;
}

function validRoadLocation(i:number, j:number, k:number, tileTypes:TileType[][],
        state:RoadHousePositionState[][][], playerId: string): boolean {
    // Roads only placed on k = 0, 2, 4
    if (k !== 0 && k !== 2 && k !== 4) return false;

    // Must be in bounds
    if (!isStatePositionInBounds(i,j,k,tileTypes)) return false;
    
    // Can't already have a road there
    if (state[i][j][k].type !== RoadHouseType.NONE) return false;

    // At least one tile non water
    let atLeastOneNotWater = false;
    const adjacentTiles = getAdjacentTiles(i,j,k);
    adjacentTiles.forEach((tile) => {
        if (isTilePositionInBounds(tile.x, tile.y, tileTypes) &&
            tileTypes[tile.x][tile.y] !== TileType.WATER) {
            atLeastOneNotWater = true;
        }
    });
    if (!atLeastOneNotWater) return false;

    // If next to own house, gauranteed to be able to place
    const adjacentHousesPositions = getHousesOneAway(i,j,k);
    let hasOwnHouseAdjacent = false;
    adjacentHousesPositions.forEach((housePos) => {
        if (isStatePositionInBoundsVec(housePos, tileTypes)) {
            const houseStateAtPos = state[housePos.x][housePos.y][housePos.z];
            if (houseStateAtPos.type !== RoadHouseType.NONE &&
                    houseStateAtPos.player?.id === playerId) {
                hasOwnHouseAdjacent = true;
            }
        }
    });
    if (hasOwnHouseAdjacent) return true;
    
    // Must be connected to another road of same player OR a house
    let playerAdjacentRoads:Vec3[] = [];
    const adjacentRoads = getRoadsOneAway(i,j,k);
    adjacentRoads.forEach((roadPos) => {
        if (isStatePositionInBoundsVec(roadPos, tileTypes)) {
            const stateAtPos = state[roadPos.x][roadPos.y][roadPos.z];
            if (stateAtPos.type === RoadHouseType.ROAD && stateAtPos.player?.id === playerId) {
                playerAdjacentRoads.push(roadPos);
            }
        }
    });
    if (playerAdjacentRoads.length === 0) return false;

    // Can't cross over another players settlement
    // Filter out roads from our list that are blocked by another settlement
    adjacentHousesPositions.forEach((housePos) => {
        if (isStatePositionInBoundsVec(housePos, tileTypes)) {
            const houseStateAtPos = state[housePos.x][housePos.y][housePos.z];
            // Only care about houses the player doesn't own themselves
            if (houseStateAtPos.type !== RoadHouseType.NONE &&
                    houseStateAtPos.player?.id !== playerId) {
                const roadPositionsBlockedByThisHouse = getRoadsOneAway(housePos.x, housePos.y, housePos.z);
                playerAdjacentRoads = playerAdjacentRoads.filter((value, index, array) => {
                    return !roadPositionsBlockedByThisHouse.includes(value);
                });
            }
        }
    });

    return playerAdjacentRoads.length > 0;
}


/**
 * State storage for every single corner of all hexagon tiles and whether they are empty or have a road/house.
 * No duplicates. States stored in a 3d array where i,j are closely related to the game tiles i,j but slightly offset
 * Duplicates avoided by only using the bottom section of the hexagon to have no overlap.
 * 
 * For more info, see HERE (TODO LINK)
 * 
 * Only these bottom points of the hexagon are included. From left to right is the k coordinate.
 * .       .       0       4
 *  \._._./         \1_2_3/
 */
export class RoadHouseState {
    private width: number;

    private height: number;

    private depth: number;

    private stateArray: RoadHousePositionState[][][];

    private tileTypes: TileType[][];

    constructor(tileTypes:TileType[][]) {
        this.tileTypes = tileTypes;

        this.width = tileTypes.length + 2;
        this.height = tileTypes[0].length + 1;
        this.depth = 5;
        this.stateArray = [];
        for (let i = 0; i < this.width; i++) {
            this.stateArray[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.stateArray[i][j] = [];
                for (let k = 0; k < this.depth; k++) {
                    this.stateArray[i][j][k] = new RoadHousePositionState(undefined, RoadHouseType.NONE);
                }
            }
        }
    }

    /**
     * inserts a house/road at the location given inside the state array. Does NOT place in the game world.
     * @param indexLocation the location to add the house
     */
    putState(indexLocation: Vec3, placementGoal: RoadHouseType, player: PlayerState|undefined) {
        this.stateArray[indexLocation.x][indexLocation.y][indexLocation.z] =
            new RoadHousePositionState(player, placementGoal);
    }

    getPossiblePlacementLocations(placementGoal: RoadHouseType, detached: boolean, player: string) {
        const possibleLocations = [];
        for (let i = 0 ; i < this.width; i++ ) {
            for (let j = 0; j < this.height; j++) {
                for (let k = 0; k < this.depth; k++) {
                    switch (placementGoal) {
                        case RoadHouseType.NONE:
                            possibleLocations.push(new Vec3(i,j,k));
                            break;
                        case RoadHouseType.CITY:
                            //TODO
                            break;
                        case RoadHouseType.ROAD:
                            if (validRoadLocation(i,j,k, this.tileTypes, this.stateArray, player)) {
                                possibleLocations.push(new Vec3(i,j,k));
                            }
                            break;
                        case RoadHouseType.HOUSE:
                            if (detached && validHouseLocationDisconnected(i,j,k, this.tileTypes, this.stateArray)) {
                                possibleLocations.push(new Vec3(i,j,k));
                            }
                            else if (validHouseLocationConnected(i,j,k, this.tileTypes, this.stateArray, player)) {
                                possibleLocations.push(new Vec3(i,j,k));
                            }
                            break;
                    }
                }
            }
        }
        return possibleLocations;
    }

    isValidPlacementLocation(i: number, j: number, k:number, houseType: RoadHouseType, playerId: string) {
        if (houseType == RoadHouseType.ROAD) return validRoadLocation(i, j, k, this.tileTypes, this.stateArray, playerId);
        if (houseType == RoadHouseType.HOUSE) return validHouseLocationConnected(i, j, k, this.tileTypes, this.stateArray, playerId);
        //TODO: CITY
        return false;
    }
    isValidPlacementLocationInitial(i: number, j: number, k: number, houseType: RoadHouseType, playerId: string) {
        if (houseType == RoadHouseType.ROAD) return validRoadLocation(i, j, k, this.tileTypes, this.stateArray, playerId);
        if (houseType == RoadHouseType.HOUSE) return validHouseLocationDisconnected(i, j, k, this.tileTypes, this.stateArray);
        return false;
    }

    getArray() {
        return this.stateArray;
    }

    static validate(_o: any): boolean {
        const o = _o as RoadHouseState;
        return validateType(o, 'object') &&
            validateType(o.width, 'number') &&
            validateType(o.height, 'number') &&
            validateType(o.depth, 'number') &&
            validateType(o.stateArray, [[[RoadHousePositionState]]]) &&
            validateType(o.tileTypes, [['number']]);
    }

}