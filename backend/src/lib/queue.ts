import { Queue, type ConnectionOptions } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

// Parse the Redis URL into host/port/password so BullMQ uses its own
// bundled ioredis — avoids the dual-ioredis version TypeScript conflict.
const redisUrl = new URL(process.env.REDIS_URL as string);

const connection: ConnectionOptions = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port) || 6379,
  password: redisUrl.password || undefined,
  username: redisUrl.username || undefined,
  tls: redisUrl.protocol === 'rediss:' ? {} : undefined,
  maxRetriesPerRequest: null,
};

export const assignmentQueue = new Queue('assignment-generation', {
  connection,
});

console.log('✅ BullMQ Queue Initialized');