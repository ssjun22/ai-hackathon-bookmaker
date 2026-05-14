export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { db, isDbConfigured } from '@/lib/db';
import { myBooks } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import type { MyBookPage } from '@/lib/types';

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json([]);
  }
  try {
    const rows = await db.select().from(myBooks).orderBy(desc(myBooks.createdAt));
    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/my-books]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      storyTitle: string;
      coverEmoji: string;
      colorPalette: string;
      pages: MyBookPage[];
    };

    const { storyTitle, coverEmoji, colorPalette, pages } = body;

    if (!storyTitle || !coverEmoji || !colorPalette || !Array.isArray(pages)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const result = await db
      .insert(myBooks)
      .values({ storyTitle, coverEmoji, colorPalette, pages })
      .returning({ id: myBooks.id });

    return NextResponse.json({ id: result[0].id }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/my-books]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
