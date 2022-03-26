import { Preprocessing } from 'dto/task.dto';
import WebSocket from 'ws';
import logger from './logger';

const [a, b] = process.argv.slice(-2);
const ws = new WebSocket('ws://127.0.0.1:8001');

ws.on('open', () => {
  ws.send(JSON.stringify({ a, b } as Preprocessing['data']));

  ws.on('message', (raw) => {
    logger.info(raw.toString());
    ws.close();
  });
});
