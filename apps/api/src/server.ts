import 'dotenv/config';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import { registerHealthRoute } from './routes/health.js';
import { registerNotarizeRoute } from './routes/notarize.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
});

await registerHealthRoute(app);
await registerNotarizeRoute(app);

const port = Number(process.env.PORT ?? '4000');
const host = process.env.HOST ?? '0.0.0.0';

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
