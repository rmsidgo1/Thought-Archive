---
name: implement-astro
description: Astro 컴포넌트, 레이아웃, 페이지를 구현하는 스킬. developer 에이전트가 프론트엔드 구현 시 사용한다.
---

## 프로젝트 구조

```
src/
  components/   재사용 컴포넌트 (.astro)
  layouts/      페이지 레이아웃
  pages/        라우트 페이지
  styles/       전역 스타일
  utils/        유틸리티 함수
content/
  notes/        Markdown 노트 파일 (*.md)
```

## 라우팅 구조

| 경로 | 파일 |
|------|------|
| `/` | `src/pages/index.astro` |
| `/notes/[slug]` | `src/pages/notes/[slug].astro` |
| `/tags/[tag]` | `src/pages/tags/[tag].astro` |
| `/search` | `src/pages/search.astro` |

## TailwindCSS 원칙

- **모바일 우선**: 기본 스타일은 모바일, `sm:` → `md:` → `lg:` 순서로 확장
- **브레이크포인트**: sm:640px, md:768px, lg:1024px
- **Light 모드**: warm gray 계열 (`gray-50`, `gray-100`, `gray-800`)
- **Dark 모드**: low-contrast dark (`gray-900`, `gray-800`, `gray-200`)
- **타이포그래피**: Pretendard 또는 Inter 권장

## 다크모드 설정

`tailwind.config.mjs`:

```js
export default {
  darkMode: 'class',
  // ...
}
```

`<html>` 태그에 `dark` 클래스 토글로 제어. localStorage에 사용자 설정 저장.

## 컴포넌트 작성 패턴

Astro 컴포넌트의 frontmatter(`---` 블록)에서 빌드 타임 데이터 페칭:

```astro
---
import { getCollection } from 'astro:content';
const notes = await getCollection('notes');
---
```

클라이언트 JS는 인터랙티브 기능(검색, 다크모드 토글, 랜덤 노트)에만 허용.
`client:load`, `client:idle` 디렉티브 최소 사용.

## 상태 관리 원칙

- 전역 state 금지 (복잡한 store 사용 불가)
- 허용: `localStorage` (다크모드), URL params (검색어), component-level state

## 접근성 체크리스트

- semantic HTML: `<nav>`, `<main>`, `<article>`, `<aside>` 사용
- keyboard navigation: 모든 인터랙티브 요소가 Tab 키로 접근 가능
- `focus-visible` 스타일 반드시 포함
- 충분한 color contrast (특히 dark mode)

## wiki-link 렌더링

pipeline-engineer가 제공하는 파서 출력을 `set:html`로 렌더링:

```astro
<div set:html={renderedContent} />
```

broken link 스타일:

```css
.wiki-link-broken {
  text-decoration: line-through;
  color: theme('colors.gray.400');
}
```

## SEO 메타 태그

모든 페이지 레이아웃에 포함:

```astro
<title>{title} | Personal Thought Archive</title>
<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<link rel="canonical" href={canonicalURL} />
```
