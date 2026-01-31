import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.string().transform(Number),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
  MINIO_BUCKET: z.string().default('garments'),
  MINIO_USE_SSL: z.string().transform(val => val === 'true').default('false'),
  OPENROUTER_API_KEY: z.string(),
  OPENROUTER_MODEL: z.string().default('openai/gpt-4o'),
  PORT: z.string().transform(Number).default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const config = envSchema.parse(process.env);
