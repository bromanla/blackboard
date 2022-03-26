import 'dotenv';
import { Config } from '../dto/config.dto';

const config: Config = {
  workerPort: Number(process.env.WORKER_PORT) || 8000,
  clientPort: Number(process.env.CLIENT_PORT) || 8001
};

export default config;
