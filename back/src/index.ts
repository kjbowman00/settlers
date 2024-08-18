import { randomUUID } from 'crypto';
import { WebSocketServer , WebSocket} from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const sockets: Map<string, WebSocket> = new Map();
const lobbyIdToPlayerIds: Map<string, [string]> = new Map();

wss.on('connection', function connection(ws) {
  const uuid = randomUUID();
  sockets.set(uuid, ws);
  
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
    console.log("uuid: ", uuid);
    
    const parsed = JSON.parse(data.toString());
    let lobbyId : null | string = null;

    // Ensure data is of certain type.

    // Switch depending on what message type was sent.
    switch (parsed.action) {
      case "joinLobby":
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
      case "createLobby":
        if (lobbyId == null) {
          //This shouldn't happen
          return;
        }
        lobbyId = randomUUID();
        lobbyIdToPlayerIds.set(lobbyId, [uuid]);
        // Notify player they have joiend and give them the ID
        ws.send("successfullyCreatedLobby");
        
        break;
      case "messageLobby":
        if (lobbyId != null) {
          const lobbyPlayers = lobbyIdToPlayerIds.get(lobbyId);
          if (lobbyPlayers != undefined) {
            for (const playerId of lobbyPlayers) {
              const socket = sockets.get(playerId);
              socket?.send("MESSAGE");
            }
          }
        }
        break;
    }
  });
});