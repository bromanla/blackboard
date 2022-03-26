import WebSocket from 'ws';
import { Cron } from 'croner';
import { Application } from 'dto/application.dto';
import { Done, Summation } from 'dto/task.dto';
import logger from '../logger';

const ws = new WebSocket('ws://localhost:8000');
const update: Cron = new Cron('*/1 * * * * *', () => {
  ws.send(JSON.stringify({ task: 'summation' } as Application));
}, { paused: true });

// column addition method
const summation = (data: Summation['data']) => {
  const { a, b } = data;
  let transfer = 0;
  let c = '';

  for (let i = a.length - 1; i >= 0; i -= 1) {
    const acc = Number(a[i]) + Number(b[i]) + transfer;

    if (acc > 9) {
      transfer = 1;
      c = String(acc % 10) + c;
   } else {
      transfer = 0;
      c = String(acc) + c;
    }
  }

  if (transfer) c = transfer + String(c);

  return { c };
};

ws.on('open', () => update.resume());
ws.on('message', (raw) => {
  update.pause();

  const req: Summation = JSON.parse(raw.toString());
  const data = summation(req.data);
  const res: Done = { id: req.id, name: 'done', data };

  ws.send(JSON.stringify(res));

  update.resume();
  logger.debug(`(summation) ${res.id} completed`);
});
