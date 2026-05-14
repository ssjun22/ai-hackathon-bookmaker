export const runtime = 'nodejs';
export const maxDuration = 300;

import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import {
  generateBookText,
  generateReferenceImage,
  generateSceneImage,
} from '@/lib/storyGeneration';
import { uploadBookImage } from '@/lib/supabaseStorage';
import { db } from '@/lib/db';
import { myBooks } from '@/lib/db/schema';
import type { ChatAnswer, MyBookPage } from '@/lib/types';

interface GenerateRequestBody {
  bookId: string;
  answers: ChatAnswer[];
}

export async function POST(request: Request) {
  let body: GenerateRequestBody;

  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 });
  }

  const { bookId, answers } = body;
  if (!bookId || !Array.isArray(answers)) {
    return NextResponse.json(
      { error: 'bookId와 answers가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    // 1. 텍스트 생성
    const { storyTitle, coverEmoji, colorPalette, scenes } = await generateBookText(
      bookId,
      answers
    );

    // 2. reference 이미지 생성
    const refBuffer = await generateReferenceImage(bookId, answers);

    // 3. scene별 이미지 생성 + 업로드 (순차 await)
    const pages: MyBookPage[] = [];

    for (const scene of scenes) {
      let imageUrl: string | undefined;

      try {
        const sceneBuffer = await generateSceneImage(scene, refBuffer);
        const fileName = `${randomUUID()}.png`;
        imageUrl = await uploadBookImage(sceneBuffer, fileName, 'image/png');
      } catch (imgErr) {
        // 이미지 실패 시 비상안: imageUrl 없이 진행 (텍스트만 저장)
        console.error(`[generate] scene ${scene.idx} 이미지 실패:`, imgErr);
        imageUrl = undefined;
      }

      pages.push({
        pageNumber: scene.idx,
        title: scene.title,
        body: scene.body,
        colorPalette,
        emoji: coverEmoji,
        imageUrl,
      });
    }

    // 4. myBooks insert
    const inserted = await db
      .insert(myBooks)
      .values({
        storyTitle,
        coverEmoji,
        colorPalette,
        pages,
      })
      .returning({ id: myBooks.id });

    const id = inserted[0]?.id;
    if (!id) {
      throw new Error('DB insert 후 id를 받지 못했습니다.');
    }

    return NextResponse.json({ id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[POST /api/my-books/generate]', err);
    return NextResponse.json(
      { error: `AI 생성 실패: ${message}` },
      { status: 500 }
    );
  }
}
