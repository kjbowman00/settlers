import { ClientMessageType } from "../../../../state/src/sockets/ClientMessageType";
import { CreateLobby } from "../../../../state/src/sockets/clientMessageTypes/CreateLobby";
import { EndTurn } from "../../../../state/src/sockets/clientMessageTypes/EndTurn";
import { JoinLobby } from "../../../../state/src/sockets/clientMessageTypes/JoinLobby";
import { RoadHouseChange } from "../../../../state/src/sockets/clientMessageTypes/RoadHouseChange";
import { StartGame } from "../../../../state/src/sockets/clientMessageTypes/StartGame";
import { ClientSocketMessage } from "../../../../state/src/sockets/ClientSocketMessage";
import { ServerMessageType } from "../../../../state/src/sockets/ServerMessageType";
import { CreateLobbyResult } from "../../../../state/src/sockets/serverMessageTypes/CreateLobbyResult";
import { GameStarted } from "../../../../state/src/sockets/serverMessageTypes/GameStarted";
import { InitialTurnStarted } from "../../../../state/src/sockets/serverMessageTypes/InitialTurnStarted";
import { RoadHouseUpdate } from "../../../../state/src/sockets/serverMessageTypes/RoadHouseUpdate";
import { TurnStarted } from "../../../../state/src/sockets/serverMessageTypes/TurnStarted";
import { ServerSocketMessage } from "../../../../state/src/sockets/ServerSocketMessage";
import { PlayerState } from "../../../../state/src/state/PlayerState";
import { RoadHouseType } from "../../../../state/src/state/RoadHouseType";
import { SocketMessageHandler } from "../../SocketMessageHandler";
import { MockClient } from "../MockClient";

let socketHandler = new SocketMessageHandler();
let user1 = new MockClient('user1');
let user2 = new MockClient('user2');

const startGame = JSON.stringify(new ClientSocketMessage(
    0, ClientMessageType.START_GAME, new StartGame() 
));
const endTurn = JSON.stringify(new ClientSocketMessage(
    0, ClientMessageType.END_TURN, new EndTurn() 
));

beforeEach(()=> {
    socketHandler = new SocketMessageHandler();

    user1 = new MockClient('user1');
    user2 = new MockClient('user2');

    socketHandler.userConnected(user1.id, user1);
    socketHandler.userConnected(user2.id, user2);

    const createLobby = JSON.stringify(new ClientSocketMessage(
        0, ClientMessageType.CREATE_LOBBY, new CreateLobby(new PlayerState(user1.id, 'user1', 'blue'))
    ));
    socketHandler.onMessage(user1.id, createLobby);
    let res = user1.messages[0] as ServerSocketMessage;
    const createLobbyRes = res.payload as CreateLobbyResult; 

    const joinLobby = JSON.stringify(new ClientSocketMessage(
        0, ClientMessageType.JOIN_LOBBY, new JoinLobby(
            createLobbyRes.initialLobbyState.lobbyId
        )
    ));
    socketHandler.onMessage(user2.id, joinLobby);

    // Clear out messages for ease of checking
    user1.messages = [];
    user2.messages = [];
});

afterEach(() => {
    socketHandler.shutdown();
});

test('Start Game', () => {
    socketHandler.onMessage(user1.id, startGame);

    const lobby = socketHandler.lobbiesData.getLobbyDataFromPlayer(user1.id);
    expect(lobby?.lobbyState.inInitialPlacementStage).toBe(true);
    expect(lobby?.lobbyState.activeTurnUserIndex).toBe(0);
    expect(lobby?.lobbyState.currentTurnPlayerId).toBe(user1.id);

    expect(user1.messages.length).toEqual(2);
    expect(user2.messages.length).toEqual(2);
    let msg = user1.messages[0].payload as GameStarted;
    expect(GameStarted.validate(msg)).toEqual(true);
    msg = user2.messages[0].payload as GameStarted;
    expect(GameStarted.validate(msg)).toEqual(true);

    let msg2 = user1.messages[1].payload as InitialTurnStarted;
    expect(msg2.playerId).toBe(user1.id);
    msg2 = user2.messages[1].payload as InitialTurnStarted;
    expect(msg2.playerId).toBe(user1.id);

});

