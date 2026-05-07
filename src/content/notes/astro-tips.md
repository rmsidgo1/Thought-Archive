---
title: Astro 팁
tags:
  - astro
  - 개발
created: 2026-05-07
updated: 2026-05-07
---

이 아카이브([[welcome]])는 Astro 기반으로 구축되어 있다.

## Content Collections

`src/content/config.ts`에서 스키마를 정의하고, `getCollection()`으로 노트를 가져온다.

```typescript
import { getCollection } from 'astro:content';
const notes = await getCollection('notes');
```

## 정적 경로 생성

```astro
export async function getStaticPaths() {
  const notes = await getCollection('notes');
  return notes.map(note => ({
    params: { slug: note.slug },
    props: { note }
  }));
}
```

## 장점

- 기본적으로 JS 없음 (Zero JS by default)
- Vite 기반의 빠른 빌드
- `client:load`, `client:idle` 등 선택적 hydration
- Markdown + TypeScript + TailwindCSS 궁합이 좋다

## 관련 주제

[[llm-agents]] — 이 사이트 구축에 사용된 AI 에이전트
