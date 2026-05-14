"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Book, ChatAnswer } from "@/lib/types";
import { useSpeechInput } from "@/hooks/useSpeechInput";

// ── 타입 ────────────────────────────────────────────────────────────────────
type QuizQuestion = {
  id: string;
  type: "choice" | "free";
  question: string;
  choices: string[];
};

// ── Mock 데이터 ──────────────────────────────────────────────────────────────
const QUIZ_MAP: Record<string, QuizQuestion[]> = {
  star: [
    { id: "star-1", type: "choice", question: "원님이 냄새 맡은 값으로 무엇을 내렸나요?", choices: ["엽전 소리", "쌀 한 가마"] },
    { id: "star-2", type: "choice", question: "욕심 부린 주막 주인을 보고 어떤 마음이 들었나요?", choices: ["답답했어요", "웃겼어요"] },
    { id: "star-3", type: "choice", question: "원님의 판결을 듣고 나는 어떤 기분이었나요?", choices: ["통쾌했어요", "놀라웠어요"] },
    { id: "star-4", type: "choice", question: "이야기에서 가장 재미있었던 장면은?", choices: ["냄새 맡는 장면", "판결 장면"] },
    { id: "star-5", type: "choice", question: "공평한 세상을 만들려면 무엇이 필요할까요?", choices: ["지혜", "용기"] },
    { id: "star-6", type: "choice", question: "이 이야기에서 배운 가장 큰 교훈은?", choices: ["욕심은 화를 부른다", "지혜가 힘이다"] },
    { id: "star-7", type: "free", question: "이 이야기에서 가장 마음에 와닿은 장면을 자유롭게 적어볼까요?", choices: [] },
  ],
  forest: [
    { id: "forest-1", type: "choice", question: "마법 맷돌이 멈추지 않은 이유는 무엇일까요?", choices: ["욕심 때문에", "주문을 잊어서"] },
    { id: "forest-2", type: "choice", question: "선장을 보며 어떤 감정을 느꼈나요?", choices: ["안타까웠어요", "화가 났어요"] },
    { id: "forest-3", type: "choice", question: "바다가 짠 이유를 알게 되었을 때 기분은?", choices: ["신기했어요", "슬펐어요"] },
    { id: "forest-4", type: "choice", question: "만약 내가 맷돌을 가졌다면 무엇을 만들고 싶나요?", choices: ["맛있는 음식", "좋아하는 장난감"] },
    { id: "forest-5", type: "choice", question: "이야기에서 선장에게 아쉬웠던 점은?", choices: ["욕심을 버리지 못한 것", "맷돌을 훔친 것"] },
    { id: "forest-6", type: "choice", question: "이 이야기가 전하는 메시지는?", choices: ["욕심은 결국 손해", "용기있게 도전하자"] },
    { id: "forest-7", type: "free", question: "욕심 부린 선장에게 한마디 해준다면 어떻게 말하고 싶나요?", choices: [] },
  ],
  rabbit: [
    { id: "rabbit-1", type: "choice", question: "토끼는 왜 길을 떠났을까?", choices: ["친구를 찾으러", "늦어서 서둘러 가다가"] },
    { id: "rabbit-2", type: "choice", question: "욕심 많은 부자는 왜 소를 가져왔을까요?", choices: ["더 좋은 것을 받으려고", "원님이 좋아서"] },
    { id: "rabbit-3", type: "choice", question: "부자가 무를 받았을 때 어떤 기분이었을까요?", choices: ["황당했을 것 같아요", "행복했을 것 같아요"] },
    { id: "rabbit-4", type: "choice", question: "농부의 행동에서 느낀 점은?", choices: ["진심이 통한다", "욕심이 나쁘다"] },
    { id: "rabbit-5", type: "choice", question: "가장 인상 깊었던 장면은?", choices: ["무를 드리는 장면", "소를 가져오는 장면"] },
    { id: "rabbit-6", type: "choice", question: "이 이야기를 친구에게 한 마디로 소개한다면?", choices: ["욕심은 금물!", "진심은 통한다"] },
    { id: "rabbit-7", type: "free", question: "농부에게 짧은 편지를 쓴다면 어떤 말을 적고 싶나요?", choices: [] },
  ],
  brave: [
    { id: "brave-1", type: "choice", question: "두 사람이 다리 위에서 마주쳤을 때 어떤 기분이었을까요?", choices: ["난처했을 것 같아요", "화가 났을 것 같아요"] },
    { id: "brave-2", type: "choice", question: "노인이 두 사람에게 해준 조언은 어떤 것이었나요?", choices: ["양보하라", "빨리 지나가라"] },
    { id: "brave-3", type: "choice", question: "두 사람이 양보했을 때 어떤 일이 생겼나요?", choices: ["모두 무사히 지나갔어요", "기름이 쏟아졌어요"] },
    { id: "brave-4", type: "choice", question: "노인의 지혜를 보고 어떤 생각이 들었나요?", choices: ["지혜가 참 중요하다", "나도 저렇게 되고 싶다"] },
    { id: "brave-5", type: "choice", question: "일상에서 양보가 필요한 상황은?", choices: ["버스 자리", "친구와 의견 충돌"] },
    { id: "brave-6", type: "choice", question: "이 이야기에서 배운 것은?", choices: ["양보와 배려", "빠른 판단력"] },
    { id: "brave-7", type: "free", question: "두 사람에게 들려주고 싶은 짧은 조언을 적어볼까요?", choices: [] },
  ],
};

