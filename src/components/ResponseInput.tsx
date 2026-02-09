"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Extend Window for webkit speech recognition
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

interface ResponseInputProps {
  /** Called when user submits a response (text or voice) */
  onSubmit: (response: string) => void;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether to show the text input (always true, but can be hidden initially) */
  showTextInput?: boolean;
  /** Time in ms before the silence reminder fires */
  silenceTimeout?: number;
  /** Called when silence timer fires (to re-ask the question) */
  onSilence?: () => void;
  /** Whether the component is active / accepting input */
  active?: boolean;
}

export default function ResponseInput({
  onSubmit,
  placeholder = "Type your response here...",
  showTextInput = true,
  silenceTimeout = 12000,
  onSilence,
  active = true,
}: ResponseInputProps) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hasMic, setHasMic] = useState(false);
  const [showText, setShowText] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check for speech recognition support
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setHasMic(!!SR);
    }
  }, []);

  // Silence timer
  useEffect(() => {
    if (!active) return;

    const startSilenceTimer = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        onSilence?.();
      }, silenceTimeout);
    };

    startSilenceTimer();

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [active, silenceTimeout, onSilence]);

  // Reset silence timer on any interaction
  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      onSilence?.();
    }, silenceTimeout);
  }, [silenceTimeout, onSilence]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* already stopped */
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    stopRecognition();

    const recognition: SpeechRecognitionInstance = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(finalTranscript + interim);
      resetSilenceTimer();

      // Auto-stop after 3 seconds of silence following speech
      if (silenceTimer) clearTimeout(silenceTimer);
      if (finalTranscript.trim()) {
        silenceTimer = setTimeout(() => {
          recognition.stop();
        }, 3000);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      const final = finalTranscript.trim();
      if (final) {
        onSubmit(final);
        setTranscript("");
        finalTranscript = "";
      }
    };

    recognitionRef.current = recognition;
    setTranscript("");
    setIsListening(true);
    recognition.start();
  }, [onSubmit, resetSilenceTimer, stopRecognition]);

  const handleTextSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
    resetSilenceTimer();
  }, [text, onSubmit, resetSilenceTimer]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleTextSubmit();
      }
    },
    [handleTextSubmit]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecognition();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [stopRecognition]);

  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="w-full max-w-md mx-auto mt-8"
    >
      {/* Microphone button */}
      {hasMic && (
        <div className="flex flex-col items-center mb-4">
          <button
            onClick={isListening ? stopRecognition : startListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
              isListening
                ? "bg-terracotta/80 shadow-lg shadow-terracotta/30 scale-110"
                : "bg-white/10 hover:bg-white/20 border border-white/20"
            }`}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-cream"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </motion.div>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-cream/70"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </button>
          <p className="text-cream/40 text-xs mt-2 tracking-wide">
            {isListening ? "Listening... tap to stop" : "Tap to speak"}
          </p>
        </div>
      )}

      {/* Live transcript */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-cream/60 text-center font-light text-sm italic mb-4 min-h-[2rem]"
          >
            &ldquo;{transcript}&rdquo;
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle to show text input */}
      {showTextInput && !showText && !isListening && (
        <button
          onClick={() => {
            setShowText(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="text-cream/30 text-xs tracking-wider hover:text-cream/50 transition-colors mx-auto block"
        >
          {hasMic ? "or type your response" : "Type your response"}
        </button>
      )}

      {/* Text input */}
      <AnimatePresence>
        {(showText || !hasMic) && showTextInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            <div className="relative">
              <textarea
                ref={inputRef}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  resetSilenceTimer();
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-cream/80 font-light text-sm placeholder:text-cream/20 focus:outline-none focus:border-sand/30 resize-none transition-colors"
              />
              {text.trim() && (
                <button
                  onClick={handleTextSubmit}
                  className="absolute right-3 bottom-3 p-2 rounded-full bg-sand/20 hover:bg-sand/30 transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-sand"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-cream/20 text-[10px] mt-1 text-center">
              Press Enter to submit
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

