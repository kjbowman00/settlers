import { ClientMessageType } from "../../../../state/src/sockets/ClientMessageType";
import { CreateLobby } from "../../../../state/src/sockets/clientMessageTypes/CreateLobby";
import { EndTurn } from "../../../../state/src/sockets/clientMessageTypes/EndTurn";
import { JoinLobby } from "../../../../state/src/sockets/clientMessageTypes/JoinLobby";
import { StartGame } from "../../../../state/src/sockets/clientMessageTypes/StartGame";
import { ClientSocketMessage } from "../../../../state/src/sockets/ClientSocketMessage";
import { ServerMessageType } from "../../../../state/src/sockets/ServerMessageType";
import { CreateLobbyResult } from "../../../../state/src/sockets/serverMessageTypes/CreateLobbyResult";
import { GameStarted } from "../../../../state/src/sockets/serverMessageTypes/GameStarted";
import { TurnStarted } from "../../../../state/src/sockets/serverMessageTypes/TurnStarted";
import { ServerSocketMessage } from "../../../../state/src/sockets/ServerSocketMessage";
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
        0, ClientMessageType.CREATE_LOBBY, new CreateLobby()
    ));
    socketHandler.onMessage(user1.id, createLobby);
    let res = user1.messages[0] as ServerSocketMessage;
    const createLobbyRes = res.payload as CreateLobbyResult; 

    const joinLobby = JSON.stringify(new ClientSocketMessage(
        0, ClientMessageType.JOIN_LOBBY, new JoinLobby(
            createLobbyRes.lobbyID
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

    expect(user1.messages.length).toEqual(1);
    expect(user2.messages.length).toEqual(1);
    let msg = user1.messages[0].payload as GameStarted;
    expect(msg.firstPlayersTurn.playerId).toEqual(user1.id);
    msg = user2.messages[0].payload as GameStarted;
    expect(msg.firstPlayersTurn.playerId).toEqual(user1.id);
});

test('Next Turn', () => {
    // Start game
    socketHandler.onMessage(user1.id, startGame);

    // Next turn - user2
    socketHandler.onMessage(user1.id, endTurn);
    expect(user1.messages.length).toEqual(2);
    let msg = user1.messages[1].payload as TurnStarted;
    expect(msg.playerId).toEqual(user2.id);

    // Next turn - back to user1
    socketHandler.onMessage(user2.id, endTurn);
    expect(user1.messages.length).toEqual(3);
    msg = user1.messages[2].payload as TurnStarted;
    expect(msg.playerId).toEqual(user1.id);
});

test('Next turn wrong person', () => {
    // Start
    socketHandler.onMessage(user1.id, startGame);

    // Next turn but user2 calls it
    socketHandler.onMessage(user2.id, endTurn);
    expect(user1.messages.length).toEqual(1);
});

// TODO: Test for house updates