// 사용법:
//   pnpm tsx --env-file=.env.local scripts/update-book-character-image.ts \
//     <bookId> <name> <imageFilePath>
//
// 동작: 새 이미지를 Storage 에 업로드하고 book_characters 테이블의 해당 row 의
// ref_image_url 만 갱신한다. 같은 (bookId, name) row 가 둘 이상이면 가장 최근
// 행 하나만 갱신.

import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { and, desc, eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import * as schema from "../src/lib/db/schema";

async function main() {
  const [bookId, name, filePath] = process.argv.slice(2);

  if (!bookId || !name || !filePath) {
    console.error(
      "Usage: pnpm tsx --env-file=.env.local scripts/update-book-character-image.ts <bookId> <name> <filePath>",
    );
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mimeType =
    ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : `image/${ext}`;
  const storagePath = `characters/${bookId}/${Date.now()}.${ext || "jpg"}`;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error: upErr } = await supabase.storage
    .from("book-images")
    .upload(storagePath, buffer, { contentType: mimeType });

  if (upErr) {
    console.error("Storage upload failed:", upErr.message);
    process.exit(1);
  }

  const { data } = supabase.storage
    .from("book-images")
    .getPublicUrl(storagePath);
  const refImageUrl = data.publicUrl;

  const dbUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL!;
  const client = postgres(dbUrl);
  const db = drizzle(client, { schema });

  // 가장 최근에 등록된 (bookId, name) row 1개의 ref_image_url 갱신
  const targets = await db
    .select()
    .from(schema.bookCharacters)
    .where(
      and(
        eq(schema.bookCharacters.bookId, bookId),
        eq(schema.bookCharacters.name, name),
      ),
    )
    .orderBy(desc(schema.bookCharacters.createdAt))
    .limit(1);

  if (targets.length === 0) {
    console.error(`No book_characters row matched: bookId=${bookId} name=${name}`);
    process.exit(1);
  }

  const target = targets[0];
  const [updated] = await db
    .update(schema.bookCharacters)
    .set({ refImageUrl })
    .where(eq(schema.bookCharacters.id, target.id))
    .returning();

  console.log("✓ updated:");
  console.log("  id:", updated.id);
  console.log("  bookId:", updated.bookId);
  console.log("  name:", updated.name);
  console.log("  refImageUrl (old):", target.refImageUrl);
  console.log("  refImageUrl (new):", updated.refImageUrl);

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
