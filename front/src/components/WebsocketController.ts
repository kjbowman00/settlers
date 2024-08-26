import { ClientMessageType } from '../../../state/src/sockets/ClientMessageType';
import { ClientSocketMessage } from '../../../state/src/sockets/ClientSocketMessage';
import { SocketMessageHandler } from './SocketMessageHandler';


const endpoint = 'ws://localhost:8080'; //TODO: The backend should hand me this value somehow
/**
 * This class isolates the web socket implementation. Handles reconnecting
 */
export class WebsocketController {
    socket: WebSocket;
    socketMessageHandler: SocketMessageHandler;
    queuedMessages: string[];

    constructor(socketMessageHandler: SocketMessageHandler) {
        this.queuedMessages = [];
        this.socketMessageHandler = socketMessageHandler;
        this.socket = new WebSocket(endpoint);
        this.socket.onopen = (event: Event) => {
            this.sendQueue();
        }
        this.socket.onclose = (event: CloseEvent) => {
            //TODO: try to reconnect
        }
        this.socket.onmessage = (event: MessageEvent) => {
            this.socketMessageHandler.onMessage(event.data);
        }
        this.socket.onerror = (event: Event) => {

        }

    }

    send(str: string) {
        if (this.socket.readyState != WebSocket.OPEN) {
            this.queuedMessages.push(str);
        } else {
            // send now
            this.socket.send(str);
        }
    }

    private sendQueue() {
        for (const str of this.queuedMessages) {
            this.socket.send(str);
        }
        this.queuedMessages = [];
    }

}