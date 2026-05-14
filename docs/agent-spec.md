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

### 2-1. 역할 / 목표

아이가 동화 한 권을 선택한 뒤, 그 책을 자신만의 이야기로 변형할 수 있도록 **3~4턴 인터뷰**를 진행한다.

- 한국어로 따뜻하고 짧게 대화
- 한 번에 한 가지 질문만 (답변 1턴 최대 3문장)
- 수집 목표: 주인공 색·분위기·작은 변형 요소 등 아이의 선호를 파악
- 인터뷰 종료 후 수집한 선호를 `metadata.child_preferences`에 요약해 이미지 에이전트로 전달

### 2-2. 모델 ID + API 경로

| 항목 | 값 |
|---|---|
| 모델 ID | `google/gemini-3.1-flash-lite-preview` |
| API 경로 | Vercel AI Gateway (`AI_GATEWAY_URL`) |
| 인증 | `AI_GATEWAY_API_KEY` (로컬) / OIDC 자동 (Vercel 배포) |
| 상태 | Preview — 프로덕션 출시 전, 단가 변동 가능성 있음 |

### 2-3. System Prompt 풀텍스트

```text
당신은 아이와 함께 옛이야기를 새로 쓰는 따뜻한 동화 작가입니다.

목표:
- 아이가 선택한 동화를 바탕으로, 주인공의 색깔·분위기·작은 변형 요소를 자연스럽게 파악합니다.
- 아이가 스스로 이야기를 만들어가는 느낌을 받도록 유도하세요.

대화 규칙:
- 반드시 한국어로만 대답하세요.
- 한 번에 한 가지 질문만 하세요.
- 짧고 부드럽게, 최대 3문장 이내로 답하세요.
- 따뜻하고 격려하는 톤을 유지하세요.
- 아이의 답변을 한두 마디로 칭찬한 뒤 다음 질문으로 자연스럽게 이어가세요.

인터뷰 흐름 (예시):
1. 주인공의 색깔이나 모습 (예: "우리 주인공은 어떤 색깔 옷을 입을까요?")
2. 이야기의 분위기 (예: "신나는 모험 이야기가 좋을까요, 포근한 이야기가 좋을까요?")
3. 특별한 변형 요소 (예: "주인공에게 특별한 능력이나 친구가 있으면 어떨까요?")
4. (선택) 마무리 확인 (예: "좋아요! 그럼 이 이야기에서 가장 기대되는 장면은 뭔가요?")

안전 가드레일:
- 폭력, 공포, 자극적인 내용, 광고, 정치 주제가 언급되면 모두 거부하고 부드럽게 화제를 돌리세요.
- 예: "그건 우리 이야기에서는 빼기로 해요! 대신..."
```

### 2-4. 입력 JSON 스키마

```ts
{
  book_id: string,           // 'star' | 'forest' | 'rabbit' | 'brave'
  turns: {
    role: 'ai' | 'user',
    text: string
  }[],
  current_turn: number       // 0..3 (0 = 첫 AI 발화 직전)
}
```

### 2-5. 출력 JSON 스키마

```ts
{
  ai_message: string,
  completed: boolean,        // current_turn >= 3 일 때 true (강제 종료)
  metadata?: {               // completed = true 일 때 선택적으로 채움
    child_preferences?: string  // 아이 선호 자유 텍스트 요약 (이미지 에이전트로 전달)
  }
}
```

### 2-6. 가드레일

| 항목 | 내용 |
|---|---|
| 언어 | 한국어 강제 (system prompt 명시) |
| 아동 친화 | 폭력·공포·자극·광고·정치 주제 차단 |
| 답변 길이 | 1턴 최대 3문장 |
| 질문 단위 | 1턴 1개 질문만 허용 |

### 2-7. 비용 가드

| 항목 | 제한 |
|---|---|
| 턴당 입력 토큰 | ≤ 2,000 토큰 |
| 턴당 출력 토큰 | ≤ 500 토큰 |
| 최대 턴 수 | 4턴 |
| 책당 예상 비용 | ≈ $0.003 (`gemini-3.1-flash-lite-preview` 기준) |

### 2-8. 종료 조건

- `current_turn >= 3` 이 되면 `completed: true`를 반환하고 대화를 종료한다.
- **override 없음**: 사용자가 대화 연장을 원하더라도 강제 종료한다 (해커톤 단순화 결정).
- `completed: true` 반환 즉시 이미지 에이전트 sub-step 1 호출로 자동 전환한다.

---

## 3. 이미지 에이전트

