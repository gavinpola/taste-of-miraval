"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getAudioEngine } from "@/lib/audioEngine";
import { getVoiceEngine } from "@/lib/voiceEngine";

type Stage =
  | "intro"
  | "welcome"
  | "memory"
  | "color"
  | "body"
  | "observe"
  | "release"
  | "ground";

const STAGE_LABELS: Record<Stage, string> = {
  intro: "Prepare",
  welcome: "Grounding",
  memory: "Memory",
  color: "Color",
  body: "Body",
  observe: "Observe",
  release: "Release",
  ground: "Return",
};

const COLOR_WHEEL_COLORS = [
  { angle: 0, color: "#C75B39", label: "Red — Anger, urgency" },
  { angle: 40, color: "#D4956A", label: "Orange — Anxiety, unease" },
  { angle: 80, color: "#D4A574", label: "Yellow — Fear, tension" },
  { angle: 120, color: "#7A8B6F", label: "Green — Grief, loss" },
  { angle: 160, color: "#4A7A8B", label: "Teal — Sadness, weight" },
  { angle: 200, color: "#3A5A7A", label: "Blue — Sorrow, depth" },
  { angle: 240, color: "#5A3A7A", label: "Indigo — Shame, heaviness" },
  { angle: 280, color: "#7A3A6A", label: "Violet — Hurt, longing" },
  { angle: 320, color: "#6A3A3A", label: "Dark Red — Pain, trauma" },
];

