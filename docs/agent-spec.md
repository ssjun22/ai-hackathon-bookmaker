# AI 에이전트 명세 — ai-hackathon-bookmaker

> 작성일: 2026-05-14  
> 버전: 1.0  
> 이 문서는 챗봇 에이전트와 이미지 에이전트의 역할/목표, 모델, 입출력 스키마, 가드레일, 비용 가드, 종료 조건을 정의한다.  
> **퀴즈 에이전트는 이번 범위 외 (후속 작업).**

---

## 목차

1. [공통 컨텍스트](#1-공통-컨텍스트)
2. [챗봇 에이전트](#2-챗봇-에이전트)
3. [이미지 에이전트](#3-이미지-에이전트)
   - [3-1. sub-step 1: 캐릭터 reference 이미지 생성](#3-1-sub-step-1-캐릭터-reference-이미지-생성)
   - [3-2. sub-step 2: 장면 이미지 생성](#3-2-sub-step-2-장면-이미지-생성)
4. [데이터 인계 형식](#4-데이터-인계-형식)
5. [비용 가드 종합](#5-비용-가드-종합)
6. [TODO / 후속 작업](#6-todo--후속-작업)

---

## 1. 공통 컨텍스트

### 1-1. 명세 작성 배경

기존 Claude 기반 구현을 **Gemini / Imagen 으로 전환**한다.  
이유: Vercel AI Gateway를 통한 비용 최적화 + 해커톤 2일 예산 $15 내 운영.

### 1-2. API 경로 (Vercel AI Gateway)

모든 AI 호출은 **Vercel AI Gateway**를 경유한다.

- Vercel AI SDK 사용 시 모델 ID 문자열: `'google/<model-id>'`
- OpenAI 호환 엔드포인트를 직접 호출하는 경우에도 동일 Gateway 경유
- 예시:
  ```ts
  import { createOpenAI } from '@ai-sdk/openai';
  const gateway = createOpenAI({ baseURL: process.env.AI_GATEWAY_URL });
  const result = await generateText({
    model: gateway('google/gemini-3.1-flash-lite-preview'),
    ...
  });
  ```

### 1-3. 환경 변수

| 변수명 | 설명 |
|---|---|
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway 인증 키 (로컬 개발용) |
| `AI_GATEWAY_URL` | Vercel AI Gateway 엔드포인트 URL |

> Vercel 배포 환경에서는 OIDC 자동 인증으로 `AI_GATEWAY_API_KEY` 없이도 동작 가능.  
> `.env.example`에 두 변수를 추가해야 한다 (후속 작업).

### 1-4. 명세 대상 에이전트 범위

| 에이전트 | 포함 여부 |
|---|---|
| 챗봇 에이전트 | ✅ 이번 명세 포함 |
| 이미지 에이전트 | ✅ 이번 명세 포함 |
| 퀴즈 에이전트 | ❌ 후속 작업 |

### 1-5. 총 예산 기준

- **$15 / 2일** (개발 + 데모 합산)
- 초과 시 서비스 중단 감수 (해커톤 단순화 결정)
- 에이전트별 세부 비용은 [5. 비용 가드 종합](#5-비용-가드-종합) 참조

---

## 2. 챗봇 에이전트

---

## 3. 이미지 에이전트

---

### 3-1. sub-step 1: 캐릭터 reference 이미지 생성

---

### 3-2. sub-step 2: 장면 이미지 생성

---

## 4. 데이터 인계 형식

---

## 5. 비용 가드 종합

---

## 6. TODO / 후속 작업

---
