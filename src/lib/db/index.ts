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
  // Supabase pgBouncer(pooler) 호환 옵션
  // - prepare: false  → pgBouncer transaction pooler에서 prepared statements 미지원
  // - max: 1          → 서버리스/dev 환경에서 풀 크기 작게
  // - idle_timeout    → idle 연결 빨리 정리해 stale ETIMEDOUT 방지
  // - max_lifetime    → 오래된 연결 주기적 재생성
  // - connect_timeout → 초기 연결 타임아웃 단축
  cached = drizzle(
    postgres(process.env.DATABASE_URL, {
      prepare: false,
      max: 1,
      idle_timeout: 20,
      max_lifetime: 60 * 5,
      connect_timeout: 10,
    }),
    { schema },
  );
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
