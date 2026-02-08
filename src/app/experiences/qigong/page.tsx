"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getAudioEngine } from "@/lib/audioEngine";
import { getVoiceEngine } from "@/lib/voiceEngine";

interface Movement {
  id: number;
  name: string;
  chinese: string;
  description: string;
  breathing: string;
  benefits: string;
  cues: string;
  // SVG pose keyframes: [startPose, midPose] as simple descriptions
  poseType: "arms-up" | "arms-wide" | "arms-forward" | "twist" | "squat" | "push" | "scoop" | "balance" | "punch" | "press";
}

const MOVEMENTS: Movement[] = [
  {
    id: 1,
    name: "Commencing Form",
    chinese: "起势 (Qǐ Shì)",
    description: "Stand with feet shoulder-width apart. Slowly raise both arms to shoulder height, palms facing down. Lower arms gently back to sides.",
    breathing: "Inhale as arms rise, exhale as they lower.",
    benefits: "Calms the mind, regulates breathing, centers your energy.",
    cues: "Shoulders relaxed. Wrists soft. Feel the weight of your arms as they float up like they're resting on water.",
    poseType: "arms-forward",
  },
  {
    id: 2,
    name: "Broadening the Chest",
    chinese: "开阔胸怀 (Kāi Kuò Xiōng Huái)",
    description: "From the starting position, open arms wide to the sides at shoulder height, palms up. Then bring them back to center.",
    breathing: "Inhale opening, exhale closing.",
    benefits: "Opens the heart center, improves lung capacity, releases tension in chest and shoulders.",
    cues: "Imagine you're embracing the entire sky. Let your chest open naturally, don't force.",
    poseType: "arms-wide",
  },
  {
    id: 3,
    name: "Painting a Rainbow",
    chinese: "挥舞彩虹 (Huī Wǔ Cǎi Hóng)",
    description: "Shift weight to one side, raising one arm overhead in an arc while the other lowers. Alternate sides like painting a rainbow across the sky.",
    breathing: "Inhale center, exhale to each side.",
    benefits: "Improves balance, stretches the waist, stimulates the spleen and stomach meridians.",
    cues: "Your body is the brush. The arc should be continuous and flowing — no stops.",
    poseType: "balance",
  },
  {
    id: 4,
    name: "Separating the Clouds",
    chinese: "轮臂分云 (Lún Bì Fēn Yún)",
    description: "Cross arms at waist level, then rise up and separate them overhead, pushing imaginary clouds apart. Lower and repeat.",
    breathing: "Inhale rising and separating, exhale lowering.",
    benefits: "Strengthens legs, opens chest and shoulders, energizes the whole body.",
    cues: "Feel the clouds parting. Your hands push through something soft but real.",
    poseType: "arms-up",
  },
  {
    id: 5,
    name: "Rolling the Arms",
    chinese: "定步倒卷肱 (Dìng Bù Dào Juǎn Gōng)",
    description: "Step back while one arm pushes forward and the other draws back in a rolling motion. Alternate sides.",
    breathing: "Inhale drawing back, exhale pushing forward.",
    benefits: "Strengthens the kidneys, improves coordination, releases stored tension.",
    cues: "Like wringing out a towel — one arm extends as the other retreats.",
    poseType: "push",
  },
  {
    id: 6,
    name: "Rowing the Boat",
    chinese: "湖心划船 (Hú Xīn Huá Chuán)",
    description: "Circle both arms forward and down, then back and up — as if rowing a boat across a calm lake.",
    breathing: "Inhale pulling back, exhale pushing forward.",
    benefits: "Massages internal organs, strengthens lower back, promotes fluid movement.",
    cues: "You're on a glass-still lake at dawn. The oars move through water effortlessly.",
    poseType: "scoop",
  },
  {
    id: 7,
    name: "Holding the Ball",
    chinese: "肩前托球 (Jiān Qián Tuō Qiú)",
    description: "Lift an imaginary ball from one side of the body, turning the waist to present it forward at shoulder height. Alternate sides.",
    breathing: "Inhale gathering, exhale presenting.",
    benefits: "Improves spleen and stomach function, develops internal energy awareness.",
    cues: "The ball has weight and warmth. Feel it between your palms — it's made of light.",
    poseType: "twist",
  },
  {
    id: 8,
    name: "Carrying the Moon",
    chinese: "转体望月 (Zhuǎn Tǐ Wàng Yuè)",
    description: "Turn your body to one side and look up, as if gazing at the moon. Both arms sweep upward with the turn. Alternate sides.",
    breathing: "Inhale turning and rising, exhale returning center.",
    benefits: "Strengthens the waist and kidneys, improves flexibility of the spine.",
    cues: "The moon is always there, even in daylight. Reach toward it with wonder.",
    poseType: "twist",
  },
  {
    id: 9,
    name: "Turning Waist, Pushing Palm",
    chinese: "转腰推掌 (Zhuǎn Yāo Tuī Zhǎng)",
    description: "Turn at the waist, drawing one hand to the hip while pushing the other palm forward. Alternate sides rhythmically.",
    breathing: "Inhale drawing in, exhale pushing out.",
    benefits: "Stimulates the spleen and liver, tones the waist, improves digestion.",
    cues: "The push is gentle but intentional. You're creating space, not forcing it.",
    poseType: "push",
  },
  {
    id: 10,
    name: "Cloud Hands",
    chinese: "云手 (Yún Shǒu)",
    description: "Move hands in alternating circles in front of the body, shifting weight side to side. The classic tai chi movement.",
    breathing: "Breathe naturally with the rhythm of the hands.",
    benefits: "Harmonizes the whole body, calms the nervous system, improves coordination.",
    cues: "Your hands are tracing the edges of clouds. They move together but independently — like two birds in flight.",
    poseType: "twist",
  },
  {
    id: 11,
    name: "Scooping the Sea",
    chinese: "捞海观天 (Lāo Hǎi Guān Tiān)",
    description: "Bend forward, scooping hands down toward the earth, then rise up and open arms wide to look at the sky.",
    breathing: "Exhale scooping down, inhale rising to the sky.",
    benefits: "Strengthens kidneys and lower back, stretches the entire posterior chain.",
    cues: "Gather the ocean in your palms, then offer it to the heavens.",
    poseType: "scoop",
  },
  {
    id: 12,
    name: "Playing with Waves",
    chinese: "推波助浪 (Tuī Bō Zhù Làng)",
    description: "Push both palms forward at chest height, then draw them back — like pushing and pulling ocean waves.",
    breathing: "Exhale pushing, inhale drawing back.",
    benefits: "Strengthens the wrists and arms, improves lung Qi, promotes relaxation.",
    cues: "The waves respond to your hands. You're not fighting the ocean — you're dancing with it.",
    poseType: "push",
  },
  {
    id: 13,
    name: "Spreading Wings",
    chinese: "飞鸽展翅 (Fēi Gē Zhǎn Chì)",
    description: "Rise onto one leg, spreading arms wide like a bird opening its wings. Hold briefly, then switch sides.",
    breathing: "Inhale spreading, exhale returning.",
    benefits: "Develops balance and concentration, opens the chest, builds leg strength.",
    cues: "You are a dove taking flight. Your wings are wide, your center is steady.",
    poseType: "balance",
  },
  {
    id: 14,
    name: "Punching",
    chinese: "伸臂冲拳 (Shēn Bì Chōng Quán)",
    description: "Punch forward with alternating fists, drawing power from the waist. Each punch is controlled and intentional.",
    breathing: "Exhale with each punch, inhale drawing back.",
    benefits: "Builds internal power, strengthens arms and core, releases frustration.",
    cues: "This is not aggression. It's directed energy. Each punch creates space for something new.",
    poseType: "punch",
  },
  {
    id: 15,
    name: "Flying Wild Goose",
    chinese: "大雁飞翔 (Dà Yàn Fēi Xiáng)",
    description: "Open arms wide and slowly flap them up and down like a wild goose in flight, rising slightly on toes with each upstroke.",
    breathing: "Inhale arms up, exhale arms down.",
    benefits: "Regulates the heart, calms the mind, promotes a sense of freedom and joy.",
    cues: "You're high above the desert. The thermals carry you. No effort — just soaring.",
    poseType: "arms-wide",
  },
  {
    id: 16,
    name: "Spinning Wheel",
    chinese: "体前抡臂 (Tǐ Qián Lūn Bì)",
    description: "Circle both arms in large vertical circles in front of the body, like turning a great wheel.",
    breathing: "Breathe naturally with the circular rhythm.",
    benefits: "Opens the shoulder joints, promotes circulation, releases stagnant energy.",
    cues: "The wheel turns slowly but with momentum. Let gravity help on the downswing.",
    poseType: "arms-forward",
  },
  {
    id: 17,
    name: "Bouncing the Ball",
    chinese: "踏步拍球 (Tà Bù Pāi Qiú)",
    description: "Step in place while bouncing an imaginary ball with alternating hands. Light and playful.",
    breathing: "Breathe naturally, matching the playful rhythm.",
    benefits: "Improves coordination and balance, stimulates the whole body, creates joyful energy.",
    cues: "Be a child again. The ball is light and bouncy — let yourself smile.",
    poseType: "balance",
  },
  {
    id: 18,
    name: "Pressing Palms to Calm",
    chinese: "按掌平气 (Àn Zhǎng Píng Qì)",
    description: "Press both palms slowly downward from chest to belly level, as if gently pressing calm into the earth.",
    breathing: "Long exhale pressing down, soft inhale rising.",
    benefits: "Grounds all the energy gathered during practice, returns the body to peaceful stillness.",
    cues: "You're pressing peace into the earth, and the earth is pressing peace into you. This is the closing. You're complete.",
    poseType: "press",
  },
];

