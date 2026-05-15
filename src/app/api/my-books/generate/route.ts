export const runtime = 'nodejs';
export const maxDuration = 300;

import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import {
  generateBookText,
  generateCoverImage,
  generateSceneImage,
  getSceneFrames,
  resolveCharacterReferences,
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
    const { storyTitle, scenes } = await generateBookText(bookId, answers);

    // 2. 캐릭터 reference 이미지 확보 (DB 사전 준비 우선, 없으면 LLM 생성 + 업로드)
    const { buffers: refBuffers, names: refNames, byName } =
      await resolveCharacterReferences(bookId, answers);

    // scene별로 필요한 캐릭터 ref만 골라내기 위한 frame 정보
    const sceneFrames = getSceneFrames(bookId, answers);

    // 3. 표지 이미지 생성 + 업로드
    let coverImageUrl: string | undefined;
    try {
      const storySummary = scenes[0]?.body ?? storyTitle;
      const coverBuffer = await generateCoverImage(
        storyTitle,
        storySummary,
        refBuffers,
        refNames,
      );
      coverImageUrl = await uploadBookImage(
        coverBuffer,
        `cover-${randomUUID()}.png`,
        'image/png',
      );
    } catch (coverErr) {
      console.error('[generate] 표지 이미지 실패:', coverErr);
    }

    // 4. scene별 이미지 생성 + 업로드 (순차 await, silent skip)
    const pages: MyBookPage[] = [];
    let successCount = 0;

    for (const scene of scenes) {
      let imageUrl: string | undefined;

      // 이 scene에 명시된 캐릭터만 ref로 입력 (없으면 모든 ref 사용)
      const frame = sceneFrames.find((f) => f.idx === scene.idx);
      const matched = frame?.characters
        ?.map((n) => byName[n])
        .filter((b): b is Buffer => Boolean(b)) ?? [];
      const sceneRefBuffers = matched.length > 0 ? matched : refBuffers;

      try {
        const sceneBuffer = await generateSceneImage(scene, sceneRefBuffers);
        const fileName = `scene-${scene.idx}-${randomUUID()}.png`;
        imageUrl = await uploadBookImage(sceneBuffer, fileName, 'image/png');
        successCount++;
      } catch (imgErr) {
        console.error(`[generate] scene ${scene.idx} 이미지 실패:`, imgErr);
      }

      pages.push({
        pageNumber: scene.idx,
        title: scene.title,
        body: scene.body,
        imageUrl,
      });
    }

    // 전체 scene 이미지 실패 시 500
    if (successCount === 0) {
      return NextResponse.json(
        { error: '모든 scene 이미지 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 5. myBooks insert
    const inserted = await db
      .insert(myBooks)
      .values({
        storyTitle,
        coverImageUrl,
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
