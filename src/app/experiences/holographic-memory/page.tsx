"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getAudioEngine } from "@/lib/audioEngine";
import { getVoiceEngine } from "@/lib/voiceEngine";
import ResponseInput from "@/components/ResponseInput";

// ── Stage definitions ──────────────────────────────────────────────
type Stage =
  | "intro"
  | "grounding"
  | "bodyAwareness"
  | "localize"
  | "color"
  | "metaphor"
  | "describe"
  | "age"
  | "scene"
  | "narrative"
  | "reframe"
  | "healingColor"
  | "integration"
  | "returnHome";

const STAGE_ORDER: Stage[] = [
  "intro",
  "grounding",
  "bodyAwareness",
  "localize",
  "color",
  "metaphor",
  "describe",
  "age",
  "scene",
  "narrative",
  "reframe",
  "healingColor",
  "integration",
  "returnHome",
];

const STAGE_LABELS: Record<Stage, string> = {
  intro: "Prepare",
  grounding: "Ground",
  bodyAwareness: "Body",
  localize: "Locate",
  color: "Color",
  metaphor: "Shape",
  describe: "Describe",
  age: "Memory",
  scene: "Scene",
  narrative: "Story",
  reframe: "Reframe",
  healingColor: "Heal",
  integration: "Integrate",
  returnHome: "Return",
};

// ── Color wheel ────────────────────────────────────────────────────
const COLOR_WHEEL_COLORS = [
  { angle: 0, color: "#E04040", label: "Red" },
  { angle: 30, color: "#E07030", label: "Red-Orange" },
  { angle: 60, color: "#E0A030", label: "Orange" },
  { angle: 90, color: "#D4C040", label: "Yellow" },
  { angle: 120, color: "#50A050", label: "Green" },
  { angle: 150, color: "#40A0A0", label: "Teal" },
  { angle: 180, color: "#4080C0", label: "Blue" },
  { angle: 210, color: "#5050C0", label: "Indigo" },
  { angle: 240, color: "#8040C0", label: "Purple" },
  { angle: 270, color: "#A040A0", label: "Violet" },
  { angle: 300, color: "#C04080", label: "Magenta" },
  { angle: 330, color: "#C04040", label: "Crimson" },
  { angle: -1, color: "#222222", label: "Black" },
  { angle: -2, color: "#E8E8E8", label: "White" },
  { angle: -3, color: "#888888", label: "Gray" },
  { angle: -4, color: "#8B6914", label: "Brown" },
];

// ── Body area label helper ─────────────────────────────────────────
function getBodyAreaLabel(y: number): string {
  if (y < 18) return "head";
  if (y < 25) return "neck";
  if (y < 35) return "shoulders";
  if (y < 45) return "chest";
  if (y < 55) return "stomach";
  if (y < 65) return "abdomen";
  if (y < 75) return "hips";
  if (y < 88) return "legs";
  return "feet";
}

// ── Active listening: extract key phrases ──────────────────────────
function extractKeyPhrase(text: string): string {
  // Return a cleaned, shortened version suitable for reflection
  const cleaned = text
    .replace(/^(i feel |it feels |it's |its |there is |there's |i have |i see |i think |i guess |maybe |like |um |uh |well )/gi, "")
    .replace(/\.$/, "")
    .trim();
  // Truncate if very long
  if (cleaned.length > 80) {
    const words = cleaned.split(" ").slice(0, 12);
    return words.join(" ");
  }
  return cleaned || text.trim();
}

// ── Color name helper ──────────────────────────────────────────────
function getColorName(hex: string): string {
  const match = COLOR_WHEEL_COLORS.find((c) => c.color === hex);
  return match ? match.label.toLowerCase() : "that color";
}

