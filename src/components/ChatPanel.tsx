"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Book } from "@/lib/types";
import { getBookVisuals } from "@/lib/bookVisuals";

// ── 타입 ────────────────────────────────────────────────────────────────────
type QuizQuestion = {
  id: string;
  type: "choice" | "free";
  question: string;
  choices: string[];
};

// ── Mock 데이터 ──────────────────────────────────────────────────────────────
// 책별 6~8문항. book.id(슬러그) 키 기반. 알 수 없는 id는 DEFAULT_QUIZ로 폴백.

const QUIZ_MAP: Record<string, QuizQuestion[]> = {
  // 냄새 맡은 값 (star)
  star: [
    {
      id: "star-1",
      type: "choice",
      question: "원님이 냄새 맡은 값으로 무엇을 내렸나요?",
      choices: ["엽전 소리", "쌀 한 가마", "칭찬 한마디"],
    },
    {
      id: "star-2",
      type: "choice",
      question: "욕심 부린 주막 주인을 보고 어떤 마음이 들었나요?",
      choices: ["답답했어요", "웃겼어요", "안타까웠어요"],
    },
    {
      id: "star-3",
      type: "choice",
      question: "원님의 판결을 듣고 나는 어떤 기분이었나요?",
      choices: ["통쾌했어요", "놀라웠어요", "이상했어요"],
    },
    {
      id: "star-4",
      type: "choice",
      question: "이야기에서 가장 재미있었던 장면은?",
      choices: ["냄새 맡는 장면", "판결 장면", "주막 장면"],
    },
    {
      id: "star-5",
      type: "choice",
      question: "공평한 세상을 만들려면 무엇이 필요할까요?",
      choices: ["지혜", "용기", "배려"],
    },
    {
      id: "star-6",
      type: "choice",
      question: "이 이야기에서 배운 가장 큰 교훈은?",
      choices: ["욕심은 화를 부른다", "지혜가 힘이다", "나눔이 행복이다"],
    },
  ],
  // 소금을 만드는 맷돌 (forest)
  forest: [
    {
      id: "forest-1",
      type: "choice",
      question: "마법 맷돌이 멈추지 않은 이유는 무엇일까요?",
      choices: ["욕심 때문에", "주문을 잊어서", "맷돌이 고장나서"],
    },
    {
      id: "forest-2",
      type: "choice",
      question: "선장을 보며 어떤 감정을 느꼈나요?",
      choices: ["안타까웠어요", "화가 났어요", "불쌍했어요"],
    },
    {
      id: "forest-3",
      type: "choice",
      question: "바다가 짠 이유를 알게 되었을 때 기분은?",
      choices: ["신기했어요", "슬펐어요", "재미있었어요"],
    },
    {
      id: "forest-4",
      type: "choice",
      question: "만약 내가 맷돌을 가졌다면 무엇을 만들고 싶나요?",
      choices: ["맛있는 음식", "좋아하는 장난감", "소중한 사람에게 선물"],
    },
    {
      id: "forest-5",
      type: "choice",
      question: "이야기에서 선장에게 아쉬웠던 점은?",
      choices: ["욕심을 버리지 못한 것", "맷돌을 훔친 것", "바다에 뛰어든 것"],
    },
    {
      id: "forest-6",
      type: "choice",
      question: "이 이야기가 전하는 메시지는?",
      choices: ["욕심은 결국 손해", "용기있게 도전하자", "친구를 소중히"],
    },
  ],
  // 송아지와 바꾼 무 (rabbit)
  rabbit: [
    {
      id: "rabbit-1",
      type: "choice",
      question: "농부가 원님께 무를 드린 마음은 어떤 마음이었을까요?",
      choices: ["순수한 감사", "대가를 바란 마음", "자랑하고 싶은 마음"],
    },
    {
      id: "rabbit-2",
      type: "choice",
      question: "욕심 많은 부자는 왜 소를 가져왔을까요?",
      choices: ["더 좋은 것을 받으려고", "원님이 좋아서", "무가 없어서"],
    },
    {
      id: "rabbit-3",
      type: "choice",
      question: "부자가 무를 받았을 때 어떤 기분이었을까요?",
      choices: ["황당했을 것 같아요", "행복했을 것 같아요", "슬펐을 것 같아요"],
    },
    {
      id: "rabbit-4",
      type: "choice",
      question: "농부의 행동에서 느낀 점은?",
      choices: ["진심이 통한다", "욕심이 나쁘다", "나눔이 중요하다"],
    },
    {
      id: "rabbit-5",
      type: "choice",
      question: "가장 인상 깊었던 장면은?",
      choices: ["무를 드리는 장면", "소를 가져오는 장면", "원님의 반응"],
    },
    {
      id: "rabbit-6",
      type: "choice",
      question: "이 이야기를 친구에게 한 마디로 소개한다면?",
      choices: ["욕심은 금물!", "진심은 통한다", "재미있는 반전!"],
    },
  ],
  // 소금장수와 기름장수 (brave)
  brave: [
    {
      id: "brave-1",
      type: "choice",
      question: "두 사람이 다리 위에서 마주쳤을 때 어떤 기분이었을까요?",
      choices: ["난처했을 것 같아요", "화가 났을 것 같아요", "재미있었을 것 같아요"],
    },
    {
      id: "brave-2",
      type: "choice",
      question: "노인이 두 사람에게 해준 조언은 어떤 것이었나요?",
      choices: ["양보하라", "빨리 지나가라", "도움을 청해라"],
    },
    {
      id: "brave-3",
      type: "choice",
      question: "두 사람이 양보했을 때 어떤 일이 생겼나요?",
      choices: ["모두 무사히 지나갔어요", "기름이 쏟아졌어요", "소금이 녹았어요"],
    },
    {
      id: "brave-4",
      type: "choice",
      question: "노인의 지혜를 보고 어떤 생각이 들었나요?",
      choices: ["지혜가 참 중요하다", "나도 저렇게 되고 싶다", "어른들은 역시 달라"],
    },
    {
      id: "brave-5",
      type: "choice",
      question: "일상에서 양보가 필요한 상황은?",
      choices: ["버스 자리", "친구와 의견 충돌", "줄 서기"],
    },
    {
      id: "brave-6",
      type: "choice",
      question: "이 이야기에서 배운 것은?",
      choices: ["양보와 배려", "빠른 판단력", "용감한 행동"],
    },
  ],
};

