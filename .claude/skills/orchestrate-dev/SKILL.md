---
name: orchestrate-dev
description: Personal Thought Archive(Astro 정적 사이트) 개발 작업을 4명의 에이전트 팀이 협력하여 수행하는 메인 오케스트레이터. "~만들어줘", "~구현해줘", "~추가해줘", "~수정해줘", "~개선해줘", "버그 고쳐줘", "재실행", "업데이트", "다시 해줘", "이전 결과 기반으로 수정" 등 이 프로젝트의 모든 개발 작업 요청 시 반드시 이 스킬을 사용할 것. "어떻게 하면 돼?", "뭐가 좋아?" 같은 단순 질문은 직접 응답 가능.
---

## 팀 구성

| 에이전트 | 역할 | 스킬 |
|---------|------|------|
| planner | PRD/TRD 기반 태스크 분해 | plan-feature |
| developer | Astro 컴포넌트·페이지·스타일 구현 | implement-astro |
| pipeline-engineer | 콘텐츠 파이프라인·검색·wiki-link 구현 | build-content-pipeline |
| qa-reviewer | 코드 리뷰·성능·접근성·경계면 검증 | qa-review |

**실행 모드:** 에이전트 팀 (TeamCreate + TaskCreate + SendMessage)

---

## Phase 0: 컨텍스트 확인

시작 시 기존 작업 상태를 확인한다:

- `_workspace/` 존재 + 사용자가 부분 수정 요청 → 해당 에이전트만 재호출
- `_workspace/` 존재 + 새 기능 요청 → `_workspace/`를 `_workspace_prev/`로 이동 후 새 실행
- `_workspace/` 없음 → 초기 실행

프로젝트 초기화 상태도 확인한다 (`package.json`, `astro.config.mjs` 존재 여부).
초기화 전이라면 Phase 2에서 planner가 프로젝트 초기화 태스크를 포함하도록 지시한다.

---

## Phase 1: 팀 구성

에이전트 팀을 생성한다.

    TeamCreate("archive-dev-team", ["planner", "developer", "pipeline-engineer", "qa-reviewer"])

---

## Phase 2: 기능 분석 (planner)

planner에게 분석을 요청한다 (SendMessage).

planner에게 전달할 정보:
- 사용자 요청 내용
- `PRD.md`, `TRD.md` 경로
- Phase 0에서 확인한 기존 코드 상태 (초기화 여부, 기존 파일 목록)

planner가 TaskCreate로 태스크를 등록하고 팀 전체에 브리핑을 마칠 때까지 대기한다.

---

## Phase 3: 구현 (developer + pipeline-engineer 병렬)

planner 브리핑 완료 후 두 에이전트가 병렬로 작업을 수행한다.

**협업 순서:**
1. pipeline-engineer가 Note 타입 정의를 먼저 작성하고 developer에게 공유
2. developer와 pipeline-engineer가 각자의 태스크를 병렬로 구현
3. 인터페이스 협의는 SendMessage로 실시간 소통

**파일 저장 규칙:**
- 중간 산출물: `_workspace/{phase}_{agent}_{artifact}.{ext}`
- 최종 코드: TRD 디렉토리 구조(`src/`, `content/`)에 저장

---

## Phase 4: QA (qa-reviewer, 점진적)

developer 또는 pipeline-engineer 각각의 완료 알림이 오면 즉시 검증 시작.
모든 구현 완료 후 최종 검증 리포트를 `_workspace/qa-report.md`에 작성.

**경계면 교차 비교 필수:**
- pipeline-engineer의 Note 타입 ↔ developer의 컴포넌트 props
- wiki-link 파서 출력 ↔ Astro `set:html` 렌더링
- Pagefind 인덱스 경로 ↔ 검색 페이지 JS

---

## Phase 5: 완료 보고

qa-reviewer의 최종 리포트를 기반으로 사용자에게 보고:
- 구현된 기능 목록
- QA 결과 요약
- 미해결 이슈 또는 알려진 제한사항

---

## 에러 핸들링

- 구현 실패: 1회 재시도, 재실패 시 해당 기능 제외하고 진행 (보고서에 명시)
- 타입 불일치: qa-reviewer → 해당 에이전트 즉시 피드백
- 빌드 오류: pipeline-engineer와 developer가 협의하여 수정

---

## 테스트 시나리오

**정상 흐름:**
"홈 페이지 만들어줘" → planner 태스크 분해 → developer가 `index.astro` 구현 → qa-reviewer 검증

**에러 흐름:**
wiki-link 파서 타입 오류 → qa-reviewer가 pipeline-engineer에게 피드백 → 수정 후 재검증
