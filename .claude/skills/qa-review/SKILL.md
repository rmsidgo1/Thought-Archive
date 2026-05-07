---
name: qa-review
description: 코드 품질·성능·접근성·모바일 UX·경계면 타입 정합성을 검증하는 스킬. qa-reviewer 에이전트가 사용한다.
---

## 검증 기준 (TRD 기반)

- Lighthouse Performance ≥ 90
- Lighthouse Accessibility ≥ 90
- 초기 JS ≤ 150KB
- 모바일 375px~430px 정상 동작

## 검증 체크리스트

### 빌드 & 타입

- [ ] `npx tsc --noEmit` 오류 없음
- [ ] `npx astro build` 성공
- [ ] Note 타입이 content collection 스키마와 일치

### 기능 동작

- [ ] wiki-link `[[slug]]` → `<a href="/notes/slug">` 변환 정상
- [ ] 존재하지 않는 wiki-link → `.wiki-link-broken` 스타일 적용
- [ ] backlink 목록이 실제 링크 관계와 일치
- [ ] 태그 페이지에 해당 태그 노트만 표시
- [ ] Pagefind 검색 동작 (`/pagefind/pagefind.js` 존재 확인)
- [ ] 랜덤 노트 버튼 동작

### UI/UX

- [ ] 다크모드 토글 동작 (light ↔ dark)
- [ ] 모바일 레이아웃 (375px 기준 레이아웃 깨짐 없음)
- [ ] keyboard navigation (Tab 키로 모든 링크·버튼 접근 가능)
- [ ] `focus-visible` 스타일 표시

### SEO & 접근성

- [ ] `<title>`, `<meta name="description">` 존재
- [ ] Open Graph 태그 (`og:title`, `og:description`) 존재
- [ ] semantic HTML (`<nav>`, `<main>`, `<article>` 사용)
- [ ] 이미지 `alt` 텍스트

## 경계면 교차 비교 (핵심)

두 에이전트의 산출물이 맞닿는 지점을 집중 검증한다:

**1. Note 타입 vs 컴포넌트 props**
- `src/utils/types.ts`의 `Note` 타입을 읽는다
- `src/pages/notes/[slug].astro`의 props 타입을 읽는다
- `Note.links`, `Note.backlinks`가 컴포넌트에서 올바르게 소비되는지 확인

**2. wiki-link 파서 출력 vs Astro 렌더링**
- `renderWikiLinks()` 반환값이 `set:html`로 렌더링되는지 확인
- XSS 위험 없이 안전하게 처리되는지 확인

**3. Pagefind 인덱스 경로 vs 검색 페이지 JS**
- 빌드 후 `/pagefind/pagefind.js`가 실제로 존재하는지 확인
- 검색 페이지의 import 경로가 일치하는지 확인

## 피드백 전달 형식

담당 에이전트에게 SendMessage로 전달:

```
[QA 피드백] {agent-name}에게
위치: {파일 경로}:{줄 번호}
문제: {구체적 문제}
원인: {왜 문제인지}
수정 방향: {어떻게 수정할지}
```

## 최종 보고서 형식

`_workspace/qa-report.md`:

```markdown
# QA 보고서

## 검증 결과
- 통과: {N}개
- 실패: {N}개
- 미해결 이슈: {N}개

## 통과 항목
...

## 미해결 이슈
...

## 권장 사항
...
```
