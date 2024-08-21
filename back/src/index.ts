import { randomUUID } from 'crypto';
import { WebSocketServer , WebSocket} from 'ws';
import { ISocketMessage, SocketMessageRef } from '../../state/src/SocketMessage';
import { isValid } from '../../state/src/Validator';
import { MessageType } from '../../state/src/MessageType';
import { JoinLobbyRef } from '../../state/src/messageTypes/JoinLobby';
import { CreateLobbyRef } from '../../state/src/messageTypes/CreateLobby';
import { StateUpdateRef } from '../../state/src/messageTypes/stateUpdate/StateUpdate';
import { UserData } from './dataHolders/UserData';
import { LobbiesData } from './dataHolders/LobbiesData';
import { JoinLobbyHandler } from './handlers/JoinLobbyHandler';
import { CreateLobbyHandler } from './handlers/CreateLobbyHandler';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });
console.log("Opening websocket on port 8080");

const lobbiesData = new LobbiesData();
const userData = new UserData();

const createLobbyHandler = new CreateLobbyHandler(lobbiesData, userData);
const joinLobbyHandler = new JoinLobbyHandler(lobbiesData, userData);

wss.on('connection', function connection(ws) {
  const uuid = randomUUID();
  userData.addUser(uuid, ws);
  
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
    console.log("uuid: ", uuid);
    
    let parsed;
    try {
      console.log(data.toString());
      parsed = JSON.parse(data.toString());
    } catch (e){
      console.log("BAD DATA");
      return;
    }
    let lobbyId : null | string = null;

    // Ensure data types match
    if (!isValid(parsed, SocketMessageRef)) return;
    const socketMessage: ISocketMessage = parsed as ISocketMessage;
    console.log("Valid socket message");

    // Switch depending on what message type was sent.
    switch (socketMessage.messageType) {
      case MessageType.JOIN_LOBBY:
        joinLobbyHandler.handle(parsed.payload, uuid);
        break;
      case MessageType.CREATE_LOBBY:
        createLobbyHandler.handle(parsed.payload, uuid);
        break;
      case MessageType.STATE_UPDATE:
        if (!isValid(socketMessage.payload, StateUpdateRef)) return;
        console.log("VALID_STATE");
        //TODO: Update the servers state to match this. THen send update to all players
        // if (lobbyId != null) {
        //   const lobbyPlayers = lobbyIdToPlayerIds.get(lobbyId);
        //   if (lobbyPlayers != undefined) {
        //     for (const playerId of lobbyPlayers) {
        //       const socket = sockets.get(playerId);
        //       socket?.send("MESSAGE");
        //     }
        //   }
        // }
        break;
    }
  });
});