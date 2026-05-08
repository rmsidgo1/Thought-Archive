/**
 * 노트 참조 현황 확인 스크립트
 * 특정 slug를 참조하는 노트 목록을 출력합니다.
 * 노트 삭제 전에 영향 범위를 파악할 때 사용하세요.
 *
 * 사용법:
 *   npm run check-links <slug>
 *   node scripts/check-links.mjs <slug>
 */

import { readdir, readFile } from 'fs/promises';
import { join, basename } from 'path';

const NOTES_DIR = './src/content/notes';
const slug = process.argv[2];

if (!slug) {
  console.log('사용법: npm run check-links <slug>');
  console.log('예시:   npm run check-links llm-agents');
  process.exit(0);
}

const files = (await readdir(NOTES_DIR)).filter(f => f.endsWith('.md'));

// slug 노트 존재 여부 확인
const targetExists = files.includes(`${slug}.md`);

// 모든 노트에서 [[slug]] 참조 검색
const pattern = new RegExp(`\\[\\[${slug}\\]\\]`, 'g');
const refs = [];

for (const file of files) {
  const noteSlug = basename(file, '.md');
  if (noteSlug === slug) continue; // 자기 자신 제외

  const content = await readFile(join(NOTES_DIR, file), 'utf-8');
  const matches = content.match(pattern);
  if (matches) {
    refs.push({ file, count: matches.length });
  }
}

// 출력
console.log(`\n🔍 '${slug}' 참조 현황\n`);
console.log(targetExists
  ? `✅ 노트 존재: src/content/notes/${slug}.md`
  : `❌ 노트 없음: '${slug}.md' 파일이 존재하지 않습니다 (이미 삭제됐거나 오타)`
);

if (refs.length === 0) {
  console.log('\n이 노트를 참조하는 다른 노트가 없습니다.');
  if (targetExists) console.log('안전하게 삭제할 수 있습니다.');
} else {
  const total = refs.reduce((s, r) => s + r.count, 0);
  console.log(`\n이 노트를 참조하는 노트 (${refs.length}개, 총 ${total}곳):\n`);
  refs.forEach(({ file, count }) => {
    console.log(`  📄 ${file}  (${count}곳)`);
  });

  if (targetExists) {
    console.log(`\n⚠️  이 노트를 삭제하면 위 ${refs.length}개 노트에 깨진 링크가 생깁니다.`);
    console.log('   삭제 전에 해당 노트에서 [[' + slug + ']] 참조를 제거하거나 수정하세요.');
  }
}

console.log();
