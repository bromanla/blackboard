import WebSocket from 'ws';
import { Cron } from 'croner';
import { Application } from 'dto/application.dto';
import { Preprocessing, Summation } from 'dto/task.dto';
import logger from '../logger';

const ws = new WebSocket('ws://localhost:8000');
const update: Cron = new Cron('*/1 * * * * *', () => {
  ws.send(JSON.stringify({ task: 'preprocessing' } as Application));
}, { paused: true });

// equalize the length of characters in strings with zeros
const preprocessing = (data: Preprocessing['data']) => {
  let { a, b } = data;
  const difference = Math.abs(a.length - b.length);

  if (a.length > b.length) b = '0'.repeat(difference) + b;
  if (a.length < b.length) a = '0'.repeat(difference) + a;

  return { a, b };
};

ws.on('open', () => update.resume());
ws.on('message', (raw) => {
  update.pause();

  const req: Preprocessing = JSON.parse(raw.toString());
  const data = preprocessing(req.data);
  const res: Summation = { id: req.id, name: 'summation', data };

  ws.send(JSON.stringify(res));

  update.resume();
  logger.debug(`(preprocessing) ${res.id}`);
});
