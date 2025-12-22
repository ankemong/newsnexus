import { Queue, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const dispatchQueue = new Queue('dispatch', { connection });
export const dispatchEvents = new QueueEvents('dispatch', { connection });

export type DispatchJobData = {
  id: string;
  url: string;
  sourceType: 'webpage' | 'article' | 'social' | 'large-scale';
  outputFormat?: 'json' | 'csv' | 'excel' | 'pdf' | 'markdown';
};

export function getConnection() {
  return connection;
}

