/**
 * 스토리 제목에서 " — 나의 동화" 접미어를 제거해 표시용 제목을 반환한다.
 */
export function displayTitle(title: string): string {
  return title.replace(/\s*[—–-]\s*나의\s*동화\s*$/u, "");
}
