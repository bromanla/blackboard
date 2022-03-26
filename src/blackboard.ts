import { WebSocketServer } from 'ws';
import { randomBytes } from 'crypto';
import { Clients } from 'dto/clients.dto';
import { Preprocessing, Task } from './dto/task.dto';
import { Application } from './dto/application.dto';
import logger from './logger';
import config from './config';

const workersSocket = new WebSocketServer({ port: config.workerPort });
const clientsSocket = new WebSocketServer({ port: config.clientPort });

const tasks: Task[] = [];
const clients: Clients = {};

workersSocket.on('connection', (ws) => {
  ws.on('message', (raw) => {
    const req: Task | Application = JSON.parse(raw.toString());

    // the worker sent a request for a task
    if ('task' in req) {
      req as Application;
      const index = tasks.findIndex((task) => task.name === req.task);

      // there are no tasks for the worker
      if (index === -1) return;

      const [task] = tasks.splice(index, 1);
      return ws.send(JSON.stringify(task));
    }

    // the worker sent a request to add a task
    req as Task;

    // if the task is completed, send it to the client
    if (req.name === 'done') {
      const client = clients[req.id];
      client.send(req.data.c);
      logger.debug(`(done) ${req.id}`);
      return delete clients[req.id];
    }
    // else add a task to the board
    tasks.push(req);
  });
});

clientsSocket.on('connection', (ws) => {
  ws.on('message', (raw) => {
    // bind the client id to the task and add it to the board
    const id = randomBytes(8).toString('hex');
    const data: Preprocessing['data'] = JSON.parse(raw.toString());
    clients[id] = ws;
    tasks.push({ id, name: 'preprocessing', data });
    logger.debug(`(push) ${id}`);
  });
});
