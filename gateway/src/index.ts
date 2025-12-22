import Fastify, {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from 'fastify';
import cors from '@fastify/cors';
import { nanoid } from 'nanoid';
import { CrawlRequest, JobRecord } from './types.js';
import { dispatchQueue, getConnection } from './queue.js';
// @ts-expect-error: mime-types package may not have TypeScript types installed
import { lookup as mimeLookup } from 'mime-types';
import fs from 'node:fs';
import path from 'node:path';

const STORAGE_DIR = process.env.STORAGE_DIR ?? path.resolve(process.cwd(), 'storage');
fs.mkdirSync(STORAGE_DIR, { recursive: true });

const redis = getConnection();
const app: FastifyInstance = Fastify({ logger: true });
await app.register(cors, { origin: true });

function jobKey(id: string) {
  return `jobs:${id}`;
}

app.post(
  '/api/crawl',
  async (
    req: FastifyRequest<{ Body: Partial<CrawlRequest> }>,
    reply: FastifyReply
  ) => {
    const body = req.body;
    if (!body?.url || !body?.sourceType) {
      return reply
        .code(400)
        .send({ error: 'url and sourceType are required' });
    }
    const id = nanoid();
    const record: JobRecord = {
      id,
      req: {
        url: body.url!,
        sourceType: body.sourceType!,
        outputFormat: body.outputFormat || 'json',
      },
      status: 'queued',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await redis.hset(jobKey(id), {
      id: record.id,
      status: record.status,
      req: JSON.stringify(record.req),
      createdAt: String(record.createdAt),
      updatedAt: String(record.updatedAt),
    });
    await dispatchQueue.add(
      'dispatch',
      { id, ...record.req },
      { removeOnComplete: true, removeOnFail: false }
    );
    return reply.code(201).send({ id });
  }
);

app.get(
  '/api/jobs/:id',
  async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = req.params;
    const data = await redis.hgetall(jobKey(id));
    if (!data?.id) return reply.code(404).send({ error: 'not found' });
    const resp: any = {
      id: data.id,
      status: data.status,
      req: data.req ? JSON.parse(data.req) : undefined,
      createdAt: data.createdAt ? Number(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? Number(data.updatedAt) : undefined,
      filePath: data.filePath,
      error: data.error,
    };
    return reply.send(resp);
  }
);

app.get(
  '/api/jobs/:id/download',
  async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = req.params;
    const data = await redis.hgetall(jobKey(id));
    if (!data?.id) return reply.code(404).send({ error: 'not found' });
    if (data.status !== 'completed' || !data.filePath) {
      return reply.code(409).send({ error: 'job not completed' });
    }
    const filePath = data.filePath;
    if (!fs.existsSync(filePath))
      return reply.code(410).send({ error: 'file missing' });
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath);
    const mime = mimeLookup(ext) || 'application/octet-stream';
    reply.header('Content-Type', mime);
    reply.header('Content-Length', String(stat.size));
    reply.header(
      'Content-Disposition',
      `attachment; filename="${path.basename(filePath)}"`
    );
    const stream = fs.createReadStream(filePath);
    return reply.send(stream);
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

