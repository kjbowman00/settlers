import { randomUUID } from 'crypto';
import { WebSocketServer , WebSocket} from 'ws';
import { ISocketMessage, SocketMessageRef } from '../../state/src/SocketMessage';
import { isValid } from '../../state/src/Validator';
import { MessageType } from '../../state/src/MessageType';
import { JoinLobbyRef } from '../../state/src/messageTypes/JoinLobby';
import { CreateLobbyRef } from '../../state/src/messageTypes/CreateLobby';
import { StateUpdateRef } from '../../state/src/messageTypes/stateUpdate/StateUpdate';

const wss = new WebSocketServer({ port: 8080 });
console.log("HELLO");

const sockets: Map<string, WebSocket> = new Map();
const lobbyIdToPlayerIds: Map<string, [string]> = new Map();

wss.on('connection', function connection(ws) {
  const uuid = randomUUID();
  sockets.set(uuid, ws);
  
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
    console.log("uuid: ", uuid);
    
    console.log("AM I CRAZY");
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
    console.log("VALID1");

    // Switch depending on what message type was sent.
    switch (socketMessage.messageType) {
      case MessageType.JOIN_LOBBY:
        if (!isValid(socketMessage.payload, JoinLobbyRef)) return;
        console.log("VALID_JOIN");
        const parsedLobbyId = parsed.payload.gameId;
        const lobbyPlayers = lobbyIdToPlayerIds.get(parsedLobbyId);
        if (lobbyPlayers != undefined) {
          for (const playerId of lobbyPlayers) {
            const socket = sockets.get(playerId);
            socket?.send("playerJoined");
          }
          lobbyPlayers.push(uuid);
          ws.send("successfullyJoined");
        }
        break;
      case MessageType.CREATE_LOBBY:
        if (!isValid(socketMessage.payload, CreateLobbyRef)) return;
        console.log("VALID_CREATE");
        // Remove them from a lobby if they are currently in one
        if (lobbyId != null) {
          const index = lobbyIdToPlayerIds.get(lobbyId)?.indexOf(uuid);
          if (index != -1 && index != undefined) {
            lobbyIdToPlayerIds.get(lobbyId)?.splice(index, 1);
          }
        }
        lobbyId = randomUUID();
        lobbyIdToPlayerIds.set(lobbyId, [uuid]);
        // Notify player they have joiend and give them the ID
        ws.send("successfullyCreatedLobby");
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