// ════════════════════════════════════════════════════════════════════
export default function HolographicMemoryPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [bodyPoint, setBodyPoint] = useState<{ x: number; y: number } | null>(null);
  const [bodyArea, setBodyArea] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [healingColorHex, setHealingColorHex] = useState<string | null>(null);
  const [releaseProgress, setReleaseProgress] = useState(0);

  // User responses stored for active listening context
  const [, setResponses] = useState<Record<string, string>>({});

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef(getAudioEngine());
  const voiceRef = useRef(getVoiceEngine());
  const animFrameRef = useRef<number>(0);

  // Helper to store a response
  const saveResponse = useCallback((key: string, value: string) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Grounding voice sequence ─────────────────────────────────────
  const startJourney = useCallback(() => {
    setStage("grounding");
    audioRef.current.playMeditation();

    setTimeout(() => {
      voiceRef.current.enqueue(
        {
          text: "Welcome. Find a comfortable position... and gently close your eyes if you feel comfortable doing so.",
          pauseAfter: 4000,
        },
        {
          text: "Take a deep breath in... and slowly release it.",
          pauseAfter: 5000,
        },
        {
          text: "One more... breathe in deeply... and let go.",
          pauseAfter: 5000,
        },
        {
          text: "You are safe here. There is nothing to fix... nowhere to be. Just you... in this moment.",
          pauseAfter: 4000,
        },
        {
          text: "Now... gently bring your awareness to your body. Start at the top of your head... and slowly scan downward.",
          pauseAfter: 4000,
        },
        {
          text: "Notice your forehead... your jaw... your shoulders. Is there tension anywhere? A tightness... a heaviness... something that feels different?",
          pauseAfter: 4000,
        },
        {
          text: "Move down through your chest... your stomach... your hips... your legs. Just noticing... without judgment.",
          pauseAfter: 5000,
        },
        {
          text: "If there is an area that calls your attention... a place that feels tight, or heavy, or tender... that is where we will begin.",
          pauseAfter: 2000,
          onEnd: () => setStage("bodyAwareness"),
        }
      );
    }, 1500);
  }, []);

  // ── Body awareness → user taps body silhouette ───────────────────
  const handleBodySelect = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setBodyPoint({ x, y });
      const area = getBodyAreaLabel(y);
      setBodyArea(area);
      saveResponse("bodyArea", area);

      setTimeout(() => {
        voiceRef.current.enqueue(
          {
            text: `I see... your ${area}. Let's stay with that.`,
            pauseAfter: 2000,
            onEnd: () => setStage("localize"),
          }
        );
      }, 600);
    },
    [saveResponse]
  );

  // ── Localize: inside / outside / both ────────────────────────────
  const handleLocalize = useCallback(
    (choice: string) => {
      saveResponse("localize", choice);
      voiceRef.current.enqueue({
        text: `${choice === "both" ? "Both inside and outside" : choice === "inside" ? "On the inside" : "On the outside"}... thank you for noticing that.`,
        pauseAfter: 2000,
        onEnd: () => {
          voiceRef.current.enqueue({
            text: "Now... what color do you associate with this feeling? There is no right answer. Trust whatever comes to you first.",
            pauseAfter: 1000,
            onEnd: () => setStage("color"),
          });
        },
      });
    },
    [saveResponse]
  );

  // ── Color selection ──────────────────────────────────────────────
  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);
      const colorName = getColorName(color);
      saveResponse("color", colorName);

      setTimeout(() => {
        voiceRef.current.enqueue({
          text: `${colorName}... beautiful. Trust that.`,
          pauseAfter: 2000,
          onEnd: () => {
            voiceRef.current.enqueue({
              text: "Does this feeling have a shape or a size? Take a moment... and describe what you see.",
              pauseAfter: 1000,
              onEnd: () => setStage("metaphor"),
            });
          },
        });
      }, 600);
    },
    [saveResponse]
  );

  // ── Metaphor (shape/size + weight/temp/texture) ──────────────────
  const handleMetaphorResponse = useCallback(
    (text: string) => {
      const phrase = extractKeyPhrase(text);
      saveResponse("metaphor", phrase);
      voiceRef.current.enqueue({
        text: `A ${phrase}... thank you for noticing that.`,
        pauseAfter: 2000,
        onEnd: () => {
          voiceRef.current.enqueue({
            text: "Does it have a weight... a temperature... or a texture? What does it feel like?",
            pauseAfter: 1000,
            onEnd: () => setStage("describe"),
          });
        },
      });
    },
    [saveResponse]
  );

  // ── Describe (anything else) ─────────────────────────────────────
  const handleDescribeResponse = useCallback(
    (text: string) => {
      const phrase = extractKeyPhrase(text);
      saveResponse("describe", phrase);
      voiceRef.current.enqueue({
        text: `${phrase}... I hear you. Is there anything else about it you want to describe? If not... just say 'no' and we will continue.`,
        pauseAfter: 1000,
        onEnd: () => setStage("age"),
      });
    },
    [saveResponse]
  );

  // ── Age / first memory ───────────────────────────────────────────
  const handleAgeResponse = useCallback(
    (text: string) => {
      const phrase = extractKeyPhrase(text);
      saveResponse("age", phrase);

      // Try to extract a number
      const numMatch = text.match(/\d+/);
      const ageStr = numMatch ? numMatch[0] : phrase;

      voiceRef.current.enqueue({
        text: `You were ${ageStr}... that is when it started. I am right here with you.`,
        pauseAfter: 3000,
        onEnd: () => {
          voiceRef.current.enqueue({
            text: "What else do you see about this? Is there a place you are... when you first feel this?",
            pauseAfter: 1000,
            onEnd: () => setStage("scene"),
          });
        },
      });
    },
    [saveResponse]
  );

  // ── Scene ────────────────────────────────────────────────────────
  const handleSceneResponse = useCallback(
    (text: string) => {
      const phrase = extractKeyPhrase(text);
      saveResponse("scene", phrase);
      voiceRef.current.enqueue({
        text: `${phrase}... I can see it. Stay there for a moment.`,
        pauseAfter: 4000,
        onEnd: () => {
          voiceRef.current.enqueue({
            text: "Then what happens?... What happens next?",
            pauseAfter: 1000,
            onEnd: () => setStage("narrative"),
          });
        },
      });
    },
    [saveResponse]
  );

  // ── Narrative ────────────────────────────────────────────────────
  const handleNarrativeResponse = useCallback(
    (text: string) => {
      const phrase = extractKeyPhrase(text);
      saveResponse("narrative", phrase);
      voiceRef.current.enqueue({
        text: `And then... ${phrase}. Thank you for sharing that with me. You are doing incredible work.`,
        pauseAfter: 4000,
        onEnd: () => {
          voiceRef.current.enqueue({
            text: "Now... if the adult you could go back... and change this scene... what would you really like to see happen? Take the time you need.",
            pauseAfter: 1500,
            onEnd: () => setStage("reframe"),
          });
        },
      });
    },
    [saveResponse]
  );

  // ── Reframe ──────────────────────────────────────────────────────
  const handleReframeResponse = useCallback(
    (text: string) => {
      const phrase = extractKeyPhrase(text);
      saveResponse("reframe", phrase);
      voiceRef.current.enqueue({
        text: `That is beautiful... ${phrase}. Let that be what happened.`,
        pauseAfter: 4000,
        onEnd: () => {
          voiceRef.current.enqueue({
            text: "Now... what colors would you like to frame this new scene with? Choose a healing color.",
            pauseAfter: 1000,
            onEnd: () => setStage("healingColor"),
          });
        },
      });
    },
    [saveResponse]
  );

  // ── Healing color selection ──────────────────────────────────────
  const handleHealingColorSelect = useCallback(
    (color: string) => {
      setHealingColorHex(color);
      const colorName = getColorName(color);
      saveResponse("healingColor", colorName);

      audioRef.current.playResolution();

      setTimeout(() => {
        voiceRef.current.enqueue(
          {
            text: `${colorName}... beautiful.`,
            pauseAfter: 2000,
          },
          {
            text: `Now... move that ${colorName} through your body... especially your ${bodyArea || "center"}.`,
            pauseAfter: 4000,
          },
          {
            text: "Feel it wash all over the memory... and fill you from your head... to your toes.",
            pauseAfter: 6000,
          },
          {
            text: "Let it pour through you... like warm light... dissolving anything that no longer serves you.",
            pauseAfter: 5000,
            onEnd: () => setStage("integration"),
          }
        );
      }, 600);
    },
    [bodyArea, saveResponse]
  );

  // ── Integration particle effect ──────────────────────────────────
  useEffect(() => {
    if (stage !== "integration" || !canvasRef.current) return;

    const hColor = healingColorHex || "#D4A574";
    const sColor = selectedColor || "#6A3A3A";
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
    let progress = 0;

    const hexToRgb = (hex: string) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    });

    const startRgb = hexToRgb(sColor);
    const endRgb = hexToRgb(hColor);

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      progress += 0.0008;
      setReleaseProgress(Math.min(progress * 100, 100));

      const mixFactor = Math.min(progress * 2, 1);

      if (Math.random() > 0.25) {
        const startX = bodyPoint ? (bodyPoint.x / 100) * w : w / 2;
        const startY = bodyPoint ? (bodyPoint.y / 100) * h : h * 0.5;

        const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * mixFactor);
        const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * mixFactor);
        const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * mixFactor);

        particles.push({
          x: startX + (Math.random() - 0.5) * 120,
          y: startY + (Math.random() - 0.5) * 60,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2.5 - 0.5,
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
        p.life -= 0.004;
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
      }
    };

    // Voice: "How do you feel now?"
    const voiceTimer = setTimeout(() => {
      voiceRef.current.enqueue({
        text: "How do you feel now?",
        pauseAfter: 2000,
      });
    }, 8000);

    // Auto-advance to return after the animation
    const endTimer = setTimeout(() => {
      setStage("returnHome");
    }, 25000);

    animate();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(voiceTimer);
      clearTimeout(endTimer);
    };
  }, [stage, selectedColor, healingColorHex, bodyPoint]);

  // ── Return / grounding voice ─────────────────────────────────────
  useEffect(() => {
    if (stage !== "returnHome") return;
    const audio = audioRef.current;
    const voice = voiceRef.current;
    audio.fadeOut(5);
    voice.enqueue(
      {
        text: "Feel your feet on the ground... wiggle your fingers... take a deep breath.",
        pauseAfter: 5000,
      },
      {
        text: "You have done beautiful... brave work today. This practice is here for you... anytime you need it.",
        pauseAfter: 2000,
      }
    );
  }, [stage]);

  // ── Cleanup ──────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    const voice = voiceRef.current;
    return () => {
      audio.stop();
      voice.cancel();
    };
  }, []);

  // ── Silence handlers (re-ask the question) ───────────────────────
  const silenceHandlers: Partial<Record<Stage, () => void>> = {
    bodyAwareness: () =>
      voiceRef.current.enqueue({
        text: "Take your time... is there an area in your body where you feel tension... or pain... or something that wants attention? Tap where you feel it.",
        pauseAfter: 1000,
      }),
    metaphor: () =>
      voiceRef.current.enqueue({
        text: "There is no rush... does this feeling have a shape or a size? Whatever comes to mind.",
        pauseAfter: 1000,
      }),
    describe: () =>
      voiceRef.current.enqueue({
        text: "Take your time... does it have a weight... a temperature... or a texture?",
        pauseAfter: 1000,
      }),
    age: () =>
      voiceRef.current.enqueue({
        text: "How young are you when you first feel this?... Is there a number that comes to you? Trust whatever arrives.",
        pauseAfter: 1000,
      }),
    scene: () =>
      voiceRef.current.enqueue({
        text: "What else do you see?... Is there a place you are... when you first feel this?",
        pauseAfter: 1000,
      }),
    narrative: () =>
      voiceRef.current.enqueue({
        text: "Take your time... then what happens? What happens next in this memory?",
        pauseAfter: 1000,
      }),
    reframe: () =>
      voiceRef.current.enqueue({
        text: "If the adult you could go back and change this scene... what would you really like to see happen? Take the time you need.",
        pauseAfter: 1000,
      }),
  };

  // ── Stage voice prompts on entry ─────────────────────────────────
  useEffect(() => {
    if (stage === "bodyAwareness") {
      voiceRef.current.enqueue({
        text: "Is there an emotion... or an area of tension or pain in your body you need to focus on first? Touch the place on the body where you feel it.",
        pauseAfter: 1000,
      });
    } else if (stage === "localize") {
      voiceRef.current.enqueue({
        text: "Is the tension or pain on the inside... the outside... or both?",
        pauseAfter: 1000,
      });
    } else if (stage === "age") {
      voiceRef.current.enqueue({
        text: "How young are you when you first feel this?... Is there a number that comes to you?",
        pauseAfter: 1000,
      });
    }
  }, [stage]);

  // ── Background color logic ───────────────────────────────────────
  const getBackgroundColor = (): string => {
    if (stage === "intro" || stage === "returnHome") return "#F5EDE3";
    if (stage === "integration") {
      const hc = healingColorHex || "#D4A574";
      const sc = selectedColor || "#1A1412";
      const pct = Math.max(0, 100 - releaseProgress);
      return `color-mix(in srgb, ${sc} ${pct}%, ${hc})`;
    }
    if (selectedColor && ["color", "metaphor", "describe", "age", "scene", "narrative", "reframe", "healingColor"].includes(stage)) {
      return `color-mix(in srgb, ${selectedColor} 20%, #1A1412)`;
    }
    return "#1A1412";
  };

  const stageIndex = STAGE_ORDER.indexOf(stage);
  const isImmersive = stage !== "intro" && stage !== "returnHome";

  return (
    <div
      className="min-h-screen transition-colors duration-[3000ms] relative overflow-hidden"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      {/* ── Progress bar ───────────────────────────────────────── */}
      {isImmersive && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-0.5 px-4 py-2">
          {STAGE_ORDER.filter((s) => s !== "intro").map((s) => {
            const idx = STAGE_ORDER.indexOf(s);
            const isCurrent = s === stage;
            return (
              <div key={s} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className={`h-0.5 w-full rounded transition-all duration-1000 ${
                    idx <= stageIndex ? "bg-sand/70" : "bg-white/10"
                  }`}
                />
                {isCurrent && (
                  <span className="text-[9px] text-sand/60 tracking-wider hidden md:block">
                    {STAGE_LABELS[s]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Canvas for integration particles ───────────────────── */}
      {stage === "integration" && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-full h-full z-10 pointer-events-none"
        />
      )}

      <AnimatePresence mode="wait">
        {/* ══════ INTRO ═══════════════════════════════════════════ */}
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
                Healing &amp; Transformation
              </p>
              <h1 className="font-heading text-5xl md:text-7xl font-light text-desert-night mb-6">
                Holographic Memory
                <br />
                <span className="italic">Resolution</span>
              </h1>
              <p className="text-desert-night/60 font-light text-lg leading-relaxed mb-4">
                A guided journey through body, color, and memory. Based on the
                work of Brent Baum, this experience gently helps you locate
                emotions held in the body, find the memories connected to them,
                and reframe them with compassion.
              </p>
              <p className="text-dust text-sm mb-4">
                Duration: 15–25 minutes &middot; Best with headphones
              </p>
              <p className="text-dust/60 text-xs mb-12 max-w-md mx-auto">
                You will be asked to speak or type responses. Find a quiet,
                private space where you feel safe.
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

        {/* ══════ GROUNDING ══════════════════════════════════════ */}
        {stage === "grounding" && (
          <motion.div
            key="grounding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="min-h-screen flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-40 h-40 rounded-full border border-sand/40 mx-auto mb-12 flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
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

        {/* ══════ BODY AWARENESS ════════════════════════════════ */}
        {stage === "bodyAwareness" && (
          <motion.div
            key="bodyAwareness"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center">
              <p className="text-cream/70 font-heading text-2xl font-light mb-4">
                Where in your body do you feel tension or pain?
              </p>
              <p className="text-cream/40 text-sm mb-8">
                Touch the place on the body where the feeling lives
              </p>

              <svg
                viewBox="0 0 200 500"
                className="w-48 md:w-64 mx-auto cursor-pointer"
                onClick={handleBodySelect}
              >
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
                {bodyPoint && (
                  <>
                    <motion.circle
                      cx={(bodyPoint.x / 100) * 200}
                      cy={(bodyPoint.y / 100) * 500}
                      r="25"
                      fill="#D4A574"
                      opacity="0.15"
                      animate={{ r: [20, 30, 20], opacity: [0.1, 0.25, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.circle
                      cx={(bodyPoint.x / 100) * 200}
                      cy={(bodyPoint.y / 100) * 500}
                      r="8"
                      fill="#D4A574"
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

        {/* ══════ LOCALIZE ══════════════════════════════════════ */}
        {stage === "localize" && (
          <motion.div
            key="localize"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-lg">
              <p className="text-cream/70 font-heading text-2xl font-light mb-12">
                Is the tension or pain on the inside, the outside, or both?
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                {["Inside", "Outside", "Both"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleLocalize(opt.toLowerCase())}
                    className="px-8 py-4 rounded-full border border-sand/30 text-sand hover:bg-sand/10 transition-all duration-500 font-light tracking-wide"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════ COLOR ═════════════════════════════════════════ */}
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
                What color do you associate with this feeling?
              </p>

              <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto mb-8">
                {COLOR_WHEEL_COLORS.filter((c) => c.angle >= 0).map((c) => {
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
                      className="absolute w-10 h-10 md:w-14 md:h-14 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-125 cursor-pointer border-2 border-white/10 hover:border-white/40"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        backgroundColor: c.color,
                      }}
                      title={c.label}
                    />
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-cream/30 text-xs tracking-wider">
                      FEEL
                    </span>
                  </div>
                </div>
              </div>

              {/* Extra colors: black, white, gray, brown */}
              <div className="flex gap-3 justify-center">
                {COLOR_WHEEL_COLORS.filter((c) => c.angle < 0).map((c) => (
                  <button
                    key={c.label}
                    onClick={() => handleColorSelect(c.color)}
                    className="w-10 h-10 rounded-full border-2 border-white/10 hover:border-white/40 hover:scale-110 transition-all duration-300"
                    style={{ backgroundColor: c.color }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════ METAPHOR (shape/size) ═════════════════════════ */}
        {stage === "metaphor" && (
          <motion.div
            key="metaphor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-xl w-full">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="w-20 h-20 rounded-full mx-auto mb-8"
                style={{
                  background: selectedColor
                    ? `radial-gradient(circle, ${selectedColor}50, transparent)`
                    : "radial-gradient(circle, rgba(212,165,116,0.3), transparent)",
                }}
              />
              <p className="text-cream/70 font-heading text-2xl font-light mb-2">
                Does it have a shape or a size?
              </p>
              <p className="text-cream/40 text-sm mb-4">
                Describe whatever comes to mind
              </p>
              <ResponseInput
                onSubmit={handleMetaphorResponse}
                placeholder="A tight knot... a heavy stone..."
                onSilence={silenceHandlers.metaphor}
                active={stage === "metaphor"}
              />
            </div>
          </motion.div>
        )}

        {/* ══════ DESCRIBE (weight/temp/texture) ═══════════════ */}
        {stage === "describe" && (
          <motion.div
            key="describe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-xl w-full">
              <p className="text-cream/70 font-heading text-2xl font-light mb-2">
                Does it have a weight, temperature, or texture?
              </p>
              <p className="text-cream/40 text-sm mb-4">
                Is there anything else about it to describe?
              </p>
              <ResponseInput
                onSubmit={handleDescribeResponse}
                placeholder="Heavy and cold... rough edges..."
                onSilence={silenceHandlers.describe}
                active={stage === "describe"}
              />
            </div>
          </motion.div>
        )}

        {/* ══════ AGE / FIRST MEMORY ═══════════════════════════ */}
        {stage === "age" && (
          <motion.div
            key="age"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-xl w-full">
              <p className="text-cream/70 font-heading text-2xl font-light mb-2">
                How young are you when you first feel this?
              </p>
              <p className="text-cream/40 text-sm mb-4">
                Is there a number that comes to you?
              </p>
              <ResponseInput
                onSubmit={handleAgeResponse}
                placeholder="A number or age..."
                onSilence={silenceHandlers.age}
                active={stage === "age"}
              />
            </div>
          </motion.div>
        )}

        {/* ══════ SCENE ════════════════════════════════════════ */}
        {stage === "scene" && (
          <motion.div
            key="scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-xl w-full">
              <p className="text-cream/70 font-heading text-2xl font-light mb-2">
                What else do you see about this?
              </p>
              <p className="text-cream/40 text-sm mb-4">
                Is there a place you are when you first feel this?
              </p>
              <ResponseInput
                onSubmit={handleSceneResponse}
                placeholder="A room... outside... at school..."
                onSilence={silenceHandlers.scene}
                active={stage === "scene"}
              />
            </div>
          </motion.div>
        )}

        {/* ══════ NARRATIVE ════════════════════════════════════ */}
        {stage === "narrative" && (
          <motion.div
            key="narrative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-xl w-full">
              <p className="text-cream/70 font-heading text-2xl font-light mb-2">
                Then what happens?
              </p>
              <p className="text-cream/40 text-sm mb-4">
                What happens next?
              </p>
              <ResponseInput
                onSubmit={handleNarrativeResponse}
                placeholder="Tell me what happens..."
                onSilence={silenceHandlers.narrative}
                active={stage === "narrative"}
              />
            </div>
          </motion.div>
        )}

        {/* ══════ REFRAME ═════════════════════════════════════ */}
        {stage === "reframe" && (
          <motion.div
            key="reframe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-xl w-full">
              <p className="text-cream/70 font-heading text-2xl font-light mb-2">
                If the adult you could go back and change this scene...
              </p>
              <p className="text-cream/40 text-sm mb-4">
                What would you really like to see happen? Take the time you need.
              </p>
              <ResponseInput
                onSubmit={handleReframeResponse}
                placeholder="I would want to see..."
                onSilence={silenceHandlers.reframe}
                active={stage === "reframe"}
              />
            </div>
          </motion.div>
        )}

        {/* ══════ HEALING COLOR ═══════════════════════════════ */}
        {stage === "healingColor" && (
          <motion.div
            key="healingColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center">
              <p className="text-cream/70 font-heading text-2xl font-light mb-12">
                What colors would you like to frame this new scene with?
              </p>

              <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto mb-8">
                {COLOR_WHEEL_COLORS.filter((c) => c.angle >= 0).map((c) => {
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
                      onClick={() => handleHealingColorSelect(c.color)}
                      className="absolute w-10 h-10 md:w-14 md:h-14 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-125 cursor-pointer border-2 border-white/10 hover:border-white/40"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        backgroundColor: c.color,
                      }}
                      title={c.label}
                    />
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-cream/30 text-xs tracking-wider">
                      HEAL
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                {COLOR_WHEEL_COLORS.filter((c) => c.angle < 0).map((c) => (
                  <button
                    key={c.label}
                    onClick={() => handleHealingColorSelect(c.color)}
                    className="w-10 h-10 rounded-full border-2 border-white/10 hover:border-white/40 hover:scale-110 transition-all duration-300"
                    style={{ backgroundColor: c.color }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════ INTEGRATION ═════════════════════════════════ */}
        {stage === "integration" && (
          <motion.div
            key="integration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="min-h-screen flex items-center justify-center px-6 relative z-20"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 rounded-full mx-auto mb-8"
                style={{
                  background: `radial-gradient(circle, ${healingColorHex || "#D4A574"}80, transparent)`,
                }}
              />
              <p className="text-cream/70 font-heading text-2xl font-light">
                Feel the color moving through you...
              </p>
              <p className="text-cream/40 font-light mt-4 text-sm">
                From your head to your toes
              </p>
            </div>
          </motion.div>
        )}

        {/* ══════ RETURN HOME ═════════════════════════════════ */}
        {stage === "returnHome" && (
          <motion.div
            key="returnHome"
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
                  anytime you need it. Each time, the healing goes a little
                  deeper.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={() => {
                      setStage("intro");
                      setSelectedColor(null);
                      setHealingColorHex(null);
                      setBodyPoint(null);
                      setBodyArea("");
                      setReleaseProgress(0);
                      setResponses({});
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