export default function HolographicMemoryPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [bodyPoint, setBodyPoint] = useState<{ x: number; y: number } | null>(null);
  const [observeTimer, setObserveTimer] = useState(45);
  const [releaseProgress, setReleaseProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef(getAudioEngine());
  const voiceRef = useRef(getVoiceEngine());
  const animFrameRef = useRef<number>(0);

  // Particle effect for release stage
  useEffect(() => {
    if (stage !== "release" || !canvasRef.current || !selectedColor) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const w = window.innerWidth;
    const h = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      life: number;
    }

    const particles: Particle[] = [];
    const goldColor = "#D4A574";
    let progress = 0;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      progress += 0.001;
      setReleaseProgress(Math.min(progress * 100, 100));

      // Spawn particles rising from body point area
      if (Math.random() > 0.3) {
        const startX = bodyPoint ? (bodyPoint.x / 100) * w : w / 2;
        const startY = bodyPoint ? (bodyPoint.y / 100) * h : h / 2;
        const mixFactor = Math.min(progress * 2, 1);
        const r1 = parseInt(selectedColor.slice(1, 3), 16);
        const g1 = parseInt(selectedColor.slice(3, 5), 16);
        const b1 = parseInt(selectedColor.slice(5, 7), 16);
        const r2 = parseInt(goldColor.slice(1, 3), 16);
        const g2 = parseInt(goldColor.slice(3, 5), 16);
        const b2 = parseInt(goldColor.slice(5, 7), 16);

        const r = Math.round(r1 + (r2 - r1) * mixFactor);
        const g = Math.round(g1 + (g2 - g1) * mixFactor);
        const b = Math.round(b1 + (b2 - b1) * mixFactor);

        particles.push({
          x: startX + (Math.random() - 0.5) * 100,
          y: startY + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 2 - 0.5,
          size: Math.random() * 4 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          color: `rgb(${r},${g},${b})`,
          life: 1,
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.005;
        p.opacity = p.life * 0.8;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace("rgb", "rgba").replace(")", `,${p.opacity})`);
        ctx.fill();
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setStage("ground"), 2000);
      }
    };

    animate();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [stage, selectedColor, bodyPoint]);

  // Observe countdown
  useEffect(() => {
    if (stage !== "observe") return;
    const interval = setInterval(() => {
      setObserveTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stage]);

  // Auto-advance from observe
  useEffect(() => {
    if (stage === "observe" && observeTimer === 0) {
      handleNextFromObserve();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observeTimer, stage]);

  const startJourney = useCallback(() => {
    setStage("welcome");
    audioRef.current.playMeditation();

    setTimeout(() => {
      voiceRef.current.enqueue(
        {
          text: "Welcome. Find a comfortable position, and gently close your eyes if you feel comfortable doing so.",
          pauseAfter: 3000,
        },
        {
          text: "Take a deep breath in... and slowly release it.",
          pauseAfter: 4000,
        },
        {
          text: "One more. Breathe in deeply... and let go.",
          pauseAfter: 4000,
        },
        {
          text: "You are safe here. There is nothing to fix, nowhere to be. Just you, in this moment.",
          pauseAfter: 3000,
          onEnd: () => setStage("memory"),
        }
      );
    }, 1500);
  }, []);

  const handleMemoryNext = useCallback(() => {
    voiceRef.current.enqueue(
      {
        text: "Good. Now, holding this memory gently, I want you to notice... What color do you associate with this feeling?",
        pauseAfter: 2000,
      },
      {
        text: "There is no right answer. Trust whatever comes to you first.",
        pauseAfter: 1000,
        onEnd: () => setStage("color"),
      }
    );
  }, []);

  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
    setTimeout(() => {
      voiceRef.current.enqueue(
        {
          text: "Beautiful. Now, keeping that color in your mind's eye...",
          pauseAfter: 2000,
        },
        {
          text: "Where in your body do you feel this? Touch the place on the silhouette where this feeling lives.",
          pauseAfter: 1000,
          onEnd: () => setStage("body"),
        }
      );
    }, 800);
  }, []);

  const handleBodySelect = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setBodyPoint({ x, y });

      setTimeout(() => {
        voiceRef.current.enqueue(
          {
            text: "I see it. Just notice that place. You don't have to change anything.",
            pauseAfter: 2000,
          },
          {
            text: "Simply observe. The color, the sensation, the weight of it. Let yourself feel it fully, without judgment.",
            pauseAfter: 1500,
            onEnd: () => setStage("observe"),
          }
        );
      }, 600);
    },
    []
  );

  const handleNextFromObserve = useCallback(() => {
    voiceRef.current.enqueue(
      {
        text: "Now, imagine sending warmth and golden light to that place in your body.",
        pauseAfter: 3000,
      },
      {
        text: "Watch as the color begins to soften... to shift... transforming into something lighter.",
        pauseAfter: 3000,
      },
      {
        text: "Let it rise. Let it release. You are letting go of what no longer serves you.",
        pauseAfter: 2000,
        onEnd: () => {
          audioRef.current.playResolution();
          setStage("release");
        },
      }
    );
  }, []);

  // Ground / return voice guidance
  useEffect(() => {
    if (stage !== "ground") return;
    const audio = audioRef.current;
    const voice = voiceRef.current;
    audio.fadeOut(4);
    voice.enqueue(
      {
        text: "Feel your feet on the ground. Wiggle your fingers. Take a deep breath.",
        pauseAfter: 4000,
      },
      {
        text: "You have done beautiful, brave work today. This practice is here for you, anytime you need it.",
        pauseAfter: 2000,
      }
    );
  }, [stage]);

  // Cleanup
  useEffect(() => {
    const audio = audioRef.current;
    const voice = voiceRef.current;
    return () => {
      audio.stop();
      voice.cancel();
    };
  }, []);

  const bgColor = selectedColor || "#1A1412";
  const isImmersive = stage !== "intro" && stage !== "ground";

  return (
    <div
      className="min-h-screen transition-colors duration-[3000ms] relative overflow-hidden"
      style={{
        backgroundColor:
          stage === "ground"
            ? "#F5EDE3"
            : stage === "intro"
            ? "#F5EDE3"
            : stage === "release"
            ? `color-mix(in srgb, ${bgColor} ${Math.max(0, 100 - releaseProgress)}%, #D4A574)`
            : isImmersive
            ? stage === "color" || stage === "body" || stage === "observe"
              ? selectedColor
                ? `color-mix(in srgb, ${selectedColor} 30%, #1A1412)`
                : "#1A1412"
              : "#1A1412"
            : "#F5EDE3",
      }}
    >
      {/* Progress bar */}
      {stage !== "intro" && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-1 px-6 py-3">
          {(Object.keys(STAGE_LABELS) as Stage[]).map((s) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`h-0.5 w-full rounded transition-all duration-1000 ${
                  (Object.keys(STAGE_LABELS) as Stage[]).indexOf(s) <=
                  (Object.keys(STAGE_LABELS) as Stage[]).indexOf(stage)
                    ? "bg-sand/80"
                    : "bg-white/10"
                }`}
              />
              <span
                className={`text-[10px] tracking-wider transition-colors duration-1000 ${
                  s === stage ? "text-sand" : "text-white/20"
                }`}
              >
                {STAGE_LABELS[s]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Canvas for release particles */}
      {stage === "release" && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-full h-full z-10 pointer-events-none"
        />
      )}

      <AnimatePresence mode="wait">
        {/* INTRO */}
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-6"
          >
            <Link
              href="/experiences"
              className="absolute top-6 left-6 text-dust hover:text-terracotta transition-colors text-sm z-50"
            >
              ← Experiences
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="text-center max-w-2xl"
            >
              <p className="text-terracotta text-xs tracking-[0.3em] uppercase mb-6">
                Healing & Transformation
              </p>
              <h1 className="font-heading text-5xl md:text-7xl font-light text-desert-night mb-6">
                Holographic Memory
                <br />
                <span className="italic">Resolution</span>
              </h1>
              <p className="text-desert-night/60 font-light text-lg leading-relaxed mb-4">
                A guided journey through color, body, and memory. Based on the
                groundbreaking work of Brent Baum, this experience gently helps
                you identify and reframe emotional patterns held in the body.
              </p>
              <p className="text-dust text-sm mb-12">
                Duration: 8-10 minutes &middot; Best with headphones
              </p>

              <button
                onClick={startJourney}
                className="px-12 py-5 rounded-full bg-terracotta text-cream font-light tracking-wide text-lg hover:bg-terracotta/90 transition-all duration-500 shadow-lg shadow-terracotta/20"
              >
                Begin
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* WELCOME / GROUNDING */}
        {stage === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="min-h-screen flex items-center justify-center"
          >
            <div className="text-center">
              {/* Breathing circle */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-40 h-40 rounded-full border border-sand/40 mx-auto mb-12 flex items-center justify-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="w-16 h-16 rounded-full bg-sand/20"
                />
              </motion.div>
              <p className="text-cream/60 font-light text-lg tracking-wide">
                Breathe...
              </p>
            </div>
          </motion.div>
        )}

        {/* MEMORY ACCESS */}
        {stage === "memory" && (
          <motion.div
            key="memory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-xl">
              <p className="text-cream/80 font-heading text-2xl md:text-3xl font-light leading-relaxed mb-12">
                Think of a memory that carries weight.
                <br />
                <span className="text-cream/50 text-xl">
                  It doesn&apos;t have to be the heaviest. Just one that comes to mind.
                </span>
              </p>
              <button
                onClick={handleMemoryNext}
                className="px-10 py-4 rounded-full border border-sand/40 text-sand hover:bg-sand/10 transition-all duration-500 font-light tracking-wide"
              >
                I have one
              </button>
            </div>
          </motion.div>
        )}

        {/* COLOR IDENTIFICATION */}
        {stage === "color" && (
          <motion.div
            key="color"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center">
              <p className="text-cream/70 font-heading text-2xl font-light mb-12">
                What color is this feeling?
              </p>

              {/* Color wheel */}
              <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
                {COLOR_WHEEL_COLORS.map((c) => {
                  const rad = (c.angle * Math.PI) / 180;
                  const radius = 42;
                  const x = 50 + radius * Math.cos(rad);
                  const y = 50 + radius * Math.sin(rad);
                  return (
                    <motion.button
                      key={c.angle}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: c.angle / 1000 }}
                      onClick={() => handleColorSelect(c.color)}
                      className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-125 cursor-pointer border-2 border-white/10 hover:border-white/40"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        backgroundColor: c.color,
                      }}
                      title={c.label}
                    />
                  );
                })}
                {/* Center glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-cream/40 text-xs tracking-wider">
                      FEEL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* BODY MAPPING */}
        {stage === "body" && (
          <motion.div
            key="body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center">
              <p className="text-cream/70 font-heading text-2xl font-light mb-8">
                Where in your body do you feel this?
              </p>
              <p className="text-cream/40 text-sm mb-8">
                Click where the feeling lives
              </p>

              {/* Body silhouette SVG */}
              <svg
                viewBox="0 0 200 500"
                className="w-48 md:w-64 mx-auto cursor-pointer"
                onClick={handleBodySelect}
              >
                {/* Simple body outline */}
                <ellipse
                  cx="100"
                  cy="50"
                  rx="30"
                  ry="38"
                  fill="none"
                  stroke="rgba(245,237,227,0.3)"
                  strokeWidth="1.5"
                />
                <path
                  d="M70 88 Q60 120 40 170 Q35 185 50 185 L70 185 Q72 155 80 140 L80 250 Q78 320 60 400 Q55 430 70 430 L90 430 Q95 400 100 350 Q105 400 110 430 L130 430 Q145 430 140 400 Q122 320 120 250 L120 140 Q128 155 130 185 L150 185 Q165 185 160 170 Q140 120 130 88 Q120 85 100 83 Q80 85 70 88Z"
                  fill="none"
                  stroke="rgba(245,237,227,0.3)"
                  strokeWidth="1.5"
                />

                {/* Selected point glow */}
                {bodyPoint && (
                  <>
                    <motion.circle
                      cx={(bodyPoint.x / 100) * 200}
                      cy={(bodyPoint.y / 100) * 500}
                      r="25"
                      fill={selectedColor || "#D4A574"}
                      opacity="0.2"
                      animate={{ r: [20, 30, 20], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.circle
                      cx={(bodyPoint.x / 100) * 200}
                      cy={(bodyPoint.y / 100) * 500}
                      r="8"
                      fill={selectedColor || "#D4A574"}
                      opacity="0.6"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </>
                )}
              </svg>
            </div>
          </motion.div>
        )}

        {/* OBSERVE */}
        {stage === "observe" && (
          <motion.div
            key="observe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="w-32 h-32 rounded-full mx-auto mb-12 flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${selectedColor}40, transparent)`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full"
                  style={{ backgroundColor: selectedColor || "#D4A574" }}
                />
              </motion.div>
              <p className="text-cream/70 font-heading text-2xl font-light mb-4">
                Just observe.
              </p>
              <p className="text-cream/40 font-light">
                {observeTimer > 0
                  ? `Sitting with this for ${observeTimer}s...`
                  : ""}
              </p>
            </div>
          </motion.div>
        )}

        {/* RELEASE */}
        {stage === "release" && (
          <motion.div
            key="release"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="min-h-screen flex items-center justify-center px-6 relative z-20"
          >
            <div className="text-center">
              <p className="text-cream/70 font-heading text-2xl font-light">
                Releasing...
              </p>
              <p className="text-cream/40 font-light mt-4 text-sm">
                Watch the color transform
              </p>
            </div>
          </motion.div>
        )}

        {/* GROUND / RETURN */}
        {stage === "ground" && (
          <motion.div
            key="ground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-xl">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sand/30 to-sunset-gold/20 mx-auto mb-10 flex items-center justify-center">
                  <span className="text-3xl">☀️</span>
                </div>
                <h2 className="font-heading text-4xl md:text-5xl font-light text-desert-night mb-6">
                  Welcome back.
                </h2>
                <p className="text-desert-night/60 font-light text-lg leading-relaxed mb-10">
                  You&apos;ve done beautiful, brave work. This practice is here for you
                  anytime you need it. Each time, the release goes a little
                  deeper.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setStage("intro");
                      setSelectedColor(null);
                      setBodyPoint(null);
                      setObserveTimer(45);
                      setReleaseProgress(0);
                    }}
                    className="px-8 py-3 rounded-full border border-sand text-sand hover:bg-sand/10 transition-all duration-500 font-light"
                  >
                    Practice Again
                  </button>
                  <Link
                    href="/"
                    className="px-8 py-3 rounded-full bg-terracotta text-cream hover:bg-terracotta/90 transition-all duration-500 font-light"
                  >
                    Return Home
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

