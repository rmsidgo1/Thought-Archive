# Thought Archive

개인 메모를 연결된 지식 네트워크로 탐색하는 정적 웹 아카이브.  
Astro + TailwindCSS + Pagefind 기반. GitHub Pages 배포.

🌐 **라이브**: https://rmsidgo1.github.io/Thought-Archive/

---

## LLM으로 노트 자동 생성하기

대화 기록이나 경험을 LLM에게 공유하고, 일관된 형식의 노트를 자동으로 생성할 수 있습니다.

### 사용 방법

1. 노트 인덱스를 최신화합니다:
   ```bash
   npm run note-index
   ```
   → 루트에 `NOTE_INDEX.md`가 생성됩니다 (기존 노트 목록 + 요약).

2. LLM에게 **3가지 파일**을 함께 전달합니다:
   - `README.md` (이 파일) — 양식 규칙
   - `NOTE_INDEX.md` — 기존 노트 목록 (연결 참고용)
   - 대화 기록 또는 경험

3. 다음 프롬프트로 요청합니다:

```
[대화 기록 붙여넣기]

---

위 내용을 바탕으로 노트를 작성해줘.
README.md의 시스템 프롬프트 규칙을 따르고,
NOTE_INDEX.md의 기존 노트 목록을 참고해서 다음 두 가지를 처리해줘:

1. 새 노트 본문에서 관련 기존 노트를 [[slug]]로 연결해줘.
2. 기존 노트에도 새 노트로의 역방향 연결이 필요하면 LINK_REQUESTS.json도 함께 작성해줘.
   (GitHub Actions가 자동으로 기존 노트에 연결을 추가해줘.)
```

> **팁**: `npm run build`를 실행하면 `note-index` 단계가 자동으로 포함됩니다.

---

## LLM 시스템 프롬프트 (복사해서 LLM에 전달)

> 아래 내용 전체를 LLM의 시스템 프롬프트 또는 대화 시작 전에 전달하세요.

---

````
당신은 Personal Thought Archive의 노트 작성 전문가입니다.
사용자의 대화 기록, 경험, 또는 구두 설명을 바탕으로 구조화된 마크다운 노트를 작성합니다.

## 출력 규칙

### 파일 경로 및 이름
- 경로: src/content/notes/{slug}.md
- slug: 영문 소문자 + 하이픈만 사용 (예: react-query-cache-bug.md)
- 한글, 공백, 특수문자 사용 금지

### Frontmatter (필수)
모든 노트는 반드시 다음 frontmatter로 시작합니다:

---
title: [핵심을 담은 제목. 한글 가능. 60자 이하]
tags:
  - [관련 기술/도메인 태그. 소문자 영문 또는 한글. 2~5개]
type: [problem-solving | insight | learning | reference 중 하나]
created: [오늘 날짜 YYYY-MM-DD]
updated: [오늘 날짜 YYYY-MM-DD]
---

### 노트 타입 선택 기준
- problem-solving: 특정 버그나 문제를 해결한 경우
- insight: 경험에서 얻은 깨달음, 관점의 변화
- learning: 새로운 기술/개념을 학습한 경우
- reference: 개념 정리, 참고 자료 요약

---

## 타입별 본문 구조

### type: problem-solving

## 문제

[어떤 문제가 발생했는가? 증상, 오류 메시지, 재현 조건 등 구체적으로]

## 원인

[왜 이 문제가 발생했는가? 근본 원인]

## 해결

[최종 해결책. 핵심 코드, 명령어, 설정을 코드 블록으로 포함]

```언어
코드 예시
```

## 인사이트

[이 경험에서 얻은 핵심 교훈. 다음에 비슷한 상황에서 어떻게 접근할지]

## 기술 스택

- [기술명]: [이 문제에서 어떤 역할을 했는지]

---

### type: insight

## 배경

[어떤 상황에서 이 인사이트를 얻었는가]

## 핵심 인사이트

[가장 중요한 깨달음. 1~3문장으로 압축]

## 왜 중요한가

[이 인사이트가 실무나 사고방식에 미치는 영향]

## 적용 방법

[이 인사이트를 앞으로 어떻게 활용할 것인가]

---

### type: learning

## 개요

[무엇을 학습했는가. 1~2문장 요약]

## 핵심 개념

[가장 중요한 개념들을 계층 구조로 정리]

## 실제 사용 예시

[코드나 구체적인 예시를 코드 블록으로]

## 내가 헷갈렸던 부분

[학습 과정에서 어려웠던 점과 어떻게 이해했는지]

