---
name: plan-feature
description: PRD.md와 TRD.md를 읽고 기능 구현 태스크를 분해하는 스킬. planner 에이전트가 기능 분석 시 사용한다.
---

## 목적

사용자 요청을 Astro 프로젝트의 구체적인 구현 태스크로 분해한다.

## 분석 절차

1. `PRD.md`에서 요청 기능의 요구사항 확인
2. `TRD.md`에서 기술 제약 및 구현 방법 확인
3. 기존 코드 구조 파악 (Glob으로 `src/`, `content/` 탐색)
4. 태스크 목록 작성 및 TaskCreate로 등록
5. 팀 전체에 브리핑 (SendMessage all)

## 태스크 작성 기준

각 태스크에 포함할 정보:

- **담당:** `developer` 또는 `pipeline-engineer`
- **입력:** 필요한 데이터/파일
- **출력:** 생성할 파일 또는 기능
- **의존:** 선행 태스크 번호 (없으면 "없음")
- **완료 기준:** 검증 가능한 조건 (예: "빌드 성공 + 노트 페이지 `/notes/[slug]` 렌더링 확인")

## MVP 경계

TRD 섹션 5 기준 — 현재 제외 범위:
- 로그인, 서버, DB, 실시간 동기화
- Graph View, PWA (Phase 3 이후)
- AI API 연동, 노트 편집기 내장

## 기술 제약 체크리스트

설계 전 확인:

- [ ] 모든 처리가 빌드 타임에 수행 가능한가?
- [ ] 서버 없이 동작 가능한가?
- [ ] 초기 JS 150KB 이하 목표를 지킬 수 있는가?
- [ ] 모바일 우선 (375px~430px) 적용 가능한가?

## 프로젝트 초기화 태스크 (미초기화 시)

프로젝트가 초기화되지 않았다면 다음을 첫 번째 태스크로 추가:

1. `npm create astro@latest` 실행
2. `tailwindcss`, `@astrojs/tailwind` 설치
3. `astro-pagefind` 설치
4. TRD 디렉토리 구조 생성 (`src/components/`, `src/layouts/`, `src/pages/`, `src/utils/`, `content/notes/`)
5. `src/content/config.ts` 초기 설정
