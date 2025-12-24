import Fastify, {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from 'fastify';
import cors from '@fastify/cors';

const app: FastifyInstance = Fastify({ logger: true });
await app.register(cors, { origin: true });

// 关闭爬虫相关接口，直接返回 410 Gone，避免被调用
app.all('/api/crawl', async (_req: FastifyRequest, reply: FastifyReply) => {
  return reply.code(410).send({ error: 'crawler service disabled' });
});

app.all('/api/jobs/:id', async (_req: FastifyRequest, reply: FastifyReply) => {
  return reply.code(410).send({ error: 'crawler service disabled' });
});

app.all(
  '/api/jobs/:id/download',
  async (_req: FastifyRequest, reply: FastifyReply) => {
    return reply.code(410).send({ error: 'crawler service disabled' });
  }
);

// -------------------- Bocha API Proxy --------------------
import { fetch as undiciFetch } from 'undici';

const BOCHA_API_KEY = process.env.BOCHA_API_KEY;
const BOCHA_API_URL =
  process.env.BOCHA_API_URL || 'https://api.bocha.ai/v1/chat';

app.post(
  '/api/bocha/chat',
  async (req: FastifyRequest, reply: FastifyReply) => {
    if (!BOCHA_API_KEY) {
      return reply.code(500).send({
        error:
          'Bocha API key not configured (BOCHA_API_KEY env missing)',
      });
    }
    try {
      const bochaResp = await undiciFetch(BOCHA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BOCHA_API_KEY}`,
        },
        body: JSON.stringify(req.body),
      });

      const text = await bochaResp.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      reply.code(bochaResp.status).send(data);
    } catch (err: any) {
      app.log.error({ err }, 'Bocha proxy error');
      reply
        .code(500)
        .send({ error: 'Bocha proxy error', detail: err?.message });
    }
  }
);

// ----------------------------------------------------------

const port = Number(process.env.PORT || 3000);
app.listen({ port, host: '0.0.0.0' }).then(() => {
  app.log.info(`Gateway listening on ${port}`);
});

