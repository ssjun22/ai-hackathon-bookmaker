import 'server-only';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('[db] DATABASE_URL 환경변수가 없습니다. .env.local을 확인하세요.');
}

const globalForDb = global as unknown as { db: ReturnType<typeof drizzle> };

const client =
  globalForDb.db ??
  drizzle(postgres(process.env.DATABASE_URL), { schema });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = client;
}

export const db = client;
