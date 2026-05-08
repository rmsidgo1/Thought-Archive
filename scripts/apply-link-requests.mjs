/**
 * LINK_REQUESTS.json 처리 스크립트
 *
 * LLM이 노트 작성 후 남긴 연결 요청을 기존 노트에 자동으로 적용합니다.
 * GitHub Actions에서 실행됩니다.
 *
 * LINK_REQUESTS.json 형식:
 * {
 *   "source_slug": "새_노트_slug",
 *   "links": [
 *     { "target_slug": "연결_추가할_기존_노트_slug" }
 *   ]
 * }
 */

import { readFile, writeFile, unlink, access } from 'fs/promises';
import { join } from 'path';

const LINK_REQUESTS_FILE = './LINK_REQUESTS.json';
const NOTES_DIR = './src/content/notes';

async function fileExists(path) {
  try { await access(path); return true; }
  catch { return false; }
}

// LINK_REQUESTS.json 없으면 조용히 종료
if (!await fileExists(LINK_REQUESTS_FILE)) {
  console.log('LINK_REQUESTS.json 없음 — 건너뜁니다.');
  process.exit(0);
}

// JSON 파싱
let data;
try {
  const raw = await readFile(LINK_REQUESTS_FILE, 'utf-8');
  data = JSON.parse(raw);
} catch (e) {
  console.error('❌ LINK_REQUESTS.json 파싱 실패:', e.message);
  console.error('   파일을 보존합니다. 수동으로 확인하세요.');
  process.exit(1);
}

// 스키마 검증
const { source_slug, links } = data;
if (typeof source_slug !== 'string' || !source_slug.trim()) {
  console.error('❌ source_slug가 없거나 빈 문자열입니다.');
  process.exit(1);
}
if (!Array.isArray(links)) {
  console.error('❌ links가 배열이 아닙니다.');
  process.exit(1);
}

// source 노트 존재 확인
if (!await fileExists(join(NOTES_DIR, `${source_slug}.md`))) {
  console.error(`❌ source 노트를 찾을 수 없습니다: ${source_slug}.md`);
  process.exit(1);
}

console.log(`\n📎 source: [[${source_slug}]] → ${links.length}개 연결 요청\n`);

let applied = 0;
let skipped = 0;

for (const entry of links) {
  const { target_slug } = entry ?? {};

  if (typeof target_slug !== 'string' || !target_slug.trim()) {
    console.warn('⚠️  유효하지 않은 target_slug — 건너뜁니다.');
    skipped++;
    continue;
  }

  const targetPath = join(NOTES_DIR, `${target_slug}.md`);

  if (!await fileExists(targetPath)) {
    console.warn(`⚠️  ${target_slug}.md 없음 — 건너뜁니다.`);
    skipped++;
    continue;
  }

  const content = await readFile(targetPath, 'utf-8');

  // 이미 연결되어 있으면 스킵
  if (content.includes(`[[${source_slug}]]`)) {
    console.log(`⏭  이미 연결됨: ${target_slug} ← [[${source_slug}]]`);
    skipped++;
    continue;
  }

  // 파일 끝에 연결 추가
  const line = `\n\n[[${source_slug}]] — *${source_slug} 노트 작성 중에 추가된 연결입니다.*`;
  await writeFile(targetPath, content.trimEnd() + line + '\n', 'utf-8');
  console.log(`✅ 연결 추가: ${target_slug} ← [[${source_slug}]]`);
  applied++;
}

// LINK_REQUESTS.json 삭제
await unlink(LINK_REQUESTS_FILE);
console.log(`\n✨ 완료: ${applied}개 추가, ${skipped}개 건너뜀. LINK_REQUESTS.json 삭제됨.`);
