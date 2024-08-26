import { CreateLobby } from "../../../../state/src/sockets/clientMessageTypes/CreateLobby";
import { SocketMessageHandler } from "../../SocketMessageHandler";
import { MockClient } from "../MockClient";
import { CreateLobbyResult } from "../../../../state/src/sockets/serverMessageTypes/CreateLobbyResult";
import { ClientSocketMessage } from "../../../../state/src/sockets/ClientSocketMessage";
import { ClientMessageType } from "../../../../state/src/sockets/ClientMessageType";
import { JoinLobby } from "../../../../state/src/sockets/clientMessageTypes/JoinLobby";
import { ServerSocketMessage } from "../../../../state/src/sockets/ServerSocketMessage";
import { PlayerJoinedLobby } from '../../../../state/src/sockets/serverMessageTypes/PlayerJoinedLobby';
import { Server } from "http";
import { JoinLobbyResult } from "../../../../state/src/sockets/serverMessageTypes/JoinLobbyResult";

test("Create and join lobby", () => {
    const socketHandler = new SocketMessageHandler();

    const user1 = new MockClient('user1');
    const user2 = new MockClient('user2');

    socketHandler.userConnected(user1.id, user1);
    socketHandler.userConnected(user2.id, user2);

    // -- Create Lobby --
    const createLobby = JSON.stringify(new ClientSocketMessage(
        0, ClientMessageType.CREATE_LOBBY, new CreateLobby()
    ));
    socketHandler.onMessage(user1.id, createLobby);
    expect(user1.messages.length).toEqual(1);
    let res = user1.messages[0] as ServerSocketMessage;
    const createLobbyRes = res.payload as CreateLobbyResult; 
    expect(createLobbyRes.success).toEqual(true);
    expect(typeof createLobbyRes.lobbyID).toEqual('string');

    // -- Join Lobby --
    const joinLobby = JSON.stringify(new ClientSocketMessage(
        0, ClientMessageType.JOIN_LOBBY, new JoinLobby(
            createLobbyRes.lobbyID
        )
    ));
    socketHandler.onMessage(user2.id, joinLobby);
    expect(user1.messages.length).toEqual(2);
    res = user1.messages[1] as ServerSocketMessage;
    const playerJoined = res.payload as PlayerJoinedLobby;
    expect(playerJoined.player.id).toEqual(user2.id);

    expect(user2.messages.length).toEqual(1);
    res = user2.messages[0] as ServerSocketMessage;
    const joinLobbyResult = res.payload as JoinLobbyResult;
    expect(joinLobbyResult.success).toEqual(true);

    socketHandler.shutdown();
});
