import { randomUUID } from 'crypto';
import { WebSocketServer , WebSocket} from 'ws';
import { ClientSocketMessageRef, IClientSocketMessage } from '../../state/src/sockets/ClientSocketMessage';
import { isValid } from '../../state/src/sockets/Validator';
import { ClientMessageType } from '../../state/src/sockets/ClientMessageType';
import { JoinLobbyRef } from '../../state/src/sockets/clientMessageTypes/JoinLobby';
import { CreateLobbyRef } from '../../state/src/sockets/clientMessageTypes/CreateLobby';
import { UserData } from './dataHolders/UserData';
import { LobbiesData } from './dataHolders/LobbiesData';
import { JoinLobbyHandler } from './handlers/JoinLobbyHandler';
import { CreateLobbyHandler } from './handlers/CreateLobbyHandler';
import { SocketMessageHandler } from './SocketMessageHandler';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });
console.log("Opening websocket on port 8080");

const socketEntryPoint = new SocketMessageHandler();

wss.on('connection', function connection(ws) {
  const uuid = randomUUID();
  socketEntryPoint.userConnected(uuid, ws);
  
  ws.on('error', console.error);

  ws.on('message', function message(data) { 
    socketEntryPoint.onMessage(uuid, data);
  });
});