const DEFAULT_QUIZ: QuizQuestion[] = [
  {
    id: "default-1",
    type: "choice",
    question: "이 책에서 가장 기억에 남는 장면은?",
    choices: ["주인공의 선택", "반전 결말", "인상적인 대화"],
  },
  {
    id: "default-2",
    type: "choice",
    question: "주인공의 마음이 어떠했을 것 같나요?",
    choices: ["설렘", "걱정", "용기"],
  },
  {
    id: "default-3",
    type: "choice",
    question: "이 이야기에서 배운 것은?",
    choices: ["나눔의 소중함", "용기의 힘", "지혜의 가치"],
  },
];

// ── 컴포넌트 ─────────────────────────────────────────────────────────────────

interface ChatPanelProps {
  book: Book;
  onComplete: () => void;
}

export default function ChatPanel({ book, onComplete }: ChatPanelProps) {
  const router = useRouter();
  const visuals = getBookVisuals(book.id);
  const quizzes = QUIZ_MAP[book.id] ?? DEFAULT_QUIZ;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const current = quizzes[currentIndex];
  const isLast = currentIndex === quizzes.length - 1;

  function handleSelect(i: number) {
    setSelectedChoice(i);
  }

  function handleNext() {
    if (selectedChoice === null) return;
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedChoice(null);
    }
  }

  function handleBack() {
    router.back();
  }

  return (
    <div className="relative w-full max-w-[480px] mx-auto min-h-full flex flex-col">
      {/* ── 헤더 ── */}
      <header
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(120,90,50,0.10)" }}
      >
        {/* 뒤로가기 */}
        <button
          onClick={handleBack}
          aria-label="뒤로가기"
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{
            background: "var(--color-card)",
            boxShadow: "var(--shadow-clay-sm)",
            border: "var(--border-clay)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* 책 아이콘 + 제목 + 카운터 */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                background: visuals.palette.bg,
                color: visuals.palette.titleColor ?? "#fff",
                boxShadow: "var(--shadow-clay-sm)",
              }}
            >
              📖
            </span>
            <span
              className="font-display text-base font-bold"
              style={{ color: "var(--color-brown)", maxWidth: 160 }}
            >
              {book.title}
            </span>
          </div>
          <span className="text-xs" style={{ color: "var(--color-brown-soft)" }}>
            {currentIndex + 1} / {quizzes.length}
          </span>
        </div>

        {/* 힌트 버튼 (시각 전용) */}
        <button
          aria-label="힌트"
          className="w-9 h-9 flex items-center justify-center rounded-full text-sm"
          style={{
            background: "var(--color-card)",
            boxShadow: "var(--shadow-clay-sm)",
            border: "var(--border-clay)",
            color: "var(--color-brown-soft)",
          }}
        >
          💡
        </button>
      </header>

      {/* ── 메인 영역: 배경 + 토끼 + 말풍선 ── */}
      <div
        className="relative flex flex-col items-center justify-end flex-shrink-0 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, var(--color-beige-soft) 0%, var(--color-beige) 100%)",
          minHeight: 200,
          paddingBottom: 0,
        }}
      >
        {/* 인라인 SVG: 구름 */}
        <svg
          aria-hidden="true"
          className="absolute top-4 left-6"
          width="60"
          height="28"
          viewBox="0 0 60 28"
          fill="none"
        >
          <ellipse cx="30" cy="18" rx="28" ry="10" fill="white" fillOpacity="0.85" />
          <ellipse cx="18" cy="14" rx="14" ry="9" fill="white" fillOpacity="0.85" />
          <ellipse cx="42" cy="16" rx="12" ry="8" fill="white" fillOpacity="0.85" />
        </svg>

        {/* 인라인 SVG: 구름 (우측) */}
        <svg
          aria-hidden="true"
          className="absolute top-6 right-4"
          width="44"
          height="22"
          viewBox="0 0 44 22"
          fill="none"
        >
          <ellipse cx="22" cy="14" rx="20" ry="8" fill="white" fillOpacity="0.80" />
          <ellipse cx="12" cy="10" rx="10" ry="7" fill="white" fillOpacity="0.80" />
          <ellipse cx="32" cy="12" rx="9" ry="6" fill="white" fillOpacity="0.80" />
        </svg>

        {/* 인라인 SVG: 풀 (좌) */}
        <svg
          aria-hidden="true"
          className="absolute bottom-0 left-2"
          width="48"
          height="32"
          viewBox="0 0 48 32"
          fill="none"
        >
          <ellipse cx="10" cy="28" rx="8" ry="12" fill="#6BAD6A" fillOpacity="0.7" transform="rotate(-10 10 28)" />
          <ellipse cx="22" cy="26" rx="7" ry="14" fill="#5CA05A" fillOpacity="0.8" />
          <ellipse cx="34" cy="28" rx="8" ry="11" fill="#6BAD6A" fillOpacity="0.7" transform="rotate(8 34 28)" />
        </svg>

        {/* 인라인 SVG: 풀 (우) */}
        <svg
          aria-hidden="true"
          className="absolute bottom-0 right-2"
          width="48"
          height="32"
          viewBox="0 0 48 32"
          fill="none"
        >
          <ellipse cx="14" cy="28" rx="8" ry="11" fill="#6BAD6A" fillOpacity="0.7" transform="rotate(-8 14 28)" />
          <ellipse cx="26" cy="26" rx="7" ry="14" fill="#5CA05A" fillOpacity="0.8" />
          <ellipse cx="38" cy="28" rx="7" ry="12" fill="#6BAD6A" fillOpacity="0.7" transform="rotate(10 38 28)" />
        </svg>

        {/* 토끼 + 말풍선 레이아웃 */}
        <div className="relative flex items-end justify-center w-full px-6 pt-6">
          {/* 말풍선 */}
          <div
            className="relative mb-2 mr-2"
            style={{
              background: "white",
              borderRadius: "var(--radius-clay)",
              padding: "10px 16px",
              boxShadow: "var(--shadow-clay-sm)",
              maxWidth: 200,
              fontSize: 13,
              lineHeight: 1.5,
              color: "var(--color-brown)",
              fontWeight: 500,
            }}
          >
            정말 재미있는 이야기였지? 🐰
            {/* 말풍선 꼬리 (우측 아래) */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -10,
                bottom: 14,
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: "12px solid white",
              }}
            />
          </div>

          {/* 토끼 이미지 */}
          <img
            src="/toki/1.png"
            alt="토끼 캐릭터"
            className="flex-shrink-0"
            style={{ width: 120, height: 120, objectFit: "contain" }}
          />
        </div>
      </div>

      {/* ── 카드 영역 ── */}
      <div
        className="flex-1 flex flex-col overflow-y-auto px-4 py-4 gap-3"
        style={{ background: "var(--color-beige-soft)" }}
      >
        {/* Q 배지 + 질문 */}
        <div
          className="rounded-[var(--radius-clay)] p-5"
          style={{
            background: "var(--color-card)",
            boxShadow: "var(--shadow-clay)",
          }}
        >
          {/* Q 배지 */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                background: visuals.palette.bg,
                color: visuals.palette.titleColor ?? "#fff",
                boxShadow: "var(--shadow-clay-sm)",
              }}
            >
              Q
            </span>
            <span className="text-xs font-semibold" style={{ color: "var(--color-brown-soft)" }}>
              {currentIndex + 1}번 질문
            </span>
          </div>

          {/* 질문 텍스트 */}
          <p
            className="font-display text-base font-bold mb-4"
            style={{ color: "var(--color-brown)", lineHeight: 1.5, wordBreak: "keep-all" }}
          >
            {current.question}
          </p>

          {/* 선지 */}
          <div className="flex flex-col gap-2">
            {current.choices.map((choice, idx) => {
              const isSelected = selectedChoice === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-[var(--radius-clay-sm)] transition-all duration-150"
                  style={{
                    background: isSelected
                      ? `${visuals.palette.bg}22`
                      : "var(--color-beige-soft)",
                    border: isSelected
                      ? `2px solid ${visuals.palette.bg}`
                      : "2px solid transparent",
                    boxShadow: isSelected ? "var(--shadow-clay-sm)" : "none",
                  }}
                >
                  {/* 번호 동그라미 */}
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: isSelected ? visuals.palette.bg : "var(--color-card)",
                      color: isSelected
                        ? (visuals.palette.titleColor ?? "#fff")
                        : "var(--color-brown-soft)",
                      boxShadow: "var(--shadow-clay-sm)",
                      transition: "background 0.15s, color 0.15s",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: isSelected ? "var(--color-brown)" : "var(--color-brown-soft)",
                      transition: "color 0.15s",
                    }}
                  >
                    {choice}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 푸터: 진행 점 + 다음 버튼 ── */}
      <footer
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: "var(--color-beige-soft)",
          borderTop: "1px solid rgba(120,90,50,0.10)",
        }}
      >
        {/* 깃발 + 진행 점 */}
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-base">🚩</span>
          <div className="flex items-center gap-1.5">
            {quizzes.map((_, idx) => (
              <span
                key={idx}
                className="rounded-full transition-all duration-200"
                style={{
                  width: idx === currentIndex ? 10 : 7,
                  height: idx === currentIndex ? 10 : 7,
                  background:
                    idx === currentIndex
                      ? visuals.palette.bg
                      : "rgba(120,90,50,0.25)",
                  display: "inline-block",
                }}
              />
            ))}
          </div>
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={selectedChoice === null}
          className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-150"
          style={{
            background:
              selectedChoice !== null ? visuals.palette.bg : "var(--color-card)",
            color:
              selectedChoice !== null
                ? (visuals.palette.titleColor ?? "#fff")
                : "var(--color-brown-soft)",
            boxShadow:
              selectedChoice !== null
                ? "var(--shadow-clay)"
                : "var(--shadow-clay-sm)",
            border: "var(--border-clay)",
            opacity: selectedChoice === null ? 0.5 : 1,
            cursor: selectedChoice === null ? "not-allowed" : "pointer",
          }}
        >
          {isLast ? "완료" : "다음"}
        </button>
      </footer>

      {/* focus-visible 스타일 */}
      <style>{`
        button:focus-visible {
          outline: 2px solid var(--color-brown);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