test('Next Turn', () => {
    // Start game
    socketHandler.onMessage(user1.id, startGame);
    initialPlacementPhase();
    user1.messages = [];
    user2.messages = [];

    // Next turn - user2
    socketHandler.onMessage(user1.id, endTurn);
    expect(user1.messages.length).toEqual(1);
    let msg = user1.messages[0].payload as TurnStarted;
    expect(msg.playerId).toEqual(user2.id);

    // Next turn - back to user1
    socketHandler.onMessage(user2.id, endTurn);
    expect(user1.messages.length).toEqual(2);
    msg = user1.messages[1].payload as TurnStarted;
    expect(msg.playerId).toEqual(user1.id);
});

test('Next turn wrong person', () => {
    // Start
    socketHandler.onMessage(user1.id, startGame);
    initialPlacementPhase();
    user1.messages = [];
    user2.messages = [];

    // Next turn but user2 calls it
    socketHandler.onMessage(user2.id, endTurn);
    expect(user1.messages.length).toEqual(0); // No updates should happen - wrong user
});

function initialPlacementPhase() {
    const lobby = socketHandler.lobbiesData.getLobbyDataFromPlayer(user1.id);
    expect(lobby?.lobbyState.inInitialPlacementStage).toBe(true);
    expect(lobby?.lobbyState.activeTurnUserIndex).toBe(0);
    // user 1 placements
    let placement = lobby!.lobbyState.gameState!.roadHouseState.getPossiblePlacementLocations(RoadHouseType.HOUSE, true, user1.id)[0];
    const house1 = JSON.stringify(new ClientSocketMessage(-1, ClientMessageType.ROAD_HOUSE_CHANGE,
        new RoadHouseChange(placement.x, placement.y, placement.z,RoadHouseType.HOUSE)
    ));
    socketHandler.onMessage(user1.id, house1);
    expect(lobby?.lobbyState.inInitialPlacementStage).toBe(true);
    expect(lobby?.lobbyState.activeTurnUserIndex).toBe(0);
    let serverHouseRes = user1.messages[user1.messages.length-1].payload as RoadHouseUpdate;
    expect(serverHouseRes.i).toBe(placement.x);
    expect(serverHouseRes.j).toBe(placement.y);
    expect(serverHouseRes.k).toBe(placement.z);
    expect(serverHouseRes.roadHouseType).toBe(RoadHouseType.HOUSE);

    placement = lobby!.lobbyState.gameState!.roadHouseState.getPossiblePlacementLocations(RoadHouseType.ROAD, false, user1.id)[0];
    const road1 = JSON.stringify(new ClientSocketMessage(-1, ClientMessageType.ROAD_HOUSE_CHANGE,
        new RoadHouseChange(placement.x, placement.y, placement.z,RoadHouseType.ROAD)
    ));
    socketHandler.onMessage(user1.id, road1);
    expect(lobby?.lobbyState.inInitialPlacementStage).toBe(true);
    expect(lobby?.lobbyState.activeTurnUserIndex).toBe(1);
    serverHouseRes = user1.messages[user1.messages.length-2].payload as RoadHouseUpdate;
    expect(serverHouseRes.i).toBe(placement.x);
    expect(serverHouseRes.j).toBe(placement.y);
    expect(serverHouseRes.k).toBe(placement.z);
    expect(serverHouseRes.roadHouseType).toBe(RoadHouseType.ROAD);
    let serverChangeTurnRes = user1.messages[user1.messages.length -1].payload as InitialTurnStarted;
    expect(InitialTurnStarted.validate(serverChangeTurnRes)).toBe(true);
    expect(serverChangeTurnRes.playerId).toBe(user2.id);

    // user 2 placements
    placement = lobby!.lobbyState.gameState!.roadHouseState.getPossiblePlacementLocations(RoadHouseType.HOUSE, true, user2.id)[0];
    const house1_user2 = JSON.stringify(new ClientSocketMessage(-1, ClientMessageType.ROAD_HOUSE_CHANGE,
        new RoadHouseChange(placement.x, placement.y, placement.z,RoadHouseType.HOUSE)
    ));
    socketHandler.onMessage(user2.id, house1_user2);
    placement = lobby!.lobbyState.gameState!.roadHouseState.getPossiblePlacementLocations(RoadHouseType.ROAD, false, user2.id)[0];
    const road1User2 = JSON.stringify(new ClientSocketMessage(-1, ClientMessageType.ROAD_HOUSE_CHANGE,
        new RoadHouseChange(placement.x, placement.y, placement.z,RoadHouseType.ROAD)
    ));
    socketHandler.onMessage(user2.id, road1User2);
    expect(lobby?.lobbyState.activeTurnUserIndex).toBe(1);
    expect(lobby?.lobbyState.inInitialPlacementStage).toBe(true);

    placement = lobby!.lobbyState.gameState!.roadHouseState.getPossiblePlacementLocations(RoadHouseType.HOUSE, true, user2.id)[0];
    const house2_user2 = JSON.stringify(new ClientSocketMessage(-1, ClientMessageType.ROAD_HOUSE_CHANGE,
        new RoadHouseChange(placement.x, placement.y, placement.z,RoadHouseType.HOUSE)
    ));
    socketHandler.onMessage(user2.id, house2_user2);
    placement = lobby!.lobbyState.gameState!.roadHouseState.getPossiblePlacementLocations(RoadHouseType.ROAD, false, user2.id)[0];
    const road2User2 = JSON.stringify(new ClientSocketMessage(-1, ClientMessageType.ROAD_HOUSE_CHANGE,
        new RoadHouseChange(placement.x, placement.y, placement.z,RoadHouseType.ROAD)
    ));
    socketHandler.onMessage(user2.id, road2User2);

    expect(lobby?.lobbyState.activeTurnUserIndex).toBe(0);
    expect(lobby?.lobbyState.inInitialPlacementStage).toBe(true);
     serverChangeTurnRes = user1.messages[user1.messages.length -1].payload as InitialTurnStarted;
    expect(InitialTurnStarted.validate(serverChangeTurnRes)).toBe(true);
    expect(serverChangeTurnRes.playerId).toBe(user1.id);
    
    // User 1 again
    placement = lobby!.lobbyState.gameState!.roadHouseState.getPossiblePlacementLocations(RoadHouseType.HOUSE, true, user1.id)[0];
    const house2_user1 = JSON.stringify(new ClientSocketMessage(-1, ClientMessageType.ROAD_HOUSE_CHANGE,
        new RoadHouseChange(placement.x, placement.y, placement.z,RoadHouseType.HOUSE)
    ));
    socketHandler.onMessage(user1.id, house2_user1);
    expect(lobby?.lobbyState.inInitialPlacementStage).toBe(true);
    expect(lobby?.lobbyState.activeTurnUserIndex).toBe(0);
    serverHouseRes = user1.messages[user1.messages.length-1].payload as RoadHouseUpdate;
    expect(serverHouseRes.i).toBe(placement.x);
    expect(serverHouseRes.j).toBe(placement.y);
    expect(serverHouseRes.k).toBe(placement.z);
    expect(serverHouseRes.roadHouseType).toBe(RoadHouseType.HOUSE);

    placement = lobby!.lobbyState.gameState!.roadHouseState.getPossiblePlacementLocations(RoadHouseType.ROAD, false, user1.id)[0];
    const road2_user1 = JSON.stringify(new ClientSocketMessage(-1, ClientMessageType.ROAD_HOUSE_CHANGE,
        new RoadHouseChange(placement.x, placement.y, placement.z,RoadHouseType.ROAD)
    ));
    socketHandler.onMessage(user1.id, road2_user1);
    
    // END INTIAL PLACEMENT PHASE
    expect(lobby?.lobbyState.inInitialPlacementStage).toBe(false);
    expect(lobby?.lobbyState.activeTurnUserIndex).toBe(0);
    serverHouseRes = user1.messages[user1.messages.length-2].payload as RoadHouseUpdate;
    expect(serverHouseRes.i).toBe(placement.x);
    expect(serverHouseRes.j).toBe(placement.y);
    expect(serverHouseRes.k).toBe(placement.z);
    expect(serverHouseRes.roadHouseType).toBe(RoadHouseType.ROAD);
    serverChangeTurnRes = user1.messages[user1.messages.length -1].payload as TurnStarted;
    expect(TurnStarted.validate(serverChangeTurnRes)).toBe(true);
    expect(serverChangeTurnRes.playerId).toBe(user1.id);
}

// TODO: Test for house updates