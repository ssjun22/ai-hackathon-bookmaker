// 사용법:
//   pnpm tsx --env-file=.env.local scripts/seed-book-characters.ts \
//     <bookId> <name> <appearance> <imageFilePath>
//
// 예:
//   pnpm tsx --env-file=.env.local scripts/seed-book-characters.ts \
//     rabbit \
//     "정직한 농부" \
//     "흰 한복과 흰 머리띠를 두른 둥근 얼굴의 농부, 미소 띤 얼굴에 농기구를 들고 맨발로 서 있는 한국 전래동화풍 수채화 캐릭터" \
//     "/Users/choiyoungjun/Downloads/files 2/정직한 농부.jpg"

import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { createClient } from "@supabase/supabase-js";
import * as schema from "../src/lib/db/schema";

async function main() {
  const [bookId, name, appearance, filePath] = process.argv.slice(2);

  if (!bookId || !name || !appearance || !filePath) {
    console.error(
      "Usage: pnpm tsx --env-file=.env.local scripts/seed-book-characters.ts <bookId> <name> <appearance> <filePath>",
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

  const [row] = await db
    .insert(schema.bookCharacters)
    .values({ bookId, name, appearance, refImageUrl })
    .returning();

  console.log("✓ inserted:");
  console.log("  id:", row.id);
  console.log("  bookId:", row.bookId);
  console.log("  name:", row.name);
  console.log("  refImageUrl:", row.refImageUrl);

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
