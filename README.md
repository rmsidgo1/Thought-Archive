# Thought Archive

개인 메모를 연결된 지식 네트워크로 탐색하는 정적 웹 아카이브.  
Astro + TailwindCSS + Pagefind 기반. GitHub Pages 배포.

🌐 **라이브**: https://rmsidgo1.github.io/Thought-Archive/

---

## LLM 에이전트를 위한 노트 작성 가이드

> 이 섹션은 LLM 에이전트가 노트를 자동으로 생성할 때 참고하는 규칙서입니다.  
> 아래 규칙을 정확히 따르면 빌드 오류 없이 노트가 사이트에 반영됩니다.

---

### 1. 파일 위치

모든 노트는 반드시 이 경로에 생성합니다:

```
src/content/notes/{slug}.md
```

다른 경로에 파일을 넣으면 사이트에 반영되지 않습니다.

---

### 2. 파일명(slug) 규칙

| 규칙 | 예시 |
|------|------|
| 영문 소문자만 사용 | ✅ `llm-agents.md` |
| 단어 구분은 하이픈(`-`) | ✅ `second-brain.md` |
| 숫자 사용 가능 | ✅ `gpt-4-tips.md` |
| 공백, 한글, 특수문자 금지 | ❌ `LLM 에이전트.md` |
| `.md` 확장자 필수 | ✅ `my-note.md` |

slug = 파일명에서 `.md`를 제거한 값입니다.  
예: `second-brain.md` → slug는 `second-brain`

---

### 3. Frontmatter 스키마

파일 최상단에 반드시 다음 형식으로 작성합니다.

```yaml
---
title: 노트 제목         # 필수. 사이트에 표시되는 제목.
tags:                    # 필수. 빈 배열([])도 허용.
  - 태그1
  - 태그2
created: 2026-05-07      # 선택. YYYY-MM-DD 형식.
updated: 2026-05-07      # 선택. YYYY-MM-DD 형식.
---
```

**규칙:**
- `title`: 한글 가능. 따옴표 없이 작성.
- `tags`: 한글 가능. 소문자 영문도 가능. 공백 포함 태그는 따옴표로 감싸기.
- `created` / `updated`: 날짜는 반드시 따옴표 없이 `YYYY-MM-DD` 형식으로 작성. (따옴표 있어도 동작하지만 없어도 됨)

---

### 4. 본문 작성 규칙

Frontmatter 아래부터 일반 Markdown으로 작성합니다.

```markdown
---
title: 예시 노트
tags:
  - 예시
created: 2026-05-07
---

여기서부터 본문입니다. **볼드**, *이탤릭*, `인라인 코드` 모두 사용 가능합니다.

## 소제목

단락을 구분할 때는 빈 줄을 사용합니다.

- 목록 항목 1
- 목록 항목 2

코드 블록도 사용 가능합니다:

\`\`\`typescript
const greeting = "hello";
\`\`\`
```

---

### 5. Wiki-Link (노트 간 연결)

다른 노트를 링크할 때는 `[[slug]]` 문법을 사용합니다.

```markdown
[[llm-agents]]          → llm-agents.md 노트로 연결되는 링크
[[second-brain]]        → second-brain.md 노트로 연결
```

**규칙:**
- `[[` 와 `]]` 사이에 slug(파일명에서 .md 제거)를 넣습니다.
- 존재하지 않는 slug를 링크해도 빌드는 성공하지만, 사이트에서 취소선으로 표시됩니다.
- 코드 블록(``` ``` ```) 안의 `[[...]]`는 링크로 변환되지 않습니다.
- wiki-link는 본문 어디에나 사용 가능합니다.

---

### 6. 완성된 노트 예시

아래는 모든 규칙을 따른 실제 노트 예시입니다:

```markdown
---
title: 제텔카스텐 방법론
tags:
  - pkm
  - 생산성
created: 2026-05-07
updated: 2026-05-07
---

제텔카스텐(Zettelkasten)은 니클라스 루만이 고안한 카드 기반 지식 관리 시스템이다.

## 핵심 원칙

- 각 노트는 하나의 아이디어만 담는다
- 노트 간 링크로 지식 네트워크를 형성한다
- 시간이 지날수록 연결이 풍부해진다

## 이 아카이브와의 관계

이 아카이브([[welcome]])는 제텔카스텐의 디지털 구현체다.
[[llm-agents]]를 활용해 노트를 자동으로 추가할 수도 있다.
```

---

### 7. 체크리스트 (노트 생성 전 확인)

- [ ] 파일 경로가 `src/content/notes/` 인가?
- [ ] 파일명이 영문 소문자 + 하이픈만 사용하는가?
- [ ] `title` 필드가 있는가?
- [ ] `tags` 필드가 있는가? (빈 배열도 가능: `tags: []`)
- [ ] Frontmatter가 `---`로 열고 `---`로 닫혀 있는가?
- [ ] Wiki-link의 slug가 실제 존재하는 파일명과 일치하는가?

---

## 프로젝트 구조 (참고)

```
src/
  content/
    notes/          ← 노트 파일 위치 (*.md)
    config.ts       ← 스키마 정의
  components/       ← UI 컴포넌트
  layouts/          ← 페이지 레이아웃
  pages/            ← 라우트
  utils/            ← 유틸리티 (wiki-link 파서, backlink 등)
```

---

## 로컬 개발

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:4321)
npm run build    # 프로덕션 빌드 + Pagefind 검색 인덱싱
npm run preview  # 빌드 결과 미리보기
```

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드 및 배포합니다.
