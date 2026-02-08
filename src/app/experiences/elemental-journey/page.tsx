"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getAudioEngine } from "@/lib/audioEngine";
import { getVoiceEngine } from "@/lib/voiceEngine";

type Phase = "intro" | "earth" | "water" | "fire" | "air" | "spirit" | "return";

interface ElementConfig {
  phase: Phase;
  label: string;
  colors: string[];
  voiceTexts: string[];
  audioPreset: () => void;
  duration: number; // seconds
}

const PHASE_ORDER: Phase[] = ["earth", "water", "fire", "air", "spirit"];

export default function ElementalJourneyPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef(getAudioEngine());
  const voiceRef = useRef(getVoiceEngine());
  const animRef = useRef<number>(0);
  const phaseTimerRef = useRef<NodeJS.Timeout>();
  const phaseRef = useRef<Phase>("intro");

  // Keep ref in sync for canvas animation
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const getElementConfigs = useCallback((): Record<string, ElementConfig> => {
    const audio = audioRef.current;
    return {
      earth: {
        phase: "earth",
        label: "Earth",
        colors: ["#3D2B1F", "#5C4033", "#7A8B6F", "#2D1B0E"],
        voiceTexts: [
          "Close your eyes. Feel the weight of your body. Feel gravity holding you.",
          "You are the earth. Solid. Ancient. Unshakeable.",
          "Feel your roots extending deep into the ground beneath you. Drawing strength from the soil, from stone, from the deep quiet of the planet itself.",
          "You are grounded. You are stable. You are held.",
          "Whatever storm rages above, your roots hold firm. This is your foundation.",
        ],
        audioPreset: () => audio.playEarth(),
        duration: 150,
      },
      water: {
        phase: "water",
        label: "Water",
        colors: ["#1A3A4A", "#2A5A6A", "#A8BEC7", "#3A7A8A"],
        voiceTexts: [
          "Now, feel yourself softening. The earth beneath you becomes fluid.",
          "You are water. You flow around obstacles. You do not break — you reshape.",
          "Feel your emotions moving through you like currents in a deep ocean. Let them flow. Do not hold them. Do not judge them.",
          "Water finds its way. Through rock, through time, through everything. And so do you.",
          "Let go of rigidity. Surrender to the current. Trust where it carries you.",
        ],
        audioPreset: () => audio.playWater(),
        duration: 150,
      },
      fire: {
        phase: "fire",
        label: "Fire",
        colors: ["#C75B39", "#D4956A", "#D4A574", "#8B3A1A"],
        voiceTexts: [
          "Feel the warmth building in your center. A spark. Then a flame.",
          "You are fire. You are transformation itself.",
          "Whatever no longer serves you — old stories, old pain, old identities — offer them to the flame.",
          "Watch them burn. Not with violence, but with love. Fire does not destroy. It transforms.",
          "You are being forged into something new. Something stronger. Something truer.",
        ],
        audioPreset: () => audio.playFire(),
        duration: 150,
      },
      air: {
        phase: "air",
        label: "Air",
        colors: ["#D8E4E8", "#A8BEC7", "#E8F0F4", "#B8D0D8"],
        voiceTexts: [
          "The fire softens. And now — you rise.",
          "You are air. Weightless. Boundless. Free.",
          "Take a deep breath in. Feel the vastness of the sky within your lungs.",
          "Release everything you've been carrying. It floats away like a feather on the wind.",
          "You are light. You are spacious. There is room for everything and nothing at all.",
        ],
        audioPreset: () => audio.playAir(),
        duration: 150,
      },
      spirit: {
        phase: "spirit",
        label: "Spirit",
        colors: ["#2A1A3A", "#5A3A7A", "#D4A574", "#1A1020"],
        voiceTexts: [
          "And now, beyond all elements — you arrive at the center.",
          "You are spirit. You are the consciousness that witnesses earth, water, fire, and air.",
          "Feel yourself expanding. Beyond your body. Beyond this room. Beyond time itself.",
          "You are connected to everything. Every soul that has ever lived. Every star that has ever burned. You are part of the infinite web of existence.",
          "This is who you truly are. Not your thoughts. Not your fears. Not your stories. But this — this vast, luminous awareness.",
          "Hold this knowing in your heart. You can return here anytime. This is your home.",
        ],
        audioPreset: () => audio.playSpirit(),
        duration: 180,
      },
    };
  }, []);

  // Canvas particle animation
  useEffect(() => {
    if (phase === "intro" || phase === "return" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

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
      maxLife: number;
    }

    const particles: Particle[] = [];
    const configs = getElementConfigs();
    const config = configs[phase];
    if (!config) return;

    const spawn = () => {
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      let x: number, y: number, vx: number, vy: number, size: number;

      switch (phase) {
        case "earth":
          x = Math.random() * w;
          y = h + 10;
          vx = (Math.random() - 0.5) * 0.3;
          vy = -Math.random() * 0.3 - 0.1;
          size = Math.random() * 6 + 2;
          break;
        case "water":
          x = -10;
          y = Math.random() * h;
          vx = Math.random() * 1.5 + 0.3;
          vy = Math.sin(Date.now() / 1000 + y * 0.01) * 0.5;
          size = Math.random() * 4 + 1;
          break;
        case "fire":
          x = w / 2 + (Math.random() - 0.5) * w * 0.6;
          y = h;
          vx = (Math.random() - 0.5) * 1;
          vy = -Math.random() * 3 - 1;
          size = Math.random() * 5 + 1;
          break;
        case "air":
          x = Math.random() * w;
          y = Math.random() * h;
          vx = (Math.random() - 0.5) * 0.8;
          vy = -Math.random() * 0.5 - 0.2;
          size = Math.random() * 3 + 0.5;
          break;
        case "spirit":
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 50;
          x = w / 2 + Math.cos(angle) * dist;
          y = h / 2 + Math.sin(angle) * dist;
          vx = Math.cos(angle) * (Math.random() * 1.5 + 0.5);
          vy = Math.sin(angle) * (Math.random() * 1.5 + 0.5);
          size = Math.random() * 3 + 0.5;
          break;
        default:
          x = Math.random() * w;
          y = Math.random() * h;
          vx = 0;
          vy = 0;
          size = 2;
      }

      const maxLife = Math.random() * 200 + 100;
      particles.push({
        x,
        y,
        vx,
        vy,
        size,
        opacity: 0,
        color,
        life: maxLife,
        maxLife,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Spawn particles
      const spawnRate = phase === "fire" ? 3 : phase === "spirit" ? 2 : 2;
      for (let i = 0; i < spawnRate; i++) {
        if (particles.length < 300) spawn();
      }

      // Update & draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        // Fade in/out
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio > 0.8) {
          p.opacity = (1 - lifeRatio) * 5;
        } else if (lifeRatio < 0.2) {
          p.opacity = lifeRatio * 5;
        } else {
          p.opacity = Math.min(p.opacity + 0.02, 0.8);
        }

        // Water sine wave
        if (phaseRef.current === "water") {
          p.vy = Math.sin(Date.now() / 800 + p.x * 0.005) * 0.4;
        }

        if (p.life <= 0 || p.x < -50 || p.x > w + 50 || p.y < -50 || p.y > h + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();

        // Glow effect for fire and spirit
        if (phaseRef.current === "fire" || phaseRef.current === "spirit") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle =
            p.color + Math.round(p.opacity * 40).toString(16).padStart(2, "0");
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      particles.length = 0;
    };
  }, [phase, getElementConfigs]);

  const runPhase = useCallback(
    (currentPhase: Phase) => {
      setPhase(currentPhase);
      const configs = getElementConfigs();
      const config = configs[currentPhase];
      if (!config) return;

      config.audioPreset();

      // Queue all voice texts with pauses
      const items = config.voiceTexts.map((text, i) => ({
        text,
        pauseAfter: i < config.voiceTexts.length - 1 ? 4000 : 6000,
        rate: 0.8 as number,
      }));

      voiceRef.current.cancel();
      setTimeout(() => {
        voiceRef.current.enqueue(...items);
      }, 2000);

      // Auto-advance to next phase
      const currentIndex = PHASE_ORDER.indexOf(currentPhase);
      if (currentIndex < PHASE_ORDER.length - 1) {
        phaseTimerRef.current = setTimeout(() => {
          runPhase(PHASE_ORDER[currentIndex + 1]);
        }, config.duration * 1000);
      } else {
        // After spirit, transition to return
        phaseTimerRef.current = setTimeout(() => {
          setPhase("return");
          audioRef.current.fadeOut(6);
          voiceRef.current.cancel();
          setTimeout(() => {
            voiceRef.current.enqueue(
              {
                text: "When you are ready, slowly open your eyes.",
                pauseAfter: 5000,
                rate: 0.75,
              },
              {
                text: "Welcome back. Carry this feeling with you. The elements live within you, always.",
                rate: 0.8,
              }
            );
          }, 2000);
        }, config.duration * 1000);
      }
    },
    [getElementConfigs]
  );

  const startJourney = useCallback(() => {
    setIsJourneyActive(true);
    runPhase("earth");
  }, [runPhase]);

  // Cleanup
  useEffect(() => {
    const audio = audioRef.current;
    const voice = voiceRef.current;
    return () => {
      audio.stop();
      voice.cancel();
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, []);

  const bgColors: Record<Phase, string> = {
    intro: "#F5EDE3",
    earth: "#1A1412",
    water: "#0A1A2A",
    fire: "#1A0A05",
    air: "#E8F0F4",
    spirit: "#0A0510",
    return: "#F5EDE3",
  };

  const textColors: Record<Phase, string> = {
    intro: "#1A1412",
    earth: "#7A8B6F",
    water: "#A8BEC7",
    fire: "#D4956A",
    air: "#4A6A7A",
    spirit: "#D4A574",
    return: "#1A1412",
  };

  const phaseLabels: Record<Phase, string> = {
    intro: "",
    earth: "Earth",
    water: "Water",
    fire: "Fire",
    air: "Air",
    spirit: "Spirit",
    return: "",
  };

  return (
    <div
      className="min-h-screen transition-all duration-[4000ms] relative overflow-hidden"
      style={{ backgroundColor: bgColors[phase] }}
    >
      {/* Canvas for particles */}
      {phase !== "intro" && phase !== "return" && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        />
      )}

      {/* Element indicator */}
      {isJourneyActive && phase !== "return" && phase !== "intro" && (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center">
          <div className="flex items-center gap-3">
            {PHASE_ORDER.map((p) => (
              <div
                key={p}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-1000 ${
                    PHASE_ORDER.indexOf(p) <= PHASE_ORDER.indexOf(phase as typeof PHASE_ORDER[number])
                      ? "opacity-100 scale-100"
                      : "opacity-20 scale-75"
                  }`}
                  style={{
                    backgroundColor:
                      p === phase ? textColors[p] : "rgba(255,255,255,0.3)",
                  }}
                />
                <span
                  className={`text-[9px] tracking-wider uppercase transition-all duration-1000 ${
                    p === phase ? "opacity-100" : "opacity-30"
                  }`}
                  style={{ color: textColors[phase] }}
                >
                  {phaseLabels[p]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* INTRO */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 2 } }}
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
              <p className="text-sunset-gold text-xs tracking-[0.3em] uppercase mb-6">
                Spirit & Soul
              </p>
              <h1 className="font-heading text-5xl md:text-7xl font-light text-desert-night mb-6">
                Elemental
                <br />
                <span className="italic">Soul Journey</span>
              </h1>
              <p className="text-desert-night/60 font-light text-lg leading-relaxed mb-4">
                An immersive meditation through the five elements — Earth, Water,
                Fire, Air, and Spirit. Close your eyes, put on your headphones,
                and let the elements move through you.
              </p>
              <p className="text-dust text-sm mb-6">
                Duration: ~12-15 minutes
              </p>

              <div className="bg-sand/10 rounded-2xl p-6 mb-10 max-w-md mx-auto border border-sand/20">
                <p className="text-desert-night/70 font-light text-sm leading-relaxed">
                  🎧 This experience is best with <strong>headphones</strong> in a{" "}
                  <strong>dark, quiet room</strong>. When you&apos;re ready, we&apos;ll dim the
                  lights for you.
                </p>
              </div>

              <button
                onClick={startJourney}
                className="px-12 py-5 rounded-full bg-desert-night text-cream font-light tracking-wide text-lg hover:bg-desert-night/90 transition-all duration-500 shadow-lg"
              >
                I&apos;m Ready
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* ACTIVE ELEMENT PHASES */}
        {phase !== "intro" && phase !== "return" && (
          <motion.div
            key={phase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="min-h-screen flex items-center justify-center px-6 relative z-10"
          >
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, delay: 1 }}
                className="font-heading text-6xl md:text-8xl font-light tracking-wide"
                style={{ color: textColors[phase] }}
              >
                {phaseLabels[phase]}
              </motion.p>

              {/* Breathing circle */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full border mx-auto mt-16"
                style={{ borderColor: textColors[phase] + "40" }}
              />

              {/* Skip to next element */}
              {phase !== "spirit" && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  whileHover={{ opacity: 0.8 }}
                  transition={{ duration: 1, delay: 5 }}
                  onClick={() => {
                    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
                    voiceRef.current.cancel();
                    const idx = PHASE_ORDER.indexOf(phase as typeof PHASE_ORDER[number]);
                    if (idx < PHASE_ORDER.length - 1) {
                      runPhase(PHASE_ORDER[idx + 1]);
                    }
                  }}
                  className="fixed bottom-10 right-10 text-xs tracking-wider"
                  style={{ color: textColors[phase] }}
                >
                  next element →
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* RETURN */}
        {phase === "return" && (
          <motion.div
            key="return"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center max-w-xl">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 1 }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sunset-gold/20 to-terracotta/10 mx-auto mb-10 flex items-center justify-center border border-sand/20">
                  <span className="text-3xl">✦</span>
                </div>
                <h2 className="font-heading text-4xl md:text-5xl font-light text-desert-night mb-6">
                  Welcome back.
                </h2>
                <p className="text-desert-night/60 font-light text-lg leading-relaxed mb-10">
                  The elements live within you. Earth is your foundation. Water
                  is your flow. Fire is your transformation. Air is your freedom.
                  And Spirit — Spirit is who you truly are.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setPhase("intro");
                      setIsJourneyActive(false);
                    }}
                    className="px-8 py-3 rounded-full border border-sand text-sand hover:bg-sand/10 transition-all duration-500 font-light"
                  >
                    Journey Again
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

