---
name: build-content-pipeline
description: Markdown 파싱, wiki-link 처리, backlink 생성, Pagefind 검색 통합 등 콘텐츠 파이프라인을 구현하는 스킬. pipeline-engineer 에이전트가 사용한다.
---

## 빌드 타임 파이프라인 순서

1. Markdown 로드 (`content/notes/*.md`)
2. frontmatter 파싱 (title, tags, created, updated)
3. wiki-link 파싱 (`[[note-slug]]`)
4. backlink 생성
5. 태그 인덱싱
6. 검색 인덱스 생성 (Pagefind)
7. 정적 페이지 생성

## Content Collection 설정

`src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).default([]),
    created: z.string().optional(),
    updated: z.string().optional(),
  }),
});

export const collections = { notes };
```

## Note 타입 정의

`src/utils/types.ts` — **developer에게 먼저 공유할 것**:

```typescript
export type Note = {
  slug: string
  title: string
  content: string
  tags: string[]
  created?: string
  updated?: string
  links: string[]      // 이 노트에서 링크하는 슬러그 목록
  backlinks: string[]  // 이 노트를 링크하는 슬러그 목록
}
```

## Wiki-Link 파서

`src/utils/wiki-links.ts`:

```typescript
const WIKI_LINK_REGEX = /\[\[([^\]]+)\]\]/g;

export function parseWikiLinks(content: string): string[] {
  const links: string[] = [];
  let match;
  while ((match = WIKI_LINK_REGEX.exec(content)) !== null) {
    links.push(match[1]);
  }
  return links;
}

export function renderWikiLinks(
  content: string,
  existingSlugs: Set<string>
): string {
  return content.replace(WIKI_LINK_REGEX, (_, slug) => {
    if (existingSlugs.has(slug)) {
      return `<a href="/notes/${slug}" class="wiki-link">${slug}</a>`;
    }
    // 존재하지 않는 링크: 경고 출력 + broken 표시
    console.warn(`[broken-link] "${slug}" referenced but not found`);
    return `<span class="wiki-link-broken">${slug}</span>`;
  });
}
```

## Backlink 생성

`src/utils/backlinks.ts`:

```typescript
export function buildBacklinkMap(
  notes: Array<{ slug: string; links: string[] }>
): Map<string, string[]> {
  const backlinks = new Map<string, string[]>();

  for (const note of notes) {
    for (const linkedSlug of note.links) {
      const existing = backlinks.get(linkedSlug) ?? [];
      backlinks.set(linkedSlug, [...existing, note.slug]);
    }
  }

  return backlinks;
}
```

## Pagefind 통합

설치: `npm install astro-pagefind`

`astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import pagefind from 'astro-pagefind';

export default defineConfig({
  integrations: [tailwind(), pagefind()],
  output: 'static',
  build: { assets: '_astro' },
});
```

검색 페이지(`src/pages/search.astro`)에서 Pagefind 클라이언트 연결:

```astro
<script>
  const pagefind = await import('/pagefind/pagefind.js');
  await pagefind.init();
  // UI 연결 로직
</script>
```

## 태그 인덱싱

```typescript
export function buildTagIndex(
  notes: Array<{ slug: string; tags: string[] }>
): Map<string, string[]> {
  const tagIndex = new Map<string, string[]>();

  for (const note of notes) {
    for (const tag of note.tags) {
      const existing = tagIndex.get(tag) ?? [];
      tagIndex.set(tag, [...existing, note.slug]);
    }
  }

  return tagIndex;
}
```

## 에러 처리 원칙

- 존재하지 않는 wiki-link: `console.warn` 출력 후 broken 표시 (빌드 중단 없음)
- frontmatter 파싱 실패: 해당 노트를 제외하고 `console.error` 출력
- Pagefind 인덱싱 실패: 빌드 오류로 처리 (검색 없이는 릴리즈 불가)
