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
  voiceItems: { text: string; pauseAfter: number; rate?: number }[];
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
      // ═══════════════════════════════════════════════════════════
      // EARTH — 3 minutes — deep, grounding, heavy, still
      // ═══════════════════════════════════════════════════════════
      earth: {
        phase: "earth",
        label: "Earth",
        colors: ["#3D2B1F", "#5C4033", "#7A8B6F", "#2D1B0E"],
        voiceItems: [
          { text: "Close your eyes.", pauseAfter: 3000 },
          { text: "Take a breath... and let yourself arrive. There is nowhere else to be.", pauseAfter: 5000 },
          { text: "Feel the weight of your body. Feel gravity pulling you down... gently... completely.", pauseAfter: 5000 },
          { text: "You are held. The earth beneath you has been here for four and a half billion years... and it is holding you now.", pauseAfter: 6000 },
          { text: "Feel your connection to the ground. Through the soles of your feet... through your sit bones... through every point where your body meets the surface below.", pauseAfter: 6000 },
          { text: "Now... imagine roots growing from the base of your spine. Slowly... reaching down through the floor... through the soil... through layers of stone and clay and ancient rock.", pauseAfter: 8000 },
          { text: "These roots go deep. Deeper than you can see. Deeper than you can imagine. They anchor you to the center of the earth.", pauseAfter: 7000 },
          { text: "Breathe in deeply through your nose... and feel the earth's energy rising up through your roots.", pauseAfter: 6000 },
          { text: "Breathe out through your mouth... and release anything heavy. The earth can hold it. It has held heavier things than your pain.", pauseAfter: 7000 },
          { text: "You are a mountain. Storms come. Winds blow. Rain falls. And still... you are here. Solid. Unshakeable.", pauseAfter: 10000 },
          { text: "Whatever has felt unstable in your life... whatever has made you feel like the ground is shifting... know this: you have a foundation. It is always beneath you.", pauseAfter: 8000 },
          { text: "Feel the steadiness. Feel the weight. Feel the ancient, patient stillness of the earth within you.", pauseAfter: 7000 },
          { text: "You are grounded. You are stable. You are held.", pauseAfter: 12000 },
        ],
        audioPreset: () => audio.playEarth(),
        duration: 180,
      },

      // ═══════════════════════════════════════════════════════════
      // WATER — 3 minutes — flowing, emotional, surrendering
      // ═══════════════════════════════════════════════════════════
      water: {
        phase: "water",
        label: "Water",
        colors: ["#1A3A4A", "#2A5A6A", "#A8BEC7", "#3A7A8A"],
        voiceItems: [
          { text: "Now... feel yourself beginning to soften.", pauseAfter: 4000 },
          { text: "The solidity of earth... begins to dissolve. Slowly. Like ice melting in the spring sun.", pauseAfter: 5000 },
          { text: "You are water. You flow around obstacles. You do not break... you reshape.", pauseAfter: 6000 },
          { text: "Take a deep breath in... and as you exhale... let your body soften even more. Let go of any tension in your jaw... your shoulders... your hands.", pauseAfter: 7000 },
          { text: "Water does not resist. It finds its way. Through rock... through time... through everything. And so do you.", pauseAfter: 8000 },
          { text: "Feel your emotions moving through you now... like currents in a deep, dark ocean. Some are warm. Some are cold. Some you can name. Some you cannot.", pauseAfter: 8000 },
          { text: "Let them flow. Do not hold them. Do not judge them. They are not good or bad. They are just... moving through you.", pauseAfter: 7000 },
          { text: "If tears come... let them come. Tears are just water finding its way out. They are not weakness. They are release.", pauseAfter: 8000 },
          { text: "Breathe in deeply... feel the cool, flowing energy of water moving through every cell of your body.", pauseAfter: 6000 },
          { text: "Breathe out... and surrender. Surrender to the current. You do not need to know where it leads.", pauseAfter: 7000 },
          { text: "Water carved the Grand Canyon. Not through force... but through patience. Through showing up, again and again and again.", pauseAfter: 10000 },
          { text: "Let go of rigidity. Let go of control. Trust the flow.", pauseAfter: 6000 },
          { text: "You are fluid. You are adaptable. You are the deepest ocean... and the gentlest rain.", pauseAfter: 12000 },
        ],
        audioPreset: () => audio.playWater(),
        duration: 180,
      },

      // ═══════════════════════════════════════════════════════════
      // FIRE — 3.3 minutes — intense, transformative, powerful
      // ═══════════════════════════════════════════════════════════
      fire: {
        phase: "fire",
        label: "Fire",
        colors: ["#C75B39", "#D4956A", "#D4A574", "#8B3A1A"],
        voiceItems: [
          { text: "Feel the warmth building.", pauseAfter: 3000 },
          { text: "Deep in your center... a spark. Small at first. A flicker.", pauseAfter: 4000 },
          { text: "And now... it grows.", pauseAfter: 3000 },
          { text: "You are fire. You are transformation itself. Nothing stays the same in your presence.", pauseAfter: 6000 },
          { text: "Breathe in sharply through your nose... feel the oxygen feeding the flame.", pauseAfter: 5000 },
          { text: "Breathe out hard through your mouth... and feel the fire expand.", pauseAfter: 5000 },
          { text: "Again. In through the nose... stoking the fire.", pauseAfter: 4000 },
          { text: "And out through the mouth... letting it blaze.", pauseAfter: 5000 },
          { text: "Now... think of something that no longer serves you. An old story you've been telling yourself. An old pain you've been carrying. An old identity you've outgrown.", pauseAfter: 10000 },
          { text: "See it clearly. Hold it in your mind.", pauseAfter: 5000 },
          { text: "And now... offer it to the flame.", pauseAfter: 4000 },
          { text: "Watch it burn. Not with violence... but with love. Fire does not destroy. It transforms. It is the alchemist. It turns lead into gold.", pauseAfter: 10000 },
          { text: "Feel the heat. Feel the power. This is your power. This is the part of you that refuses to stay small.", pauseAfter: 8000 },
          { text: "You are being forged. Like a blade in the blacksmith's fire. The heat is not punishment. The heat is purpose.", pauseAfter: 8000 },
          { text: "Breathe in... and feel yourself becoming something new. Something stronger. Something truer.", pauseAfter: 7000 },
          { text: "You are the fire. You are the phoenix. You rise from every ending.", pauseAfter: 12000 },
        ],
        audioPreset: () => audio.playFireIntense(),
        duration: 200,
      },

      // ═══════════════════════════════════════════════════════════
      // AIR — 2.8 minutes — light, expansive, free, relief
      // ═══════════════════════════════════════════════════════════
      air: {
        phase: "air",
        label: "Air",
        colors: ["#D8E4E8", "#A8BEC7", "#E8F0F4", "#B8D0D8"],
        voiceItems: [
          { text: "The fire softens.", pauseAfter: 4000 },
          { text: "And now... you rise.", pauseAfter: 5000 },
          { text: "You are air. Weightless. Boundless. Completely free.", pauseAfter: 6000 },
          { text: "Take the deepest breath you have taken today. Fill your lungs completely. Feel your ribcage expand... your chest open... your shoulders lift.", pauseAfter: 7000 },
          { text: "And release. Let it all go. Every last molecule.", pauseAfter: 6000 },
          { text: "Feel how light you are without everything you've been carrying. Feel the spaciousness.", pauseAfter: 7000 },
          { text: "You are the sky. Not the clouds that pass through it. Not the storms that roll across it. You are the vast... eternal... open sky.", pauseAfter: 10000 },
          { text: "Breathe in... and feel yourself expanding. Beyond your body. Beyond this room. Beyond everything you thought was your boundary.", pauseAfter: 7000 },
          { text: "Breathe out... and let the last of the heaviness drift away. Like a feather caught in an updraft. Watch it go.", pauseAfter: 8000 },
          { text: "There is room here. Room for joy. Room for possibility. Room for everything you have been afraid to want.", pauseAfter: 8000 },
          { text: "You are light. You are spacious. You are free.", pauseAfter: 6000 },
          { text: "Rest here for a moment... in the open air... with nothing to carry and nowhere to fall.", pauseAfter: 12000 },
        ],
        audioPreset: () => audio.playAir(),
        duration: 170,
      },

      // ═══════════════════════════════════════════════════════════
      // SPIRIT — 3.7 minutes — transcendent, connected, manifestation
      // ═══════════════════════════════════════════════════════════
      spirit: {
        phase: "spirit",
        label: "Spirit",
        colors: ["#2A1A3A", "#5A3A7A", "#D4A574", "#1A1020"],
        voiceItems: [
          { text: "And now... beyond all elements... you arrive at the center.", pauseAfter: 5000 },
          { text: "You are spirit. You are the consciousness that witnesses earth... water... fire... and air.", pauseAfter: 6000 },
          { text: "You are not your body, though your body is sacred. You are not your emotions, though your emotions are true. You are not your thoughts, though your thoughts have power.", pauseAfter: 8000 },
          { text: "You are the awareness behind all of it. The stillness at the center of the storm.", pauseAfter: 7000 },
          { text: "Feel yourself expanding. Beyond the walls around you. Beyond the city. Beyond the mountains and the oceans.", pauseAfter: 7000 },
          { text: "You are connected to everything. Every soul that has ever lived. Every star that has ever burned. Every drop of water that has ever fallen. You are part of the infinite web of existence.", pauseAfter: 10000 },
          { text: "In this space... you can create. This is the space of manifestation.", pauseAfter: 6000 },
          { text: "I want you to picture the life you truly want. Not the life you think you should want. Not the life someone else imagined for you. Your life. The one that makes your heart say yes.", pauseAfter: 10000 },
          { text: "See it in vivid detail. Where are you? What are you doing? Who is with you? How does it feel?", pauseAfter: 10000 },
          { text: "Hold that vision. It is not fantasy. It is a blueprint. It is the first step of making it real.", pauseAfter: 8000 },
          { text: "Now... place one hand on your heart, if you can. Feel it beating. That rhythm has been with you since before you were born. It has never stopped believing in you.", pauseAfter: 8000 },
          { text: "Make a quiet promise to yourself. Not a grand resolution. Just a small, true thing. Something you will do tomorrow to move one step closer to the life you just saw.", pauseAfter: 10000 },
          { text: "This is who you truly are. Not your fears. Not your doubts. Not your past. But this... this vast, luminous, infinite awareness.", pauseAfter: 8000 },
          { text: "Hold this knowing in your heart. You can return here anytime. This is not a place you visit. This is your home.", pauseAfter: 7000 },
          { text: "You are earth. You are water. You are fire. You are air. And you are spirit.", pauseAfter: 6000 },
          { text: "You are everything... and everything is you.", pauseAfter: 15000 },
        ],
        audioPreset: () => audio.playSpirit(),
        duration: 220,
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
          x = w / 2 + (Math.random() - 0.5) * w * 0.7;
          y = h;
          vx = (Math.random() - 0.5) * 1.5;
          vy = -Math.random() * 4 - 1.5;
          size = Math.random() * 6 + 1;
          break;
        case "air":
          x = Math.random() * w;
          y = Math.random() * h;
          vx = (Math.random() - 0.5) * 0.8;
          vy = -Math.random() * 0.5 - 0.2;
          size = Math.random() * 3 + 0.5;
          break;
        case "spirit": {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 50;
          x = w / 2 + Math.cos(angle) * dist;
          y = h / 2 + Math.sin(angle) * dist;
          vx = Math.cos(angle) * (Math.random() * 1.5 + 0.5);
          vy = Math.sin(angle) * (Math.random() * 1.5 + 0.5);
          size = Math.random() * 3 + 0.5;
          break;
        }
        default:
          x = Math.random() * w;
          y = Math.random() * h;
          vx = 0;
          vy = 0;
          size = 2;
      }

      const maxLife = Math.random() * 200 + 100;
      particles.push({
        x, y, vx, vy, size,
        opacity: 0,
        color,
        life: maxLife,
        maxLife,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Spawn rate varies by element — fire spawns fastest
      const spawnRate = phase === "fire" ? 5 : phase === "spirit" ? 3 : 2;
      for (let i = 0; i < spawnRate; i++) {
        if (particles.length < 400) spawn();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

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

        // Fire flicker
        if (phaseRef.current === "fire") {
          p.vx += (Math.random() - 0.5) * 0.3;
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
          ctx.fillStyle = p.color + Math.round(p.opacity * 40).toString(16).padStart(2, "0");
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

      // Cross-fade audio: fade out old over 3s, then start new
      audioRef.current.crossFadeTo(3, () => {
        config.audioPreset();
      });

      // Cancel voice and wait 300ms to prevent skippy overlap
      voiceRef.current.cancel();
      setTimeout(() => {
        voiceRef.current.enqueue(...config.voiceItems.map(item => ({
          text: item.text,
          pauseAfter: item.pauseAfter,
          rate: item.rate ?? 0.78,
        })));
      }, 2500); // 2.5s silence at the start of each element to let the music transition

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
          audioRef.current.fadeOut(8);
          voiceRef.current.cancel();
          setTimeout(() => {
            voiceRef.current.enqueue(
              {
                text: "When you are ready... slowly... gently... begin to return.",
                pauseAfter: 6000,
                rate: 0.72,
              },
              {
                text: "Feel your body again. The weight of it. The warmth of it. Feel your fingers... your toes... the ground beneath you.",
                pauseAfter: 6000,
                rate: 0.72,
              },
              {
                text: "Take a deep breath... and when you're ready... open your eyes.",
                pauseAfter: 5000,
                rate: 0.72,
              },
              {
                text: "Welcome back. The elements live within you. Always.",
                rate: 0.75,
              }
            );
          }, 3000);
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
              <div key={p} className="flex flex-col items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-1000 ${
                    PHASE_ORDER.indexOf(p) <= PHASE_ORDER.indexOf(phase as typeof PHASE_ORDER[number])
                      ? "opacity-100 scale-100"
                      : "opacity-20 scale-75"
                  }`}
                  style={{
                    backgroundColor: p === phase ? textColors[p] : "rgba(255,255,255,0.3)",
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
                Duration: ~16 minutes
              </p>

              <div className="bg-sand/10 rounded-2xl p-6 mb-10 max-w-md mx-auto border border-sand/20">
                <p className="text-desert-night/70 font-light text-sm leading-relaxed">
                  🎧 This experience is best with <strong>headphones</strong> in a{" "}
                  <strong>dark, quiet room</strong>. Use a sleep mask if you have one. When you&apos;re ready, we&apos;ll dim the
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

              {/* Breathing circle — pulses faster for fire */}
              <motion.div
                animate={{
                  scale: phase === "fire" ? [1, 1.3, 1] : [1, 1.15, 1],
                  opacity: phase === "fire" ? [0.4, 0.9, 0.4] : [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: phase === "fire" ? 3 : 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
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
