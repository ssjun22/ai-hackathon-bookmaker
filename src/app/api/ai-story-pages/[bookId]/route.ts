export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiStoryPages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const rows = await db
      .select()
      .from(aiStoryPages)
      .where(eq(aiStoryPages.bookId, bookId));

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('[GET /api/ai-story-pages/[bookId]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
