export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { db, isDbConfigured } from '@/lib/db';
import { books } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json([]);
  }
  try {
    const rows = await db.select().from(books).orderBy(asc(books.createdAt));
    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/books]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
