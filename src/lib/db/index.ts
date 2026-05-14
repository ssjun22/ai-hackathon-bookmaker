import 'server-only';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = global as unknown as { db?: DrizzleDb };

let cached: DrizzleDb | undefined;

export const isDbConfigured = (): boolean => Boolean(process.env.DATABASE_URL);

function getDb(): DrizzleDb {
  if (cached) return cached;
  if (globalForDb.db) {
    cached = globalForDb.db;
    return cached;
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('[db] DATABASE_URL 환경변수가 없습니다. .env.local을 확인하세요.');
  }
  cached = drizzle(postgres(process.env.DATABASE_URL), { schema });
  if (process.env.NODE_ENV !== 'production') {
    globalForDb.db = cached;
  }
  return cached;
}

export const db = new Proxy({} as DrizzleDb, {
  get(_, prop) {
    const target = getDb() as unknown as Record<string | symbol, unknown>;
    const value = target[prop];
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(target) : value;
  },
});