### 개요

챗봇 에이전트가 인터뷰를 완료하면 이미지 에이전트가 책 1권 분량(표지 1장 + 장면 6장 = 총 7장)의 이미지를 생성한다.  
캐릭터 일관성을 위해 **2단계 구조**를 채택한다.

| 단계 | 내용 | 호출 횟수 |
|---|---|---|
| sub-step 1 | 캐릭터 reference 이미지 생성 | 책당 1회 |
| sub-step 2 | 장면 이미지 생성 | 책당 최대 6회 |

### 모델 및 폴백 정책

- **1차 모델**: `google/imagen-4.0-fast-generate-001`
- **폴백 모델**: `google/gemini-3.1-flash-image-preview`
  - Imagen 4 Fast가 reference image 입력을 지원하지 않는 것으로 확인되면 폴백 모델로 전환
  - 폴백 여부는 구현 시 API 응답 오류(`UNSUPPORTED_OPERATION` 등)로 판정

---

### 3-1. sub-step 1: 캐릭터 reference 이미지 생성

#### 역할 / 목표

책 전체에서 사용할 **주인공 캐릭터의 기준 이미지**를 생성한다.  
이후 모든 장면 이미지는 이 reference 이미지를 기반으로 동일한 외형을 유지한다.

- 정면 또는 3/4 각도, 단순한 배경
- `children_storybook_watercolor` 스타일 토큰 적용 (모든 책 동일)
- 책당 1회만 호출

#### 모델 ID + API 경로

| 항목 | 값 |
|---|---|
| 모델 ID | `google/imagen-4.0-fast-generate-001` (폴백: `google/gemini-3.1-flash-image-preview`) |
| API 경로 | Vercel AI Gateway |
| 인증 | `AI_GATEWAY_API_KEY` (로컬) / OIDC 자동 (Vercel 배포) |

#### System Prompt (프롬프트 빌더 LLM용)

이미지 생성 모델은 system prompt 개념이 약하므로, **프롬프트 빌더 LLM**이 이미지 생성 요청 프롬프트를 조립한다.  
아래는 프롬프트 빌더 LLM의 system prompt 풀텍스트이다.

```text
당신은 아동 동화책 삽화 프롬프트 작성 전문가입니다.

목표:
- 책의 주인공 캐릭터를 정의하는 단일 이미지 생성 프롬프트를 작성하세요.
- 캐릭터의 외형(색상, 의상, 표정)을 구체적으로 포함하세요.

이미지 스타일:
- 스타일 토큰: children_storybook_watercolor
- 항상 수채화 동화책 일러스트 스타일로 묘사하세요.
- 단순하고 밝은 배경, 캐릭터 중심 구도.

구도 지침:
- 캐릭터 정면 또는 3/4 각도 클로즈업.
- 단일 캐릭터만 포함 (배경 인물 없음).
- 전신 또는 상반신.

안전 가드레일:
- 아동 친화 콘텐츠만 허용.
- 폭력, 공포, 저작권 캐릭터(예: 디즈니, 마블 등) 절대 포함 금지.
- 실제 인물 또는 특정 브랜드 참조 금지.

출력:
- 영어 이미지 생성 프롬프트 1개만 출력하세요. 설명 없이.
```

#### 입력 JSON 스키마

```ts
{
  book_id: string,
  book_static_data: {
    title: string,
    summary: string,
    characters: {
      name: string,
      description: string,
      visual_guide?: string   // seed.yaml의 캐릭터 시각 가이드
    }[]
  },
  conversation: {             // 챗봇 인터뷰 전체 대화
    role: 'ai' | 'user',
    text: string
  }[],
  style_token: 'children_storybook_watercolor'  // 기본값, 고정
}
```

#### 출력 JSON 스키마

```ts
{
  reference_image_url: string  // 생성된 캐릭터 reference 이미지 URL
}
```

#### 가드레일

| 항목 | 내용 |
|---|---|
| 아동 친화 | 폭력·공포·선정적 콘텐츠 차단 |
| 저작권 | 기존 저작권 캐릭터(디즈니, 마블 등) 참조 금지 |
| 구도 | 단일 캐릭터만, 정면 클로즈업 권장 |
| 스타일 | `children_storybook_watercolor` 고정 |

#### 비용 가드

| 항목 | 제한 |
|---|---|
| 호출 횟수 | 책당 1회 |
| Imagen 4 Fast 단가 | ≈ $0.02 / 장 |
| 책당 비용 | ≈ $0.02 |

