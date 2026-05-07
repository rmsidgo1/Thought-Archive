# Technical Requirements Document
# Personal Thought Archive

---

# 1. 시스템 개요

정적 Markdown 기반 개인 지식 아카이브 웹앱.

모든 페이지는 빌드 시 생성되며,
GitHub Pages에서 호스팅 가능해야 한다.

데이터 저장은 Git repository 기반으로 수행한다.

---

# 2. 기술 스택

## Core

- Astro
- TypeScript
- TailwindCSS

---

## Build & Deploy

- Vite
- GitHub Pages
- GitHub Actions

---

## Search

후보:
- Pagefind (우선)
- FlexSearch

권장:
Pagefind

이유:
- 정적 사이트 친화적
- 빠름
- 모바일 성능 우수

---

# 3. 디렉토리 구조

```txt
src/
  components/
  layouts/
  pages/
  styles/
  utils/

content/
  notes/

public/

scripts/
```

---

# 4. 콘텐츠 구조

## Note File

위치:

content/notes/*.md

예시:

```md
---
title: LLM Agents
tags:
  - ai
  - agents
created: 2026-05-07
updated: 2026-05-07
---

# LLM Agents

내용...
```

---

# 5. 데이터 파이프라인

## 빌드 단계

- Markdown 로드
- frontmatter 파싱
- wiki-link 파싱
- backlink 생성
- 태그 인덱싱
- 검색 인덱스 생성
- 정적 페이지 생성

---

# 6. Wiki Link 시스템

## 입력 형식

```
[[note-slug]]
```

## 처리 방식

빌드 시:

- regex 기반 파싱
- note 존재 확인
- 내부 링크 변환

예:

```html
<a href="/notes/note-slug">
```

## Backlink 생성

모든 노트에 대해:

Map<string, string[]>

구조 생성.

---

# 7. 라우팅 구조

## Routes

- `/` — 홈
- `/notes/[slug]` — 노트 페이지
- `/tags/[tag]` — 태그 페이지
- `/search` — 검색 페이지

---

# 8. 검색 시스템

## 목표

- 클라이언트 측 검색
- 빠른 응답
- 모바일 친화적

## 구현

Pagefind 사용.

생성:

- 빌드 시 인덱싱
- static asset 출력

검색:

- 클라이언트 JS 기반

---

# 9. 스타일 시스템

## 디자인 원칙

- 모바일 우선
- 최소주의
- 가독성 중심

## Typography

추천:

- Pretendard
- Inter

## 색상

### Light

- warm gray 기반

### Dark

- low contrast dark

---

# 10. 반응형 기준

## Mobile First

Primary target:

- iPhone mini ~ Pro Max
- Android standard widths

## Breakpoints

- sm: 640px
- md: 768px
- lg: 1024px

---

# 11. 성능 목표

## Lighthouse

목표:

- Performance ≥ 90
- Accessibility ≥ 90
- Best Practices ≥ 90

## 페이지 크기

초기 JS:

- 최대 150KB 목표

---

# 12. 접근성

## 필수

- semantic HTML
- keyboard navigation
- focus visible
- dark mode contrast

---

# 13. SEO

## 기본 대응

- sitemap 생성
- meta tags
- Open Graph
- canonical URL

---

# 14. GitHub Pages 배포

## 방식

GitHub Actions 사용.

push to main 시:

- install
- build
- deploy

자동 수행.

---

# 15. 상태 관리

## 원칙

전역 상태 최소화.

### 사용 가능

- local state
- URL state

### 금지

- 복잡한 client store
- server dependency

---

# 16. 유틸 기능

## Reading Time

본문 기준 계산 가능.

## Random Note

빌드 시 note list 생성 후
클라이언트 랜덤 선택.

---

# 17. 에러 처리

## 존재하지 않는 링크

빌드 시:

- warning 출력

런타임:

- broken link UI 표시 가능

---

# 18. 보안

## 원칙

- 사용자 입력 없음
- 서버 없음

따라서 공격면 최소화.

---

# 19. 향후 확장 고려

## Graph View

후보:

- Cytoscape.js
- D3.js

## PWA

가능성 고려.

## 옵시디언 호환

향후:

- vault import
- attachment support

---

# 20. 개발 우선순위

## Phase 1

- Markdown 렌더링
- 노트 페이지
- 태그
- 링크 파싱

## Phase 2

- 검색
- backlink
- related notes

## Phase 3

- graph view
- animations
- PWA

---

# 21. 권장 개발 방식

Claude Code 활용 권장.

단계별 구현:

- content collection 구성
- note route 생성
- wiki-link parser 구현
- backlink 생성
- search 통합
- mobile polish