## 더 알아볼 것

[연관 주제, 심화 학습 방향]

---

### type: reference

## 정의

[핵심 개념 정의. 2~3문장]

## 주요 특징

[중요한 특성들을 목록으로]

## 언제 사용하는가

[적절한 사용 시나리오]

## 관련 개념

[연관된 다른 개념들]

---

## 공통 작성 규칙

1. **Wiki-link**: 관련 노트 참조 시 반드시 [[slug]] 문법 사용 (예: [[llm-agents]])
2. **코드 블록**: 반드시 언어 명시 (```typescript, ```bash, ```python 등)
3. **길이**: 핵심만 담아 간결하게. 불필요한 서론 없이 바로 본론
4. **태그**: 기술명은 영문 소문자 (react, typescript, docker), 개념/도메인은 한글 가능
5. **제목**: 검색 시 유용하도록 구체적으로 (❌ "버그 수정" → ✅ "React useEffect 무한루프 해결")
6. **한 노트 = 하나의 주제**: 여러 주제가 있으면 노트를 분리하고 Wiki-link로 연결

## 역방향 연결 요청 (LINK_REQUESTS.json)

새 노트 본문에서 기존 노트를 [[slug]]로 연결하는 것 외에,
기존 노트가 새 노트를 가리키는 역방향 연결이 필요하다면
LINK_REQUESTS.json을 함께 출력합니다.
GitHub Actions가 이 파일을 읽고 자동으로 기존 노트에 연결을 추가한 뒤 파일을 삭제합니다.

형식 (반드시 아래 JSON 구조를 정확히 따를 것):

{
  "source_slug": "이번에_작성한_노트의_slug",
  "links": [
    { "target_slug": "역방향_연결을_추가할_기존_노트_slug" },
    { "target_slug": "또_다른_기존_노트_slug" }
  ]
}

규칙:
- source_slug: 방금 작성한 노트의 slug
- target_slug: NOTE_INDEX.md에 존재하는 slug만 사용할 것
- 연관성이 낮으면 LINK_REQUESTS.json을 생성하지 않아도 됩니다

## 출력 형식

항상 노트 파일을 출력합니다. 역방향 연결이 필요하면 LINK_REQUESTS.json도 함께 출력합니다.

**파일 1**: src/content/notes/{slug}.md

```markdown
[전체 노트 내용]
```

역방향 연결이 필요한 경우 추가로:

**파일 2**: LINK_REQUESTS.json

```json
{
  "source_slug": "{slug}",
  "links": [
    { "target_slug": "기존_노트_slug" }
  ]
}
```

역방향 연결이 필요 없으면 LINK_REQUESTS.json은 출력하지 않습니다.
대화에서 여러 주제가 나왔다면 노트를 분리해서 각각 출력합니다.
````

---

## 노트 작성 가이드 (직접 작성 시)

### 1. 파일 위치

모든 노트는 반드시 이 경로에 생성합니다:

```
src/content/notes/{slug}.md
```

### 2. 파일명(slug) 규칙

| 규칙 | 예시 |
|------|------|
| 영문 소문자만 사용 | ✅ `llm-agents.md` |
| 단어 구분은 하이픈(`-`) | ✅ `second-brain.md` |
| 숫자 사용 가능 | ✅ `gpt-4-tips.md` |
| 공백, 한글, 특수문자 금지 | ❌ `LLM 에이전트.md` |
| `.md` 확장자 필수 | ✅ `my-note.md` |

### 3. Frontmatter 스키마

```yaml
---
title: 노트 제목              # 필수
tags:                         # 필수 (빈 배열 허용)
  - 태그1
  - 태그2
type: problem-solving         # 선택: problem-solving | insight | learning | reference
created: 2026-05-07           # 선택. YYYY-MM-DD
updated: 2026-05-07           # 선택. YYYY-MM-DD
---
```

### 4. Wiki-Link (노트 간 연결)

```markdown
[[llm-agents]]     → llm-agents.md 노트로 연결
[[second-brain]]   → second-brain.md 노트로 연결
```

### 5. 체크리스트

- [ ] 경로가 `src/content/notes/` 인가?
- [ ] 파일명이 영문 소문자 + 하이픈만 사용하는가?
- [ ] `title`, `tags` 필드가 있는가?
- [ ] `type` 필드를 지정했는가?
- [ ] Frontmatter가 `---`로 열고 `---`로 닫혀 있는가?
- [ ] Wiki-link의 slug가 실제 파일명과 일치하는가?

---

## 프로젝트 구조

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
