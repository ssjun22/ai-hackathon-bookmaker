export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { uploadBookImage } from '@/lib/supabaseStorage';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'file field is required' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const url = await uploadBookImage(buffer, file.name, file.type);

    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    console.error('[POST /api/uploads]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
