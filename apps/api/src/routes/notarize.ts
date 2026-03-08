import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { createEngramClient } from '../lib/engram-client.js';

type NotarizeBody = {
  content?: string;
};

export async function registerNotarizeRoute(app: FastifyInstance) {
  app.post(
    '/notarize',
    async (
      request: FastifyRequest<{ Body: NotarizeBody }>,
      reply: FastifyReply,
    ) => {
      const { content } = request.body ?? {};

      if (!content) {
        return reply.code(400).send({ message: 'Content is required' });
      }

      try {
        const engramClient = createEngramClient();
        const result = await engramClient.notarize(content);
        return reply.send(result);
      } catch (error) {
        request.log.error({ error }, 'Failed to notarize content');
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return reply.code(500).send({ message });
      }
    },
  );
}
