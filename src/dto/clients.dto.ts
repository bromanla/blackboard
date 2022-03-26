import { WebSocket } from 'ws';

export interface Clients {
  [key: string]: WebSocket
}
