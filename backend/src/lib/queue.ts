import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// 1. Establish the connection to Upstash Redis
// BullMQ requires maxRetriesPerRequest to be null
const connection = new IORedis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null,
});

// 2. Initialize the BullMQ Queue where our AI Jobs will sit
export const assignmentQueue = new Queue('assignment-generation', { 
  connection 
});

console.log('✅ BullMQ Queue Initialized');