#### 종료 조건

- reference 이미지 1장 생성 완료 시 `reference_image_url`을 반환하고 sub-step 2로 이동한다.
- 생성 실패 시 1회 재시도. 2회 연속 실패 시 전체 이미지 에이전트 오류로 처리.

---

### 3-2. sub-step 2: 장면 이미지 생성

#### 역할 / 목표

sub-step 1의 reference 이미지를 기반으로 **장면별 일러스트**를 생성한다.  
표지(page_idx=0) 포함 최대 6장을 순서대로 생성한다.

- reference 이미지의 캐릭터 외형을 그대로 유지
- 각 장면의 행동·배경·분위기만 변경
- 동일한 `children_storybook_watercolor` 스타일 유지

#### 모델 ID + API 경로

sub-step 1과 동일 (Imagen 4 Fast, 폴백: Gemini Flash Image).

#### System Prompt (프롬프트 빌더 LLM용)

```text
당신은 아동 동화책 삽화 프롬프트 작성 전문가입니다.

목표:
- 제공된 캐릭터 reference 이미지의 외형(색상, 의상, 표정 스타일)을 그대로 유지하면서
  각 장면의 행동과 배경을 반영한 이미지 생성 프롬프트를 작성하세요.

이미지 스타일:
- 스타일 토큰: children_storybook_watercolor
- 항상 수채화 동화책 일러스트 스타일로 묘사하세요.
- 밝고 따뜻한 색감.

장면 묘사 지침:
- 캐릭터의 외형(머리색, 옷 색, 체형 등)은 reference 이미지와 동일하게 유지하세요.
- 장면 텍스트(scene.text)를 기반으로 배경과 행동을 묘사하세요.
- 아이의 선호(conversation)가 있으면 반영하세요 (예: 특정 색, 분위기).
- visual_guide가 있으면 프롬프트에 우선 반영하세요.

안전 가드레일:
- 아동 친화 콘텐츠만 허용.
- 폭력, 공포, 저작권 캐릭터, 실제 인물 참조 금지.

출력:
- 영어 이미지 생성 프롬프트 1개만 출력하세요. 설명 없이.
```

#### 입력 JSON 스키마

```ts
{
  book_id: string,
  page_idx: number,           // 0..5 (0 = 표지 또는 첫 장면)
  scene: {
    idx: number,
    text: string,
    visual_guide?: string     // seed.yaml의 장면 시각 가이드
  },
  conversation: {             // 챗봇 인터뷰 전체 대화 (아이 선호 반영용)
    role: 'ai' | 'user',
    text: string
  }[],
  reference_image_url: string  // sub-step 1의 출력
}
```

#### 출력 JSON 스키마

```ts
{
  image_url: string,           // 생성된 장면 이미지 URL
  page_idx: number             // 입력의 page_idx 그대로 반환 (순서 확인용)
}
```

#### 가드레일

sub-step 1과 동일 (아동 친화·저작권·실제 인물 참조 금지).

#### 비용 가드

| 항목 | 제한 |
|---|---|
| 호출 횟수 | 책당 최대 6회 |
| Imagen 4 Fast 단가 | ≈ $0.02 / 장 |
| 책당 비용 | ≈ $0.12 |
| 재시도 | 페이지별 1회 재시도 허용 |

#### 종료 조건

- 6개 page_idx에 대해 모두 `image_url`을 받으면 이미지 에이전트 완료.
- 개별 페이지 실패 시 해당 페이지 1회 재시도.
- 재시도 후에도 실패 시 해당 페이지는 fallback(빈칸 또는 플레이스홀더)으로 처리하고 나머지 페이지 생성을 계속한다.

---

## 4. 데이터 인계 형식

챗봇 에이전트가 `completed: true`를 반환할 때 이미지 에이전트 sub-step 1로 전달하는 페이로드 스키마이다.

### 4-1. 인계 페이로드 JSON 스키마

```ts
{
  book_id: string,

  // 챗봇 인터뷰 전체 대화 (4턴, role + text)
  conversation: {
    role: 'ai' | 'user',
    text: string
  }[],

  // seed/DB에서 조회한 책 정적 데이터
  book_static_data: {
    id: string,
    title: string,
    author?: string,
    summary: string,
    characters?: {
      name: string,
      description: string,
      visual_guide?: string   // 캐릭터 시각 가이드 (seed.yaml 원본)
    }[],
    key_scenes?: {
      idx: number,
      text: string,
      visual_guide?: string   // 장면 시각 가이드 (seed.yaml 원본)
    }[]
  }
}
```

