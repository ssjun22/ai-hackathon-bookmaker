import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Supabase Storage 'book-images' 버킷에 이미지를 업로드하고 public URL을 반환한다.
 * 서버 전용 — service role key 사용.
 */
export async function uploadBookImage(
  file: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const path = `pages/${Date.now()}-${fileName}`;

  const { error } = await supabase.storage
    .from('book-images')
    .upload(path, file, { contentType: mimeType });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from('book-images').getPublicUrl(path);
  return data.publicUrl;
}
