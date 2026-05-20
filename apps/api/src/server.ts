import { createServer } from 'node:http';
import { createApp } from './app';
import { env } from './config/env';

const app = createApp();
const server = createServer(app);

server.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}${env.API_PREFIX}`);
});

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`${signal} received. Shutting down API server...`);
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
