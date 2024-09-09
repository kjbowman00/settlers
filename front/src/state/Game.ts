import { PerspectiveCamera, Scene } from 'three';
import * as THREE from 'three';
import { GameWorld } from '../three/GameWorld';
import { HighlightedHousePlacementGeometry } from '../GameObjects/Geometry/interactables/HighlightedHousePlacementGeometry';
import { HouseGeometry } from '../GameObjects/Geometry/interactables/HouseGeometry';
import { OceanWater, OceanFloor } from '../GameObjects/Geometry/terrain/Ocean';
import { TerrainGeometry } from '../GameObjects/Geometry/terrain/TerrainGeometry';
import { TreeGeometry } from '../GameObjects/Geometry/terrain/TreeGeometry';
import { WheatField } from '../GameObjects/Geometry/terrain/Wheat';
import { ZigguratGeometry } from '../GameObjects/Geometry/terrain/ZigguratGeometry';
import { CameraController } from '../GameObjects/logic/CameraController';
import { Lighting } from '../GameObjects/misc/Lighting';
import { RoadHouseState, getXZPosition } from '../../../state/src/state/RoadHouseState';
import { PositionState, PositionStateType } from '../../../state/src/state/PositionState';
import { HouseUI } from '../UI/HouseUI';
import { AppSync } from '../components/AWSAppSync';
import { IRoadHouseStateUpdate, RoadHouseStateUpdate } from './RoadHouseStateUpdate';
import { StateUpdateController } from './StateUpdateController';
import { GameState } from '../../../state/src/state/GameState';
import { Vec3 } from '../../../state/src/state/Vec3';
import { convertVec2, convertVec3 } from '../utility/ThreeUtils';

export class Game {
    world: GameWorld;
    terrain: TerrainGeometry;
    lighting : Lighting;
    houseGeometry: HouseGeometry;
    trees: TreeGeometry;
    pyramids: ZigguratGeometry;
    oceanWater: OceanWater;
    oceanFloor: OceanFloor;
    wheatField: WheatField;
    highlightedHousePlacementGeometry: HighlightedHousePlacementGeometry;
    cameraControls: CameraController;

    houseUI: HouseUI;

    gameState: GameState;

    constructor(scene: Scene, initialCameraAspectRatio: number, canvas: HTMLCanvasElement,
        initialGameState: GameState) {
        this.gameState = initialGameState;
        this.world = new GameWorld(scene);

        const tileState = initialGameState.tileState
        const tileTypes = tileState.tileTypes;
        const hexagonWorldRadius = 3;
        this.terrain = new TerrainGeometry(hexagonWorldRadius, 6, 5, tileTypes);
        this.world.addGameObject(this.terrain);

        this.cameraControls = new CameraController(canvas, tileState.tileGridWidth,
            tileState.tileGridHeight, hexagonWorldRadius, this.terrain, initialCameraAspectRatio);
        this.world.addGameObject(this.cameraControls);
        
        this.trees = new TreeGeometry(this.terrain.tiles);
        this.world.addGameObject(this.trees);

        this.lighting = new Lighting();
        this.world.addGameObject(this.lighting);

        this.pyramids = new ZigguratGeometry(this.terrain.tiles);
        this.world.addGameObject(this.pyramids);

        this.oceanWater = new OceanWater(-hexagonWorldRadius*0.1);
        this.oceanFloor = new OceanFloor(-hexagonWorldRadius*0.5);
        this.world.addGameObject(this.oceanWater);
        this.world.addGameObject(this.oceanFloor);

        this.wheatField = new WheatField(this.terrain.tiles);
        this.world.addGameObject(this.wheatField);

        this.houseGeometry = new HouseGeometry(initialGameState.roadHouseState, hexagonWorldRadius);
        this.world.addGameObject(this.houseGeometry);

        this.highlightedHousePlacementGeometry = new HighlightedHousePlacementGeometry(this.terrain, this);
        this.world.addGameObject(this.highlightedHousePlacementGeometry);

        // Things that are not game objects
        this.houseUI = new HouseUI(this);
    }

    adjustCameraAspectRatio(aspectRatio: number) {
        this.cameraControls.camera.aspect = aspectRatio;
        this.cameraControls.camera.updateProjectionMatrix();
    }


    update(deltaTime: number, timestamp:number) {
        this.world.update(deltaTime, timestamp);
    }

    addHighlightedAreas(placementGoal: PositionStateType, detached: boolean) {
        const indexLocations = this.gameState.roadHouseState.getPossiblePlacementLocations(placementGoal, detached, 'todo: username here');
        const locations: [THREE.Vector3, THREE.Vector2][] = [];
        indexLocations.forEach((ijkVector: Vec3) => {
            const worldPositionVector = convertVec2(getXZPosition(ijkVector.x, ijkVector.y, ijkVector.z, 
                this.terrain.hexagonWorldRadius));
            locations.push([convertVec3(ijkVector), worldPositionVector]);
        });
        this.highlightedHousePlacementGeometry.updateLocations(locations, placementGoal);
    }

    getRaycaster(mouseEvent: MouseEvent) : THREE.Raycaster {
        const x = (mouseEvent.clientX / window.innerWidth) * 2 - 1;
        const y = -(mouseEvent.clientY / window.innerHeight) * 2 + 1;
        const mousePos = new THREE.Vector2(x,y);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mousePos, this.cameraControls.camera);
        return raycaster;
    }

    placeRoadOrSettlement(idx: THREE.Vector3, placementGoal: PositionStateType) {
        const roadHouseStateUpdate = new RoadHouseStateUpdate(idx.x, idx.y, idx.z,
            "TODO_USERNAME_HERE",placementGoal);
        // const update = new StateUpdate(roadHouseStateUpdate, StateUpdateType.ROAD_HOUSE_STATE, null);
        // this.appSync.publish(update);
        // this.stateUpdateController.updateLocalData(update);
    }
    serverRoadStateUpdate(update: IRoadHouseStateUpdate) {
        // const playerPlacing = this.appSync.menuManager.stateUpdateController.fullState.lobbyState.getPlayer(update.player);
        const playerPlacing = { playerID : "TODO"};
        const indexLocation = new THREE.Vector3(update.i, update.j, update.k);
        // this.roadHouseState.putState(indexLocation, update.placementGoal, playerPlacing!.playerID, playerPlacing!.playerColor);
        this.houseGeometry.updateMeshes();
        this.highlightedHousePlacementGeometry.empty();
    }
}