// Simple animated SVG figure for each pose type
function PoseFigure({ type, isAnimating }: { type: Movement["poseType"]; isAnimating: boolean }) {
  const baseY = isAnimating ? [0, -5, 0] : [0];
  const armVariants: Record<string, { left: number[]; right: number[]; leftY: number[]; rightY: number[] }> = {
    "arms-up": { left: [-30, -80, -30], right: [30, 80, 30], leftY: [0, -40, 0], rightY: [0, -40, 0] },
    "arms-wide": { left: [-60, -90, -60], right: [60, 90, 60], leftY: [0, 0, 0], rightY: [0, 0, 0] },
    "arms-forward": { left: [0, -20, 0], right: [0, 20, 0], leftY: [0, -30, 0], rightY: [0, -30, 0] },
    "twist": { left: [-40, -20, -40], right: [40, 60, 40], leftY: [0, -10, 0], rightY: [0, -20, 0] },
    "squat": { left: [-30, -30, -30], right: [30, 30, 30], leftY: [0, 10, 0], rightY: [0, 10, 0] },
    "push": { left: [-10, -10, -10], right: [10, 40, 10], leftY: [0, 0, 0], rightY: [0, -30, 0] },
    "scoop": { left: [-20, -10, -20], right: [20, 10, 20], leftY: [0, 30, 0], rightY: [0, 30, 0] },
    "balance": { left: [-50, -70, -50], right: [50, 70, 50], leftY: [0, -20, 0], rightY: [0, -20, 0] },
    "punch": { left: [-20, -10, -20], right: [20, 50, 20], leftY: [0, 0, 0], rightY: [0, -25, 0] },
    "press": { left: [-15, -15, -15], right: [15, 15, 15], leftY: [0, 15, 0], rightY: [0, 15, 0] },
  };
  const arms = armVariants[type] || armVariants["arms-forward"];

  return (
    <svg viewBox="-80 -120 160 260" className="w-full h-full max-w-[200px] mx-auto">
      {/* Head */}
      <motion.circle
        cx="0" cy="-70" r="18"
        fill="none" stroke="rgba(212,165,116,0.6)" strokeWidth="1.5"
        animate={isAnimating ? { cy: [-70, -75, -70] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Body */}
      <motion.line
        x1="0" y1="-52" x2="0" y2="30"
        stroke="rgba(212,165,116,0.6)" strokeWidth="1.5"
        animate={isAnimating ? { y1: [-52, -57, -52] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Left arm */}
      <motion.line
        x1="0" y1="-40" x2={arms.left[0]} y2={arms.leftY[0]}
        stroke="rgba(212,165,116,0.6)" strokeWidth="1.5" strokeLinecap="round"
        animate={isAnimating ? { x2: arms.left, y2: arms.leftY } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Right arm */}
      <motion.line
        x1="0" y1="-40" x2={arms.right[0]} y2={arms.rightY[0]}
        stroke="rgba(212,165,116,0.6)" strokeWidth="1.5" strokeLinecap="round"
        animate={isAnimating ? { x2: arms.right, y2: arms.rightY } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Left leg */}
      <motion.line
        x1="0" y1="30" x2="-20" y2="90"
        stroke="rgba(212,165,116,0.6)" strokeWidth="1.5" strokeLinecap="round"
        animate={isAnimating ? { y1: baseY.map(v => v + 30) } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Right leg */}
      <motion.line
        x1="0" y1="30" x2="20" y2="90"
        stroke="rgba(212,165,116,0.6)" strokeWidth="1.5" strokeLinecap="round"
        animate={isAnimating ? { y1: baseY.map(v => v + 30) } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

export default function QigongPage() {
  const [mode, setMode] = useState<"explore" | "practice">("explore");
  const [selectedMovement, setSelectedMovement] = useState<number | null>(null);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const audioRef = useRef(getAudioEngine());
  const voiceRef = useRef(getVoiceEngine());
  const timerRef = useRef<NodeJS.Timeout>();

  const startPractice = useCallback(() => {
    setMode("practice");
    setPracticeIndex(0);
    setPracticeStarted(true);
    audioRef.current.playQigong();
  }, []);

  // Guided practice: speak instruction for current movement
  useEffect(() => {
    if (mode !== "practice" || !practiceStarted || isPaused) return;

    const m = MOVEMENTS[practiceIndex];
    voiceRef.current.cancel();

    voiceRef.current.enqueue(
      {
        text: `Movement ${m.id}. ${m.name}.`,
        pauseAfter: 1500,
      },
      {
        text: m.description,
        pauseAfter: 2000,
      },
      {
        text: `Breathing: ${m.breathing}`,
        pauseAfter: 1500,
      },
      {
        text: m.cues,
        pauseAfter: 8000,
        onEnd: () => {
          // Auto-advance after pause
          if (practiceIndex < MOVEMENTS.length - 1) {
            timerRef.current = setTimeout(() => {
              setPracticeIndex((prev) => prev + 1);
            }, 500);
          }
        },
      }
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [practiceIndex, mode, practiceStarted, isPaused]);

  // Cleanup
  useEffect(() => {
    const audio = audioRef.current;
    const voice = voiceRef.current;
    return () => {
      audio.stop();
      voice.cancel();
    };
  }, []);

  const currentMovement = mode === "practice" ? MOVEMENTS[practiceIndex] : null;
  const detailMovement = selectedMovement !== null ? MOVEMENTS[selectedMovement] : null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-b from-sage/10 to-cream pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/experiences"
            className="text-dust hover:text-terracotta transition-colors text-sm"
          >
            ← Experiences
          </Link>

          <div className="mt-8 text-center">
            <p className="text-sage text-xs tracking-[0.3em] uppercase mb-4">
              Movement & Energy
            </p>
            <h1 className="font-heading text-5xl md:text-7xl font-light text-desert-night mb-4">
              Qigong <span className="italic">18 Movements</span>
            </h1>
            <p className="text-desert-night/60 font-light text-lg max-w-2xl mx-auto">
              The Shibashi form — 18 flowing movements that cultivate energy,
              balance, and inner calm. Practice at your own pace or follow the
              guided sequence.
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex justify-center mt-10 gap-4">
            <button
              onClick={() => { setMode("explore"); setPracticeStarted(false); audioRef.current.stop(); voiceRef.current.cancel(); }}
              className={`px-8 py-3 rounded-full text-sm font-light tracking-wide transition-all duration-500 ${
                mode === "explore"
                  ? "bg-sage text-cream"
                  : "border border-sage/30 text-sage hover:bg-sage/10"
              }`}
            >
              Explore Movements
            </button>
            <button
              onClick={startPractice}
              className={`px-8 py-3 rounded-full text-sm font-light tracking-wide transition-all duration-500 ${
                mode === "practice"
                  ? "bg-sage text-cream"
                  : "border border-sage/30 text-sage hover:bg-sage/10"
              }`}
            >
              Guided Practice
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* EXPLORE MODE */}
        {mode === "explore" && (
          <motion.div
            key="explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto px-6 pb-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-10">
              {MOVEMENTS.map((m, i) => (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  onClick={() => setSelectedMovement(i)}
                  className={`group p-4 rounded-2xl border transition-all duration-500 text-left ${
                    selectedMovement === i
                      ? "border-sage bg-sage/10"
                      : "border-sand/20 hover:border-sage/40 bg-cream"
                  }`}
                >
                  <div className="h-20 mb-3">
                    <PoseFigure type={m.poseType} isAnimating={selectedMovement === i} />
                  </div>
                  <p className="text-[10px] text-sage font-medium">{m.id}/18</p>
                  <p className="text-sm font-heading font-light text-desert-night group-hover:text-sage transition-colors leading-tight">
                    {m.name}
                  </p>
                  <p className="text-[10px] text-dust mt-0.5">{m.chinese}</p>
                </motion.button>
              ))}
            </div>

            {/* Detail panel */}
            <AnimatePresence>
              {detailMovement && (
                <motion.div
                  key={`detail-${selectedMovement}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="mt-10 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-sage/5 to-cream border border-sage/10"
                >
                  <div className="grid md:grid-cols-[200px_1fr] gap-10">
                    <div className="h-48 md:h-full">
                      <PoseFigure type={detailMovement.poseType} isAnimating={true} />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-sage text-sm font-medium">
                          {detailMovement.id}/18
                        </span>
                        <span className="text-dust text-sm">
                          {detailMovement.chinese}
                        </span>
                      </div>
                      <h3 className="font-heading text-3xl font-light text-desert-night mb-6">
                        {detailMovement.name}
                      </h3>

                      <div className="space-y-5">
                        <div>
                          <p className="text-xs text-sage tracking-wider uppercase mb-1">
                            Movement
                          </p>
                          <p className="text-desert-night/70 font-light leading-relaxed">
                            {detailMovement.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-sage tracking-wider uppercase mb-1">
                            Breathing
                          </p>
                          <p className="text-desert-night/70 font-light">
                            {detailMovement.breathing}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-sage tracking-wider uppercase mb-1">
                            Teacher&apos;s Cue
                          </p>
                          <p className="text-desert-night/70 font-light italic">
                            &ldquo;{detailMovement.cues}&rdquo;
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-sage tracking-wider uppercase mb-1">
                            Benefits
                          </p>
                          <p className="text-desert-night/70 font-light">
                            {detailMovement.benefits}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          voiceRef.current.cancel();
                          voiceRef.current.enqueue(
                            { text: `${detailMovement.name}. ${detailMovement.description}`, pauseAfter: 1000 },
                            { text: detailMovement.cues }
                          );
                        }}
                        className="mt-6 px-6 py-2 rounded-full border border-sage/30 text-sage text-sm hover:bg-sage/10 transition-all duration-500"
                      >
                        🔊 Hear Instruction
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* PRACTICE MODE */}
        {mode === "practice" && currentMovement && (
          <motion.div
            key="practice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-6 pb-20"
          >
            {/* Progress bar */}
            <div className="mt-8 mb-12">
              <div className="flex items-center gap-1">
                {MOVEMENTS.map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-all duration-700 ${
                      i <= practiceIndex ? "bg-sage" : "bg-sage/15"
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sage text-sm mt-3">
                {practiceIndex + 1} of 18
              </p>
            </div>

            {/* Current movement */}
            <AnimatePresence mode="wait">
              <motion.div
                key={practiceIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="h-64 md:h-80 mb-8">
                  <PoseFigure type={currentMovement.poseType} isAnimating={!isPaused} />
                </div>

                <p className="text-sage text-xs tracking-[0.2em] uppercase mb-2">
                  {currentMovement.chinese}
                </p>
                <h2 className="font-heading text-4xl md:text-5xl font-light text-desert-night mb-6">
                  {currentMovement.name}
                </h2>
                <p className="text-desert-night/60 font-light text-lg max-w-xl mx-auto leading-relaxed mb-4">
                  {currentMovement.description}
                </p>
                <p className="text-sage/70 font-light italic max-w-lg mx-auto">
                  &ldquo;{currentMovement.cues}&rdquo;
                </p>

                {/* Breathing indicator */}
                <motion.div
                  animate={!isPaused ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : {}}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-full border border-sage/30 mx-auto mt-10 flex items-center justify-center"
                >
                  <span className="text-sage/60 text-xs">breathe</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => {
                  if (practiceIndex > 0) {
                    voiceRef.current.cancel();
                    setPracticeIndex((p) => p - 1);
                  }
                }}
                disabled={practiceIndex === 0}
                className="px-6 py-2 rounded-full border border-sage/30 text-sage text-sm disabled:opacity-30 hover:bg-sage/10 transition-all"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  setIsPaused(!isPaused);
                  if (!isPaused) {
                    voiceRef.current.cancel();
                  }
                }}
                className="px-8 py-3 rounded-full bg-sage text-cream text-sm hover:bg-sage/90 transition-all"
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={() => {
                  if (practiceIndex < MOVEMENTS.length - 1) {
                    voiceRef.current.cancel();
                    setPracticeIndex((p) => p + 1);
                  }
                }}
                disabled={practiceIndex === MOVEMENTS.length - 1}
                className="px-6 py-2 rounded-full border border-sage/30 text-sage text-sm disabled:opacity-30 hover:bg-sage/10 transition-all"
              >
                Next →
              </button>
            </div>

            {/* Completion */}
            {practiceIndex === MOVEMENTS.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="text-center mt-16"
              >
                <p className="text-sage font-light text-lg mb-4">
                  You&apos;ve completed all 18 movements.
                </p>
                <Link
                  href="/"
                  className="inline-block px-8 py-3 rounded-full bg-terracotta text-cream font-light hover:bg-terracotta/90 transition-all"
                >
                  Return Home
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

