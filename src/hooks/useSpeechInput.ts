"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Web Speech API 타입 선언 (TypeScript 전역 타입에 미정의)
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export type SpeechError =
  | "not-allowed"
  | "service-not-allowed"
  | "no-speech"
  | "network"
  | "aborted"
  | "unknown";

export interface UseSpeechInputReturn {
  /** 현재 브라우저에서 음성 인식 지원 여부 */
  isSupported: boolean;
  /** 현재 음성 인식 중인지 여부 */
  isListening: boolean;
  /** 인식된 텍스트 (확정된 transcript) */
  transcript: string;
  /** 음성 인식 시작 */
  start: () => void;
  /** 음성 인식 중지 */
  stop: () => void;
  /** transcript 초기화 */
  reset: () => void;
  /** 마지막 에러 (없으면 null) */
  error: SpeechError | null;
}

export function useSpeechInput(): UseSpeechInputReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<SpeechError | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const supported =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    setIsSupported(supported);
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    if (!isSupported) return;
    if (isListening) {
      stop();
      return;
    }

    setError(null);

    const SpeechRecognitionClass =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    const recognition = new SpeechRecognitionClass();
    recognition.lang = "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        setTranscript(result[0].transcript.trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const code = event.error as string;
      if (code === "not-allowed" || code === "service-not-allowed") {
        setError("not-allowed");
      } else if (code === "no-speech") {
        setError("no-speech");
      } else if (code === "network") {
        setError("network");
      } else if (code === "aborted") {
        setError("aborted");
      } else {
        setError("unknown");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, isListening, stop]);

  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return { isSupported, isListening, transcript, start, stop, reset, error };
}
