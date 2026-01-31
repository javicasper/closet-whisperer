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

// Validate environment variables with helpful error messages
let config: z.infer<typeof envSchema>;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    console.error('\n💡 Check your .env file and make sure all required variables are set.');
    console.error('   You can copy .env.example to .env and fill in the values.\n');
  }
  process.exit(1);
}

export { config };