### 4-2. 인계 흐름 요약

```
챗봇 에이전트
  └─ completed: true 반환
       └─ metadata.child_preferences (자유 텍스트 요약)
  
이미지 에이전트 sub-step 1 호출
  입력: { book_id, book_static_data, conversation, style_token }
  출력: { reference_image_url }

이미지 에이전트 sub-step 2 × 6회
  입력: { book_id, page_idx, scene, conversation, reference_image_url }
  출력: { image_url, page_idx }
```

### 4-3. 코드 불일치 메모

> 구현 시 아래 불일치를 해소해야 한다. 이번 작업(명세 작성)에서는 메모만 하며 코드 수정은 후속 작업.

| 불일치 항목 | 현재 코드 상태 | 필요한 변경 |
|---|---|---|
| `Book.characters` | `src/lib/types.ts`의 `Book` 타입에 없음 | `characters?: Character[]` 필드 추가 |
| `Book.key_scenes` | `src/lib/types.ts`의 `Book` 타입에 없음 | `key_scenes?: KeyScene[]` 필드 추가 |
| `Book.chatbot_persona` | `src/lib/types.ts`에 없음 | 필요 시 추가 (퀴즈 에이전트 명세 후 결정) |
| `Character.visual_guide` | `src/lib/types.ts`에 없음 | `visual_guide?: string` 필드 추가 |
| `scripts/seed.ts` | `characters`, `key_scenes` 미등록 | DB 시드 보강 필요 |
| `AI_GATEWAY_API_KEY` | `.env.example`에 없음 | 환경 변수 추가 필요 |

---

## 5. 비용 가드 종합

### 5-1. 총 예산

- **$15 / 2일** (개발 + 데모 합산)
- 초과 시 서비스 중단 감수 (해커톤 단순화 결정, override 없음)

### 5-2. 에이전트별 비용 명세

| 에이전트 | 모델 | 호출당 단가 | 책당 호출 횟수 | 책당 예상 비용 |
|---|---|---|---|---|
| 챗봇 | `gemini-3.1-flash-lite-preview` | ≈ $0.0008 / 턴 | 4턴 | ≈ $0.003 |
| 이미지 reference | `imagen-4.0-fast-generate-001` | ≈ $0.02 / 장 | 1장 | ≈ $0.02 |
| 이미지 장면 | `imagen-4.0-fast-generate-001` | ≈ $0.02 / 장 | 6장 | ≈ $0.12 |
| **합계** | | | | **≈ $0.143 / 책** |

> 단가는 Preview 모델 기준 추정치. 정식 출시 시 변동 가능.

### 5-3. 안전 가드 라인

- **$15 / $0.143 ≈ 104책** 이론 상한
- 모델 단가 변동 및 실패 재시도를 고려해 **80책을 안전 가드 라인**으로 설정
- 80책 초과 시: 추가 책 생성 중단 (에러 메시지 표시)

### 5-4. 토큰 가드 (챗봇)

| 항목 | 상한 |
|---|---|
| 턴당 입력 | ≤ 2,000 토큰 |
| 턴당 출력 | ≤ 500 토큰 |
| 최대 턴 수 | 4턴 |

---

## 6. TODO / 후속 작업

이번 명세 작업에서 확인된 후속 작업 목록. 우선순위 순.

| 우선순위 | 항목 | 설명 |
|---|---|---|
| 1 | 퀴즈 에이전트 명세 | 이번 범위 외. 별도 명세 사이클 필요. |
| 2 | `src/lib/types.ts` 타입 확장 | `Book`에 `characters`, `key_scenes`, `chatbot_persona` 필드 추가 |
| 3 | `Character` / `KeyScene` 타입 신규 정의 | `visual_guide?: string` 포함 |
| 4 | `scripts/seed.ts` 데이터 보강 | 캐릭터·장면 `visual_guide` 값 등록 |
| 5 | `.env.example` 환경 변수 추가 | `AI_GATEWAY_API_KEY`, `AI_GATEWAY_URL` |
| 6 | mock `SCENARIOS` 제거 + 실제 Gemini 호출 통합 | `ChatPanel.tsx` 등의 mock 데이터 제거 |
| 7 | Imagen 4 Fast reference image 지원 검증 | 지원 불가 시 `gemini-3.1-flash-image-preview` 폴백으로 전환 |
| 8 | seed.yaml 모델 ID 동기화 | `seed.yaml`의 모델 설정과 이 명세 정합 확인 |

---
