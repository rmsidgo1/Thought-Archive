/**
 * 노트 인덱스 생성 스크립트
 * LLM이 기존 노트를 인식하고 [[slug]] 연결을 만들 수 있도록
 * 현재 notes/ 디렉토리의 모든 노트를 NOTE_INDEX.md로 요약합니다.
 *
 * 사용: node scripts/generate-note-index.mjs
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, basename } from 'path';

const NOTES_DIR = './src/content/notes';
const OUTPUT   = './NOTE_INDEX.md';

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { title: '', type: '', tags: [] };

  const block = match[1];

  const titleMatch = block.match(/^title:\s*(.+)/m);
  const typeMatch  = block.match(/^type:\s*(.+)/m);
  const tagsMatch  = block.match(/tags:\s*\n((?:[ \t]*-[^\n]*\n?)*)/);

  const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, '') : '';
  const type  = typeMatch  ? typeMatch[1].trim().replace(/^["']|["']$/g, '') : '';
  const tags  = tagsMatch
    ? tagsMatch[1]
        .split('\n')
        .map(l => l.replace(/^\s*-\s*/, '').trim())
        .filter(Boolean)
    : [];

  return { title, type, tags };
}

// 첫 번째 비어있지 않은 본문 줄 (frontmatter 제외)
function firstBodyLine(content) {
  const body = content.replace(/^---[\s\S]*?---\r?\n/, '').trim();
  const line = body.split('\n').find(l => l.trim() && !l.startsWith('#'));
  return line ? line.trim().slice(0, 80) : '';
}

const files = (await readdir(NOTES_DIR)).filter(f => f.endsWith('.md'));

const notes = await Promise.all(
  files.map(async file => {
    const content = await readFile(join(NOTES_DIR, file), 'utf-8');
    const slug = basename(file, '.md');
    const { title, type, tags } = parseFrontmatter(content);
    const summary = firstBodyLine(content);
    return { slug, title: title || slug, type, tags, summary };
  })
);

notes.sort((a, b) => a.slug.localeCompare(b.slug));

// 태그 사용 빈도 집계
const tagCounts = new Map();
for (const note of notes) {
  for (const tag of note.tags) {
    tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
}

const tagList = [...tagCounts.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([tag, count]) => `${tag}(${count})`)
  .join(' · ');

const date = new Date().toISOString().slice(0, 10);

const rows = notes.map(n =>
  `| \`${n.slug}\` | ${n.title} | ${n.type || '-'} | ${n.tags.map(t => `#${t}`).join(' ')} |`
);

const summaryBlock = notes
  .map(n => `- **${n.slug}**: ${n.title}${n.summary ? ` — ${n.summary}` : ''}`)
  .join('\n');

const output = `\
# 노트 인덱스

> 마지막 업데이트: ${date} / 총 ${notes.length}개
>
> **LLM 노트 작성 요청 시 이 파일을 README.md와 함께 전달하세요.**
> 기존 노트와 관련된 내용은 \`[[slug]]\` 문법으로 반드시 연결해야 합니다.
> 태그는 아래 목록에서 우선 재사용하세요.

## 기존 태그 (우선 재사용)

> 새 태그를 만들기 전에 아래 태그를 먼저 확인하세요. 의미가 겹치면 기존 태그를 사용합니다.

${tagList || '(태그 없음)'}

## 노트 목록

| slug | 제목 | 타입 | 태그 |
|------|------|------|------|
${rows.join('\n')}

## 노트 요약

${summaryBlock}

---

## LLM 요청 시 사용하는 프롬프트

\`\`\`
[대화 기록 또는 경험 붙여넣기]

---

위 내용을 바탕으로 노트를 작성해줘.
README.md의 시스템 프롬프트 규칙을 따르고,
NOTE_INDEX.md의 기존 노트 목록을 참고해서 관련된 노트를 반드시 [[slug]]로 연결해줘.
연결할 노트가 없으면 연결하지 않아도 돼.
\`\`\`
`;

await writeFile(OUTPUT, output, 'utf-8');
console.log(`✅ NOTE_INDEX.md 생성 완료 (${notes.length}개 노트, ${tagCounts.size}개 태그 → ${OUTPUT})`);
