"use client";

import {
  useState,
  useCallback,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import type { StoryPage, MyBookPage } from "@/lib/types";
import CarouselCard from "./CarouselCard";
import CarouselControls from "./CarouselControls";
import CarouselIndicator from "./CarouselIndicator";

interface ResultCarouselProps {
  storyTitle: string;
  pages: StoryPage[];
  coverImageUrl?: string;
}

const SWIPE_THRESHOLD_PX = 60;
const SWIPE_VELOCITY = 400;

export type EditState = {
  body: string;          // 칩(원래·AI) 선택 결과 — textarea가 비어있을 때 사용
  customInput: string;   // textarea 직접 입력값 (초기 빈 문자열)
  dirty: boolean;
  regenerating: boolean;
  isEditing: boolean;
};

// textarea 우선, 비어있으면 body
export function effectiveBody(s: EditState): string {
  return s.customInput.trim().length > 0 ? s.customInput : s.body;
}

export default function ResultCarousel({ storyTitle, pages, coverImageUrl }: ResultCarouselProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = pages.length;

  const [isSaving, setIsSaving] = useState(false);
  const [editStates, setEditStates] = useState<EditState[]>(
    pages.map((p) => ({
      body: p.body,
      customInput: "",
      dirty: false,
      regenerating: false,
      isEditing: false,
    }))
  );

  // await 후에도 최신 editStates를 읽기 위한 ref
  const editStatesRef = useRef(editStates);
  editStatesRef.current = editStates;

  // 원본과 동일한 후보는 "원래 문장" 박스와 중복되므로 제외
  const aiCandidatesByPage = useMemo(
    () =>
      pages.map((p) =>
        (p.bodyCandidates ?? []).filter((c) => c !== p.body)
      ),
    [pages]
  );

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(total - 1, i + 1));

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_THRESHOLD_PX || velocity.x < -SWIPE_VELOCITY) {
      goNext();
    } else if (offset.x > SWIPE_THRESHOLD_PX || velocity.x > SWIPE_VELOCITY) {
      goPrev();
    }
  };

  const toggleCardEdit = useCallback((idx: number) => {
    setEditStates((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, isEditing: !s.isEditing } : s))
    );
  }, []);

  const updateCustomInput = useCallback(
    (idx: number, value: string) => {
      setEditStates((prev) =>
        prev.map((s, i) => {
          if (i !== idx) return s;
          const next = { ...s, customInput: value };
          const original = pages[i].body;
          next.dirty = effectiveBody(next) !== original;
          return next;
        })
      );
    },
    [pages]
  );

  const pickCandidate = useCallback(
    (idx: number, candidate: string) => {
      setEditStates((prev) =>
        prev.map((s, i) =>
          i === idx
            ? {
                ...s,
                body: candidate,
                customInput: "",
                dirty: candidate !== pages[i].body,
              }
            : s
        )
      );
    },
    [pages]
  );

  const resetCardBody = useCallback((idx: number, originalBody: string) => {
    setEditStates((prev) =>
      prev.map((s, i) =>
        i === idx
          ? {
              ...s,
              body: originalBody,
              customInput: "",
              dirty: false,
            }
          : s
      )
    );
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const latest = editStatesRef.current;
      const savedPages: MyBookPage[] = pages.map((p, i) => ({
        pageNumber: p.pageNumber,
        title: p.title,
        body: effectiveBody(latest[i]),
        imageUrl: p.imageUrl,
      }));

      const res = await fetch("/api/my-books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyTitle,
          ...(coverImageUrl ? { coverImageUrl } : {}),
          pages: savedPages,
        }),
      });

      if (!res.ok) {
        alert("저장에 실패했습니다.");
        setIsSaving(false);
        return;
      }

      const { id } = await res.json() as { id: string };
      router.push(`/my-library?new=${id}`);
    } finally {
      setIsSaving(false);
    }
  }, [pages, storyTitle, coverImageUrl, router]);

  const isRegenerating = editStates.some((s) => s.regenerating);

  // 모든 카드의 ref를 array에 보관 — framer-motion의 ref callback 재호출 한계 우회
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  // activeIndex 또는 활성 카드 isEditing 변경 시 측정 + 그 카드에 ResizeObserver 부착
  const activeIsEditing = editStates[activeIndex]?.isEditing ?? false;
  useLayoutEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    const el = cardRefs.current[activeIndex];
    if (!el) return;
    setMeasuredHeight(el.offsetHeight);
    if (typeof ResizeObserver !== "undefined") {
      const obs = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setMeasuredHeight(entry.contentRect.height);
        }
      });
      obs.observe(el);
      observerRef.current = obs;
    }
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [activeIndex, activeIsEditing]);

  // 여유 마진 — transition 시간차와 subpixel 라운딩 보정
  const carouselHeight = Math.max((measuredHeight ?? 0) + 24, 520);

  const isLastCard = activeIndex === total - 1;

  return (
    <div
      style={{
        padding: "20px 0 80px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        alignItems: "center",
      }}
    >
      {/* 헤더 */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ textAlign: "center", padding: "0 16px" }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--color-brown-soft)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          나만의 동화책 완성!
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--color-brown)",
            marginTop: 6,
            lineHeight: 1.3,
            wordBreak: "keep-all",
          }}
        >
          {storyTitle}
        </h1>
      </motion.div>

      {/* 인디케이터 */}
      <CarouselIndicator
        pages={pages}
        activeIndex={activeIndex}
        editStates={editStates}
        onSelect={setActiveIndex}
      />

      {/* 캐러셀 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: carouselHeight,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflow: "hidden",
          touchAction: "pan-y",
          transition: "height 0.2s ease-out",
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="동화책 페이지"
      >
        {pages.map((page, idx) => {
          const offset = idx - activeIndex;
          const distance = Math.abs(offset);
          if (distance > 2) return null;

          const isActive = distance === 0;
          const cardState = editStates[idx];
          const isThisEditing = cardState.isEditing && isActive;

          return (
            <CarouselCard
              key={page.pageNumber}
              page={page}
              pageIndex={idx}
              total={total}
              offset={offset}
              isActive={isActive}
              isThisEditing={isThisEditing}
              isThisDirty={cardState.dirty}
              isThisRegen={cardState.regenerating}
              displayBody={effectiveBody(cardState)}
              cardState={cardState}
              aiCandidates={aiCandidatesByPage[idx]}
              cardRef={(el) => { cardRefs.current[idx] = el; }}
              onDragEnd={handleDragEnd}
              onCardClick={() => {
                if (isThisEditing) return;
                if (offset === 1) goNext();
                else if (offset === -1) goPrev();
              }}
              onToggleEdit={toggleCardEdit}
              onUpdateCustomInput={updateCustomInput}
              onPickCandidate={pickCandidate}
              onResetBody={resetCardBody}
            />
          );
        })}

        {/* 좌우 화살표 / 저장 버튼 */}
        <CarouselControls
          activeIndex={activeIndex}
          isLastCard={isLastCard}
          isSaving={isSaving}
          isRegenerating={isRegenerating}
          onPrev={goPrev}
          onNext={goNext}
          onSave={handleSave}
        />
      </div>

    </div>
  );
}
