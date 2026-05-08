---
title: LLM 에이전트
tags:
  - ai
  - agents
created: 2026-05-07
updated: 2026-05-07
---

LLM(대형 언어 모델) 기반 에이전트는 도구(tools)와 메모리를 활용하여 복잡한 작업을 자율적으로 수행한다.

## 핵심 구성 요소

- **LLM**: 추론과 계획 담당
- **Tools**: 외부 시스템과 상호작용 (검색, 코드 실행 등)
- **Memory**: 단기(컨텍스트) + 장기(벡터 DB 등)

## 에이전트 패턴

### ReAct

Reason → Act → Observe 사이클을 반복하여 목표를 달성한다.

### 멀티 에이전트

여러 에이전트가 협업하여 복잡한 작업을 분업 처리한다. 이 아카이브([[welcome]])도 Claude Code 에이전트 팀으로 구축되었다.

## 왜 중요한가

단순한 Q&A를 넘어서, LLM이 실제 도구를 사용해 목표를 달성하는 패러다임 전환이다.

## 자동 연결

[[llm-knowledge-automation]] — *llm-knowledge-automation 노트 작성 중에 추가된 연결입니다.*