const DEFAULT_QUIZ: QuizQuestion[] = [
  { id: "default-1", type: "choice", question: "이 책에서 가장 기억에 남는 장면은?", choices: ["주인공의 선택", "반전 결말"] },
  { id: "default-2", type: "choice", question: "주인공의 마음이 어떠했을 것 같나요?", choices: ["설렘", "걱정"] },
  { id: "default-3", type: "choice", question: "이 이야기에서 배운 것은?", choices: ["나눔의 소중함", "용기의 힘"] },
  { id: "default-4", type: "free", question: "이 책을 친구에게 소개하는 한 줄을 적어볼까요?", choices: [] },
];

// ── 옵션 카드 컬러 매핑 ──
const OPTION_COLORS = [
  { bg: "#FDF2C4", border: "#F5E194", number: "#3D2E1E" }, // 1: 노랑
  { bg: "#E1F2D5", border: "#BFE0A8", number: "#3D2E1E" }, // 2: 초록
  { bg: "#FBE0DE", border: "#F4C7C3", number: "#3D2E1E" }, // 3: 핑크 (free input)
];

interface ChatPanelProps {
  book: Book;
  onComplete: (answers: ChatAnswer[]) => void;
}

export default function ChatPanel({ book, onComplete }: ChatPanelProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const quizzes = QUIZ_MAP[book.id] ?? DEFAULT_QUIZ;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [freeText, setFreeText] = useState("");
  const [answers, setAnswers] = useState<ChatAnswer[]>([]);

  const {
    isSupported: speechSupported,
    isListening,
    transcript,
    start: startSpeech,
    stop: stopSpeech,
    reset: resetSpeech,
  } = useSpeechInput();

  useEffect(() => {
    if (!transcript) return;
    setFreeText((prev) => (prev ? `${prev.trim()} ${transcript}` : transcript));
    resetSpeech();
  }, [transcript, resetSpeech]);

  const current = quizzes[currentIndex];
  const isLast = currentIndex === quizzes.length - 1;
  const visibleChoices = current.type === "choice" ? current.choices.slice(0, 2) : [];
  const freeOptionIndex = visibleChoices.length;
  const isFreeSelected = selectedChoice === freeOptionIndex;

  const canProceed =
    selectedChoice !== null &&
    (selectedChoice < visibleChoices.length || freeText.trim().length > 0);

  function handleSelectChoice(idx: number) {
    setSelectedChoice(idx);
    if (idx !== freeOptionIndex) {
      setFreeText("");
      if (isListening) stopSpeech();
    }
  }

  function handleMicTap() {
    setSelectedChoice(freeOptionIndex);
    if (isListening) stopSpeech();
    else startSpeech();
  }

  function handleNext() {
    if (!canProceed) return;
    if (isListening) stopSpeech();
    resetSpeech();

    const currentAnswer: ChatAnswer = {
      questionId: current.id,
      question: current.question,
      answer:
        current.type === "choice"
          ? current.choices[selectedChoice!]
          : freeText.trim(),
    };
    const nextAnswers = [...answers, currentAnswer];
    setAnswers(nextAnswers);

    if (isLast) {
      onComplete(nextAnswers);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedChoice(null);
      setFreeText("");
    }
  }

  return (
    <div
      className="relative w-full max-w-[480px] mx-auto flex flex-col"
      style={{ minHeight: "100%", backgroundColor: "var(--color-beige-soft)" }}
    >
      {/* ── 헤더 ── */}
      <header
        className="flex items-center justify-between flex-shrink-0"
        style={{
          paddingTop: "calc(16px + env(safe-area-inset-top))",
          paddingBottom: 12,
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: "var(--color-beige-soft)",
        }}
      >
        {/* 뒤로가기 — 단순 아이콘 */}
        <button
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="w-10 h-10 flex items-center justify-center"
          style={{ color: "var(--color-brown)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 가운데: 책 표지 미니 + 제목 + 페이지 카운트 */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="relative flex-shrink-0 overflow-hidden"
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              backgroundColor: "var(--color-card)",
              boxShadow: "0 2px 5px rgba(60,40,20,0.15)",
            }}
          >
            <Image
              src="/ui/profile.png"
              alt=""
              fill
              sizes="42px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <p
              className="font-display"
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--color-brown)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 160,
              }}
            >
              {book.title}
            </p>
            <p style={{ fontSize: 12, color: "var(--color-brown-soft)", marginTop: 2 }}>
              {currentIndex + 1}/{quizzes.length} 페이지
            </p>
          </div>
        </div>

        {/* 힌트 버튼 — pill */}
        <button
          type="button"
          aria-label="힌트 보기"
          className="flex items-center gap-1.5 flex-shrink-0"
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            backgroundColor: "var(--color-card)",
            color: "var(--color-brown)",
            fontFamily: "var(--font-display)",
            fontSize: 14,
            fontWeight: 700,
            boxShadow: "0 2px 5px rgba(60,40,20,0.12)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.6 1 1.5 1 2.3v1h6v-1c0-.8.4-1.7 1-2.3A7 7 0 0 0 12 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          힌트
        </button>
      </header>

      {/* ── 이미지/씬 영역 — 토끼 + 말풍선 ── */}
      <div
        className="relative flex-shrink-0"
        style={{
          height: 300,
          backgroundColor: "var(--color-beige-soft)",
          overflow: "hidden",
        }}
      >
        {/* 구름 데코 (cl.png) — 좌/우 상단 */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 18,
            width: 72,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/ui/cl.png"
            alt=""
            width={72}
            height={48}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 18,
            width: 60,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/ui/cl.png"
            alt=""
            width={60}
            height={40}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* 덤불 데코 (obj1.png) — 좌/우 하단, 안 짤리게 안쪽 배치 */}
        <div
          style={{
            position: "absolute",
            bottom: -2,
            left: 28,
            width: 70,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/ui/obj1.png"
            alt=""
            width={70}
            height={44}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -2,
            right: 28,
            width: 70,
            zIndex: 1,
            pointerEvents: "none",
            transform: "scaleX(-1)",
          }}
        >
          <Image
            src="/ui/obj1.png"
            alt=""
            width={70}
            height={44}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -2,
            right: 90,
            width: 38,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/ui/obj2.png"
            alt=""
            width={38}
            height={28}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* 토끼 — 절대 중앙 + 더 큼 + 살짝 흔들림 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 340,
            height: 300,
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -4, 0],
                    rotate: [-1.2, 1.2, -1.2],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 3.6, repeat: Infinity, ease: "easeInOut" },
                  }
            }
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "bottom center",
            }}
          >
            <Image
              src="/toki/2.png"
              alt="토끼"
              width={420}
              height={420}
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 420,
                height: 420,
                objectFit: "contain",
              }}
              priority
            />
          </motion.div>
        </div>

        {/* 말풍선 — 중앙 상단 */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 18px",
            backgroundColor: "#FFFBF0",
            borderRadius: 18,
            boxShadow: "0 4px 10px rgba(60,40,20,0.15)",
            maxWidth: 240,
            zIndex: 3,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--color-brown)",
              lineHeight: 1.45,
              wordBreak: "keep-all",
            }}
          >
            {current.question}
          </p>
          {/* 꼬리 — 아래쪽 가운데 (토끼 머리쪽) */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              bottom: -8,
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "12px solid #FFFBF0",
              filter: "drop-shadow(0 2px 1px rgba(60,40,20,0.06))",
            }}
          />
        </div>
      </div>

      {/* ── 옵션 카드 ── */}
      <div
        className="flex-1 flex flex-col"
        style={{
          background: "var(--color-card)",
          borderRadius: "24px 24px 0 0",
          padding: "20px 20px 10px",
          boxShadow: "0 -6px 16px rgba(60,40,20,0.08)",
          gap: 10,
        }}
      >
        {current.type === "choice" ? (
          <>
            {/* 옵션 1, 2 (객관식) */}
            {visibleChoices.map((choice, idx) => {
              const color = OPTION_COLORS[idx];
              const isSelected = selectedChoice === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectChoice(idx)}
                  aria-pressed={isSelected}
                  className="flex items-center gap-3 text-left transition-all"
                  style={{
                    padding: "12px 12px",
                    borderRadius: 16,
                    backgroundColor: "var(--color-card)",
                    border: isSelected
                      ? `2px solid ${color.border}`
                      : "1.5px solid rgba(120,90,50,0.20)",
                    boxShadow: isSelected
                      ? `0 2px 8px rgba(60,40,20,0.12), inset 0 0 0 1px ${color.border}`
                      : "none",
                  }}
                >
                  <span
                    className="flex items-center justify-center flex-shrink-0 font-display"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: color.bg,
                      color: color.number,
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--color-brown)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {choice}
                  </span>
                </button>
              );
            })}

            {/* 옵션 3: 마이크/자유입력 */}
            <button
              type="button"
              onClick={() => handleSelectChoice(freeOptionIndex)}
              aria-pressed={isFreeSelected}
              className="flex items-center gap-3 text-left transition-all"
              style={{
                padding: "12px 12px",
                borderRadius: 16,
                backgroundColor: "var(--color-card)",
                border: isFreeSelected
                  ? `2px solid ${OPTION_COLORS[2].border}`
                  : "1.5px solid rgba(120,90,50,0.20)",
                boxShadow: isFreeSelected
                  ? `0 2px 8px rgba(60,40,20,0.12), inset 0 0 0 1px ${OPTION_COLORS[2].border}`
                  : "none",
              }}
            >
              <span
                className="flex items-center justify-center flex-shrink-0 font-display"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: OPTION_COLORS[2].bg,
                  color: OPTION_COLORS[2].number,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {freeOptionIndex + 1}
              </span>
              <span
                className="flex-1"
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--color-brown-soft)",
                  fontFamily: "var(--font-display)",
                }}
              >
                마이크 누르고 내 생각 말하기
              </span>
              {speechSupported && (
                <span
                  role="button"
                  aria-label={isListening ? "음성 입력 중지" : "음성 입력 시작"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMicTap();
                  }}
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: isListening
                      ? "var(--color-green-deep)"
                      : "var(--color-green)",
                    color: "#FFFBF0",
                    boxShadow: "0 3px 6px rgba(60,40,20,0.18)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
                    <path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              )}
            </button>
          </>
        ) : (
          /* ── 자유 응답 — 큰 마이크 UI ── */
          <div
            className="flex flex-col items-center justify-center"
            style={{ flex: 1, padding: "8px 8px 12px", gap: 18 }}
          >
            {/* 타이틀 */}
            <div className="flex items-center justify-center">
              <p
                className="font-display"
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--color-brown)",
                }}
              >
                네 생각을 말해보자!
              </p>
            </div>

            {/* 가운데 큰 마이크 + 좌/우 안내 태그 */}
            <div className="flex items-center justify-center gap-3 w-full" style={{ flexWrap: "nowrap" }}>
              {/* 좌측 안내 태그 */}
              <div
                style={{
                  flex: "0 1 auto",
                  padding: "10px 12px",
                  borderRadius: 14,
                  backgroundColor: "#E1F2D5",
                  border: "1.5px solid #BFE0A8",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--color-brown)",
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.4,
                  textAlign: "center",
                  whiteSpace: "pre-line",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="9" y="3" width="6" height="11" rx="3" fill="var(--color-green-deep)" />
                    <path d="M5 11a7 7 0 0 0 14 0" stroke="var(--color-green-deep)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                {"버튼을 누르고\n생각을 말해보세요."}
              </div>

              {/* 가운데 큰 마이크 버튼 */}
              <button
                type="button"
                onClick={handleMicTap}
                aria-label={isListening ? "음성 입력 중지" : "음성 입력 시작"}
                aria-pressed={isListening}
                className="flex items-center justify-center flex-shrink-0 transition-transform active:scale-95"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  backgroundColor: isListening
                    ? "var(--color-green-deep)"
                    : "var(--color-green)",
                  color: "#FFFBF0",
                  boxShadow:
                    "0 8px 20px rgba(95,160,72,0.45), inset 0 -3px 6px rgba(0,0,0,0.12), inset 0 3px 6px rgba(255,255,255,0.35)",
                  border: "3px solid #FFFBF0",
                  cursor: "pointer",
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
                  <path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M12 18v3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>

              {/* 우측 안내 태그 */}
              <div
                style={{
                  flex: "0 1 auto",
                  padding: "10px 12px",
                  borderRadius: 14,
                  backgroundColor: "#FFFBF0",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--color-brown)",
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.4,
                  textAlign: "center",
                  whiteSpace: "pre-line",
                }}
              >
                <span style={{ fontSize: 16, display: "block", marginBottom: 2 }}>👶</span>
                {"천천히 말해도\n괜찮아!"}
              </div>
            </div>

            {/* 하단 힌트 pill */}
            <div
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                backgroundColor: "rgba(120,90,50,0.08)",
                fontSize: 13,
                color: "var(--color-brown-soft)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
              }}
            >
              버튼을 다시 누르면 종료돼요
            </div>

            {/* 입력 텍스트 미리보기 (있을 때만) */}
            {freeText && (
              <div
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 12,
                  backgroundColor: "var(--color-beige-soft)",
                  borderLeft: "4px solid var(--color-green-deep)",
                  fontSize: 14,
                  color: "var(--color-brown)",
                  fontFamily: "var(--font-body)",
                  textAlign: "left",
                  marginTop: -4,
                }}
              >
                {freeText}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 푸터 ── */}
      <footer
        className="flex items-center justify-center flex-shrink-0"
        style={{
          padding: "12px 20px",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
          backgroundColor: "var(--color-card)",
        }}
      >
        {/* 다음 버튼 — 큼직하게 */}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          aria-label={isLast ? "완료" : "다음 페이지"}
          className="flex items-center justify-center gap-2 font-display transition-all w-full"
          style={{
            padding: "18px 32px",
            borderRadius: 999,
            backgroundColor: canProceed ? "var(--color-green)" : "rgba(120,90,50,0.18)",
            color: canProceed ? "#FFFBF0" : "var(--color-brown-soft)",
            fontSize: 20,
            fontWeight: 700,
            boxShadow: canProceed ? "0 6px 14px rgba(95,160,72,0.40)" : "none",
            cursor: canProceed ? "pointer" : "not-allowed",
            maxWidth: 420,
          }}
        >
          {isLast ? "완료" : "다음"}
          <span aria-hidden="true" style={{ fontSize: 22 }}>›</span>
        </button>
      </footer>

      <style>{`
        button:focus-visible {
          outline: 2px solid var(--color-brown);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
