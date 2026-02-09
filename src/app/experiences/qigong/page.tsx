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
  poseKey: string;
}

const MOVEMENTS: Movement[] = [
  {
    id: 1, name: "Commencing Form", chinese: "起势 (Qǐ Shì)",
    description: "Stand with feet shoulder-width apart. Slowly raise both arms to shoulder height, palms facing down. Lower arms gently back to sides.",
    breathing: "Inhale as arms rise, exhale as they lower.",
    benefits: "Calms the mind, regulates breathing, centers your energy.",
    cues: "Shoulders relaxed. Wrists soft. Feel the weight of your arms as they float up like they're resting on water.",
    poseKey: "commence",
  },
  {
    id: 2, name: "Broadening the Chest", chinese: "开阔胸怀 (Kāi Kuò Xiōng Huái)",
    description: "From the starting position, open arms wide to the sides at shoulder height, palms up. Then bring them back to center.",
    breathing: "Inhale opening, exhale closing.",
    benefits: "Opens the heart center, improves lung capacity, releases tension in chest and shoulders.",
    cues: "Imagine you're embracing the entire sky. Let your chest open naturally, don't force.",
    poseKey: "broaden",
  },
  {
    id: 3, name: "Painting a Rainbow", chinese: "挥舞彩虹 (Huī Wǔ Cǎi Hóng)",
    description: "Shift weight to one side, raising one arm overhead in an arc while the other lowers. Alternate sides like painting a rainbow across the sky.",
    breathing: "Inhale center, exhale to each side.",
    benefits: "Improves balance, stretches the waist, stimulates the spleen and stomach meridians.",
    cues: "Your body is the brush. The arc should be continuous and flowing — no stops.",
    poseKey: "rainbow",
  },
  {
    id: 4, name: "Separating the Clouds", chinese: "轮臂分云 (Lún Bì Fēn Yún)",
    description: "Cross arms at waist level, then rise up and separate them overhead, pushing imaginary clouds apart. Lower and repeat.",
    breathing: "Inhale rising and separating, exhale lowering.",
    benefits: "Strengthens legs, opens chest and shoulders, energizes the whole body.",
    cues: "Feel the clouds parting. Your hands push through something soft but real.",
    poseKey: "clouds",
  },
  {
    id: 5, name: "Rolling the Arms", chinese: "定步倒卷肱 (Dìng Bù Dào Juǎn Gōng)",
    description: "Step back while one arm pushes forward and the other draws back in a rolling motion. Alternate sides.",
    breathing: "Inhale drawing back, exhale pushing forward.",
    benefits: "Strengthens the kidneys, improves coordination, releases stored tension.",
    cues: "Like wringing out a towel — one arm extends as the other retreats.",
    poseKey: "rolling",
  },
  {
    id: 6, name: "Rowing the Boat", chinese: "湖心划船 (Hú Xīn Huá Chuán)",
    description: "Circle both arms forward and down, then back and up — as if rowing a boat across a calm lake.",
    breathing: "Inhale pulling back, exhale pushing forward.",
    benefits: "Massages internal organs, strengthens lower back, promotes fluid movement.",
    cues: "You're on a glass-still lake at dawn. The oars move through water effortlessly.",
    poseKey: "rowing",
  },
  {
    id: 7, name: "Holding the Ball", chinese: "肩前托球 (Jiān Qián Tuō Qiú)",
    description: "Lift an imaginary ball from one side of the body, turning the waist to present it forward at shoulder height. Alternate sides.",
    breathing: "Inhale gathering, exhale presenting.",
    benefits: "Improves spleen and stomach function, develops internal energy awareness.",
    cues: "The ball has weight and warmth. Feel it between your palms — it's made of light.",
    poseKey: "holdball",
  },
  {
    id: 8, name: "Carrying the Moon", chinese: "转体望月 (Zhuǎn Tǐ Wàng Yuè)",
    description: "Turn your body to one side and look up, as if gazing at the moon. Both arms sweep upward with the turn. Alternate sides.",
    breathing: "Inhale turning and rising, exhale returning center.",
    benefits: "Strengthens the waist and kidneys, improves flexibility of the spine.",
    cues: "The moon is always there, even in daylight. Reach toward it with wonder.",
    poseKey: "moon",
  },
  {
    id: 9, name: "Turning Waist, Pushing Palm", chinese: "转腰推掌 (Zhuǎn Yāo Tuī Zhǎng)",
    description: "Turn at the waist, drawing one hand to the hip while pushing the other palm forward. Alternate sides rhythmically.",
    breathing: "Inhale drawing in, exhale pushing out.",
    benefits: "Stimulates the spleen and liver, tones the waist, improves digestion.",
    cues: "The push is gentle but intentional. You're creating space, not forcing it.",
    poseKey: "pushpalm",
  },
  {
    id: 10, name: "Cloud Hands", chinese: "云手 (Yún Shǒu)",
    description: "Move hands in alternating circles in front of the body, shifting weight side to side. The classic tai chi movement.",
    breathing: "Breathe naturally with the rhythm of the hands.",
    benefits: "Harmonizes the whole body, calms the nervous system, improves coordination.",
    cues: "Your hands are tracing the edges of clouds. They move together but independently — like two birds in flight.",
    poseKey: "cloudhands",
  },
  {
    id: 11, name: "Scooping the Sea", chinese: "捞海观天 (Lāo Hǎi Guān Tiān)",
    description: "Bend forward, scooping hands down toward the earth, then rise up and open arms wide to look at the sky.",
    breathing: "Exhale scooping down, inhale rising to the sky.",
    benefits: "Strengthens kidneys and lower back, stretches the entire posterior chain.",
    cues: "Gather the ocean in your palms, then offer it to the heavens.",
    poseKey: "scoop",
  },
  {
    id: 12, name: "Playing with Waves", chinese: "推波助浪 (Tuī Bō Zhù Làng)",
    description: "Push both palms forward at chest height, then draw them back — like pushing and pulling ocean waves.",
    breathing: "Exhale pushing, inhale drawing back.",
    benefits: "Strengthens the wrists and arms, improves lung Qi, promotes relaxation.",
    cues: "The waves respond to your hands. You're not fighting the ocean — you're dancing with it.",
    poseKey: "waves",
  },
  {
    id: 13, name: "Spreading Wings", chinese: "飞鸽展翅 (Fēi Gē Zhǎn Chì)",
    description: "Rise onto one leg, spreading arms wide like a bird opening its wings. Hold briefly, then switch sides.",
    breathing: "Inhale spreading, exhale returning.",
    benefits: "Develops balance and concentration, opens the chest, builds leg strength.",
    cues: "You are a dove taking flight. Your wings are wide, your center is steady.",
    poseKey: "wings",
  },
  {
    id: 14, name: "Punching", chinese: "伸臂冲拳 (Shēn Bì Chōng Quán)",
    description: "Punch forward with alternating fists, drawing power from the waist. Each punch is controlled and intentional.",
    breathing: "Exhale with each punch, inhale drawing back.",
    benefits: "Builds internal power, strengthens arms and core, releases frustration.",
    cues: "This is not aggression. It's directed energy. Each punch creates space for something new.",
    poseKey: "punch",
  },
  {
    id: 15, name: "Flying Wild Goose", chinese: "大雁飞翔 (Dà Yàn Fēi Xiáng)",
    description: "Open arms wide and slowly flap them up and down like a wild goose in flight, rising slightly on toes with each upstroke.",
    breathing: "Inhale arms up, exhale arms down.",
    benefits: "Regulates the heart, calms the mind, promotes a sense of freedom and joy.",
    cues: "You're high above the desert. The thermals carry you. No effort — just soaring.",
    poseKey: "goose",
  },
  {
    id: 16, name: "Spinning Wheel", chinese: "体前抡臂 (Tǐ Qián Lūn Bì)",
    description: "Circle both arms in large vertical circles in front of the body, like turning a great wheel.",
    breathing: "Breathe naturally with the circular rhythm.",
    benefits: "Opens the shoulder joints, promotes circulation, releases stagnant energy.",
    cues: "The wheel turns slowly but with momentum. Let gravity help on the downswing.",
    poseKey: "wheel",
  },
  {
    id: 17, name: "Bouncing the Ball", chinese: "踏步拍球 (Tà Bù Pāi Qiú)",
    description: "Step in place while bouncing an imaginary ball with alternating hands. Light and playful.",
    breathing: "Breathe naturally, matching the playful rhythm.",
    benefits: "Improves coordination and balance, stimulates the whole body, creates joyful energy.",
    cues: "Be a child again. The ball is light and bouncy — let yourself smile.",
    poseKey: "bounce",
  },
  {
    id: 18, name: "Pressing Palms to Calm", chinese: "按掌平气 (Àn Zhǎng Píng Qì)",
    description: "Press both palms slowly downward from chest to belly level, as if gently pressing calm into the earth.",
    breathing: "Long exhale pressing down, soft inhale rising.",
    benefits: "Grounds all the energy gathered during practice, returns the body to peaceful stillness.",
    cues: "You're pressing peace into the earth, and the earth is pressing peace into you. This is the closing. You're complete.",
    poseKey: "press",
  },
];

// ── Beautiful full-body figure component ───────────────────────────
// Uses elegant SVG human silhouettes with smooth animated poses

interface PoseFrame {
  // Body center offset
  bodyY: number[];
  // Left arm: [shoulder → elbow → hand] as x,y pairs
  lArmElbow: [number[], number[]];
  lArmHand: [number[], number[]];
  // Right arm
  rArmElbow: [number[], number[]];
  rArmHand: [number[], number[]];
  // Left leg: knee, foot
  lKnee: [number[], number[]];
  lFoot: [number[], number[]];
  // Right leg
  rKnee: [number[], number[]];
  rFoot: [number[], number[]];
  // Head tilt
  headY: number[];
}

const POSES: Record<string, PoseFrame> = {
  commence: {
    bodyY: [0, -3, 0],
    lArmElbow: [[-18, -14, -18], [8, -8, 8]],
    lArmHand: [[-22, -28, -22], [20, -18, 20]],
    rArmElbow: [[18, 14, 18], [8, -8, 8]],
    rArmHand: [[22, 28, 22], [20, -18, 20]],
    lKnee: [[-10, -10, -10], [32, 32, 32]],
    lFoot: [[-12, -12, -12], [58, 58, 58]],
    rKnee: [[10, 10, 10], [32, 32, 32]],
    rFoot: [[12, 12, 12], [58, 58, 58]],
    headY: [-32, -35, -32],
  },
  broaden: {
    bodyY: [0, 0, 0],
    lArmElbow: [[-22, -32, -22], [0, -4, 0]],
    lArmHand: [[-30, -52, -30], [8, -6, 8]],
    rArmElbow: [[22, 32, 22], [0, -4, 0]],
    rArmHand: [[30, 52, 30], [8, -6, 8]],
    lKnee: [[-10, -10, -10], [32, 32, 32]],
    lFoot: [[-12, -12, -12], [58, 58, 58]],
    rKnee: [[10, 10, 10], [32, 32, 32]],
    rFoot: [[12, 12, 12], [58, 58, 58]],
    headY: [-32, -32, -32],
  },
  rainbow: {
    bodyY: [0, 0, 0],
    lArmElbow: [[-20, -8, -20], [-6, -24, -6]],
    lArmHand: [[-26, -4, -26], [-14, -42, -14]],
    rArmElbow: [[20, 28, 20], [4, 8, 4]],
    rArmHand: [[26, 36, 26], [14, 18, 14]],
    lKnee: [[-10, -8, -10], [32, 30, 32]],
    lFoot: [[-12, -10, -12], [58, 56, 58]],
    rKnee: [[10, 12, 10], [32, 34, 32]],
    rFoot: [[12, 14, 12], [58, 60, 58]],
    headY: [-32, -34, -32],
  },
  clouds: {
    bodyY: [0, -4, 0],
    lArmElbow: [[-16, -12, -16], [4, -20, 4]],
    lArmHand: [[-20, -18, -20], [12, -38, 12]],
    rArmElbow: [[16, 12, 16], [4, -20, 4]],
    rArmHand: [[20, 18, 20], [12, -38, 12]],
    lKnee: [[-10, -10, -10], [32, 28, 32]],
    lFoot: [[-12, -12, -12], [58, 54, 58]],
    rKnee: [[10, 10, 10], [32, 28, 32]],
    rFoot: [[12, 12, 12], [58, 54, 58]],
    headY: [-32, -36, -32],
  },
  rolling: {
    bodyY: [0, 0, 0],
    lArmElbow: [[-16, -20, -16], [2, 6, 2]],
    lArmHand: [[-10, -24, -10], [-6, 14, -6]],
    rArmElbow: [[18, 14, 18], [0, -8, 0]],
    rArmHand: [[28, 8, 28], [-8, -20, -8]],
    lKnee: [[-10, -10, -10], [32, 32, 32]],
    lFoot: [[-12, -12, -12], [58, 58, 58]],
    rKnee: [[10, 10, 10], [32, 32, 32]],
    rFoot: [[12, 12, 12], [58, 58, 58]],
    headY: [-32, -32, -32],
  },
  rowing: {
    bodyY: [0, 2, 0],
    lArmElbow: [[-14, -16, -14], [-2, 10, -2]],
    lArmHand: [[-18, -20, -18], [-12, 22, -12]],
    rArmElbow: [[14, 16, 14], [-2, 10, -2]],
    rArmHand: [[18, 20, 18], [-12, 22, -12]],
    lKnee: [[-10, -10, -10], [32, 34, 32]],
    lFoot: [[-12, -12, -12], [58, 60, 58]],
    rKnee: [[10, 10, 10], [32, 34, 32]],
    rFoot: [[12, 12, 12], [58, 60, 58]],
    headY: [-32, -30, -32],
  },
  holdball: {
    bodyY: [0, 0, 0],
    lArmElbow: [[-18, -10, -18], [2, -4, 2]],
    lArmHand: [[-12, 4, -12], [-6, -12, -6]],
    rArmElbow: [[18, 14, 18], [6, 2, 6]],
    rArmHand: [[12, 6, 12], [14, 8, 14]],
    lKnee: [[-10, -8, -10], [32, 30, 32]],
    lFoot: [[-12, -10, -12], [58, 56, 58]],
    rKnee: [[10, 12, 10], [32, 34, 32]],
    rFoot: [[12, 14, 12], [58, 60, 58]],
    headY: [-32, -33, -32],
  },
  moon: {
    bodyY: [0, -1, 0],
    lArmElbow: [[-16, -6, -16], [0, -18, 0]],
    lArmHand: [[-20, 2, -20], [-8, -36, -8]],
    rArmElbow: [[18, 12, 18], [2, -16, 2]],
    rArmHand: [[24, 8, 24], [-4, -34, -4]],
    lKnee: [[-10, -8, -10], [32, 30, 32]],
    lFoot: [[-12, -10, -12], [58, 56, 58]],
    rKnee: [[10, 12, 10], [32, 34, 32]],
    rFoot: [[12, 14, 12], [58, 60, 58]],
    headY: [-32, -35, -32],
  },
  pushpalm: {
    bodyY: [0, 0, 0],
    lArmElbow: [[-16, -18, -16], [4, 6, 4]],
    lArmHand: [[-8, -10, -8], [10, 12, 10]],
    rArmElbow: [[16, 22, 16], [0, -6, 0]],
    rArmHand: [[22, 38, 22], [-4, -14, -4]],
    lKnee: [[-10, -8, -10], [32, 30, 32]],
    lFoot: [[-12, -10, -12], [58, 56, 58]],
    rKnee: [[10, 12, 10], [32, 34, 32]],
    rFoot: [[12, 14, 12], [58, 60, 58]],
    headY: [-32, -32, -32],
  },
  cloudhands: {
    bodyY: [0, 0, 0],
    lArmElbow: [[-16, -10, -16], [0, -8, 0]],
    lArmHand: [[-8, 4, -8], [-8, -16, -8]],
    rArmElbow: [[16, 20, 16], [4, 8, 4]],
    rArmHand: [[8, 14, 8], [12, 16, 12]],
    lKnee: [[-10, -12, -10], [32, 34, 32]],
    lFoot: [[-12, -14, -12], [58, 60, 58]],
    rKnee: [[10, 8, 10], [32, 30, 32]],
    rFoot: [[12, 10, 12], [58, 56, 58]],
    headY: [-32, -32, -32],
  },
  scoop: {
    bodyY: [0, 4, 0],
    lArmElbow: [[-16, -14, -16], [-4, 16, -4]],
    lArmHand: [[-20, -16, -20], [-12, 30, -12]],
    rArmElbow: [[16, 14, 16], [-4, 16, -4]],
    rArmHand: [[20, 16, 20], [-12, 30, -12]],
    lKnee: [[-10, -10, -10], [32, 36, 32]],
    lFoot: [[-12, -12, -12], [58, 62, 58]],
    rKnee: [[10, 10, 10], [32, 36, 32]],
    rFoot: [[12, 12, 12], [58, 62, 58]],
    headY: [-32, -26, -32],
  },
  waves: {
    bodyY: [0, 0, 0],
    lArmElbow: [[-14, -12, -14], [0, -6, 0]],
    lArmHand: [[-6, 6, -6], [-4, -16, -4]],
    rArmElbow: [[14, 12, 14], [0, -6, 0]],
    rArmHand: [[6, -6, 6], [-4, -16, -4]],
    lKnee: [[-10, -10, -10], [32, 32, 32]],
    lFoot: [[-12, -12, -12], [58, 58, 58]],
    rKnee: [[10, 10, 10], [32, 32, 32]],
    rFoot: [[12, 12, 12], [58, 58, 58]],
    headY: [-32, -33, -32],
  },
  wings: {
    bodyY: [0, -2, 0],
    lArmElbow: [[-22, -30, -22], [0, -8, 0]],
    lArmHand: [[-32, -48, -32], [4, -12, 4]],
    rArmElbow: [[22, 30, 22], [0, -8, 0]],
    rArmHand: [[32, 48, 32], [4, -12, 4]],
    lKnee: [[-10, -6, -10], [32, 28, 32]],
    lFoot: [[-12, -4, -12], [58, 50, 58]],
    rKnee: [[10, 10, 10], [32, 32, 32]],
    rFoot: [[12, 12, 12], [58, 58, 58]],
    headY: [-32, -34, -32],
  },
  punch: {
    bodyY: [0, 0, 0],
    lArmElbow: [[-16, -18, -16], [2, 4, 2]],
    lArmHand: [[-8, -12, -8], [8, 10, 8]],
    rArmElbow: [[16, 20, 16], [0, -4, 0]],
    rArmHand: [[24, 42, 24], [-2, -10, -2]],
    lKnee: [[-10, -10, -10], [32, 34, 32]],
    lFoot: [[-12, -12, -12], [58, 60, 58]],
    rKnee: [[10, 10, 10], [32, 30, 32]],
    rFoot: [[12, 12, 12], [58, 56, 58]],
    headY: [-32, -32, -32],
  },
  goose: {
    bodyY: [0, -4, 0],
    lArmElbow: [[-24, -28, -24], [2, -14, 2]],
    lArmHand: [[-34, -44, -34], [8, -22, 8]],
    rArmElbow: [[24, 28, 24], [2, -14, 2]],
    rArmHand: [[34, 44, 34], [8, -22, 8]],
    lKnee: [[-10, -10, -10], [32, 30, 32]],
    lFoot: [[-12, -12, -12], [58, 54, 58]],
    rKnee: [[10, 10, 10], [32, 30, 32]],
    rFoot: [[12, 12, 12], [58, 54, 58]],
    headY: [-32, -36, -32],
  },
  wheel: {
    bodyY: [0, 0, 0],
    lArmElbow: [[-14, -8, -14], [0, -20, 0]],
    lArmHand: [[-18, 2, -18], [-8, -38, -8]],
    rArmElbow: [[14, 8, 14], [0, 20, 0]],
    rArmHand: [[18, -2, 18], [-8, 38, -8]],
    lKnee: [[-10, -10, -10], [32, 32, 32]],
    lFoot: [[-12, -12, -12], [58, 58, 58]],
    rKnee: [[10, 10, 10], [32, 32, 32]],
    rFoot: [[12, 12, 12], [58, 58, 58]],
    headY: [-32, -33, -32],
  },
  bounce: {
    bodyY: [0, -3, 0],
    lArmElbow: [[-16, -18, -16], [4, 0, 4]],
    lArmHand: [[-20, -22, -20], [12, 4, 12]],
    rArmElbow: [[16, 14, 16], [4, -4, 4]],
    rArmHand: [[20, 10, 20], [12, -8, 12]],
    lKnee: [[-10, -12, -10], [32, 28, 32]],
    lFoot: [[-12, -14, -12], [58, 54, 58]],
    rKnee: [[10, 8, 10], [32, 34, 32]],
    rFoot: [[12, 6, 12], [58, 60, 58]],
    headY: [-32, -35, -32],
  },
  press: {
    bodyY: [0, 2, 0],
    lArmElbow: [[-14, -14, -14], [0, 6, 0]],
    lArmHand: [[-16, -16, -16], [-4, 16, -4]],
    rArmElbow: [[14, 14, 14], [0, 6, 0]],
    rArmHand: [[16, 16, 16], [-4, 16, -4]],
    lKnee: [[-10, -10, -10], [32, 34, 32]],
    lFoot: [[-12, -12, -12], [58, 60, 58]],
    rKnee: [[10, 10, 10], [32, 34, 32]],
    rFoot: [[12, 12, 12], [58, 60, 58]],
    headY: [-32, -30, -32],
  },
};

function HumanFigure({ poseKey, isAnimating, color = "sand" }: { poseKey: string; isAnimating: boolean; color?: string }) {
  const pose = POSES[poseKey] || POSES.commence;
  const dur = 5;
  const ease = "easeInOut";

  // Color palette
  const colors = {
    sand: { fill: "rgba(212,165,116,0.12)", stroke: "rgba(212,165,116,0.5)", glow: "rgba(212,165,116,0.08)", joint: "rgba(212,165,116,0.35)" },
    sage: { fill: "rgba(120,140,100,0.12)", stroke: "rgba(120,140,100,0.5)", glow: "rgba(120,140,100,0.08)", joint: "rgba(120,140,100,0.35)" },
    cream: { fill: "rgba(245,237,227,0.12)", stroke: "rgba(245,237,227,0.45)", glow: "rgba(245,237,227,0.06)", joint: "rgba(245,237,227,0.3)" },
  };
  const c = colors[color as keyof typeof colors] || colors.sand;

  const shoulderY = 0;

  return (
    <svg viewBox="-60 -50 120 120" className="w-full h-full">
      {/* Ambient glow behind figure */}
      <defs>
        <radialGradient id={`glow-${poseKey}`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor={c.glow} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id={`soft-${poseKey}`}>
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>
      <ellipse cx="0" cy="10" rx="40" ry="50" fill={`url(#glow-${poseKey})`} />

      {/* HEAD - elegant oval */}
      <motion.ellipse
        cx="0"
        rx="6.5"
        ry="7.5"
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth="1.2"
        animate={isAnimating ? { cy: pose.headY } : { cy: pose.headY[0] }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />

      {/* NECK */}
      <motion.line
        x1="0" x2="0"
        stroke={c.stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        animate={isAnimating ? {
          y1: pose.headY.map(v => v + 7.5),
          y2: pose.bodyY.map(v => v + shoulderY - 4),
        } : {
          y1: pose.headY[0] + 7.5,
          y2: pose.bodyY[0] + shoulderY - 4,
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />

      {/* TORSO - elegant curved shape */}
      <motion.path
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth="1"
        strokeLinejoin="round"
        animate={isAnimating ? {
          d: pose.bodyY.map(v => {
            const sy = v + shoulderY - 4;
            const hy = v + 22;
            return `M-10,${sy} Q-12,${sy + 8} -10,${hy} L10,${hy} Q12,${sy + 8} 10,${sy} Q4,${sy - 2} 0,${sy - 2} Q-4,${sy - 2} -10,${sy} Z`;
          })
        } : {
          d: (() => {
            const v = pose.bodyY[0];
            const sy = v + shoulderY - 4;
            const hy = v + 22;
            return `M-10,${sy} Q-12,${sy + 8} -10,${hy} L10,${hy} Q12,${sy + 8} 10,${sy} Q4,${sy - 2} 0,${sy - 2} Q-4,${sy - 2} -10,${sy} Z`;
          })()
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />

      {/* LEFT ARM - upper */}
      <motion.line
        stroke={c.stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        animate={isAnimating ? {
          x1: pose.bodyY.map(() => -10),
          y1: pose.bodyY.map(v => v + shoulderY),
          x2: pose.lArmElbow[0],
          y2: pose.lArmElbow[1],
        } : {
          x1: -10, y1: pose.bodyY[0] + shoulderY,
          x2: pose.lArmElbow[0][0], y2: pose.lArmElbow[1][0],
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />
      {/* LEFT ARM - forearm */}
      <motion.line
        stroke={c.stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={isAnimating ? {
          x1: pose.lArmElbow[0],
          y1: pose.lArmElbow[1],
          x2: pose.lArmHand[0],
          y2: pose.lArmHand[1],
        } : {
          x1: pose.lArmElbow[0][0], y1: pose.lArmElbow[1][0],
          x2: pose.lArmHand[0][0], y2: pose.lArmHand[1][0],
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />
      {/* LEFT HAND - circle */}
      <motion.circle
        r="2.5"
        fill={c.joint}
        stroke={c.stroke}
        strokeWidth="0.6"
        animate={isAnimating ? {
          cx: pose.lArmHand[0],
          cy: pose.lArmHand[1],
        } : {
          cx: pose.lArmHand[0][0], cy: pose.lArmHand[1][0],
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />

      {/* RIGHT ARM - upper */}
      <motion.line
        stroke={c.stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        animate={isAnimating ? {
          x1: pose.bodyY.map(() => 10),
          y1: pose.bodyY.map(v => v + shoulderY),
          x2: pose.rArmElbow[0],
          y2: pose.rArmElbow[1],
        } : {
          x1: 10, y1: pose.bodyY[0] + shoulderY,
          x2: pose.rArmElbow[0][0], y2: pose.rArmElbow[1][0],
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />
      {/* RIGHT ARM - forearm */}
      <motion.line
        stroke={c.stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={isAnimating ? {
          x1: pose.rArmElbow[0],
          y1: pose.rArmElbow[1],
          x2: pose.rArmHand[0],
          y2: pose.rArmHand[1],
        } : {
          x1: pose.rArmElbow[0][0], y1: pose.rArmElbow[1][0],
          x2: pose.rArmHand[0][0], y2: pose.rArmHand[1][0],
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />
      {/* RIGHT HAND - circle */}
      <motion.circle
        r="2.5"
        fill={c.joint}
        stroke={c.stroke}
        strokeWidth="0.6"
        animate={isAnimating ? {
          cx: pose.rArmHand[0],
          cy: pose.rArmHand[1],
        } : {
          cx: pose.rArmHand[0][0], cy: pose.rArmHand[1][0],
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />

      {/* LEFT LEG - upper */}
      <motion.line
        stroke={c.stroke}
        strokeWidth="2"
        strokeLinecap="round"
        animate={isAnimating ? {
          x1: pose.bodyY.map(() => -4),
          y1: pose.bodyY.map(v => v + 22),
          x2: pose.lKnee[0],
          y2: pose.lKnee[1],
        } : {
          x1: -4, y1: pose.bodyY[0] + 22,
          x2: pose.lKnee[0][0], y2: pose.lKnee[1][0],
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />
      {/* LEFT LEG - lower */}
      <motion.line
        stroke={c.stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        animate={isAnimating ? {
          x1: pose.lKnee[0],
          y1: pose.lKnee[1],
          x2: pose.lFoot[0],
          y2: pose.lFoot[1],
        } : {
          x1: pose.lKnee[0][0], y1: pose.lKnee[1][0],
          x2: pose.lFoot[0][0], y2: pose.lFoot[1][0],
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />

      {/* RIGHT LEG - upper */}
      <motion.line
        stroke={c.stroke}
        strokeWidth="2"
        strokeLinecap="round"
        animate={isAnimating ? {
          x1: pose.bodyY.map(() => 4),
          y1: pose.bodyY.map(v => v + 22),
          x2: pose.rKnee[0],
          y2: pose.rKnee[1],
        } : {
          x1: 4, y1: pose.bodyY[0] + 22,
          x2: pose.rKnee[0][0], y2: pose.rKnee[1][0],
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />
      {/* RIGHT LEG - lower */}
      <motion.line
        stroke={c.stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        animate={isAnimating ? {
          x1: pose.rKnee[0],
          y1: pose.rKnee[1],
          x2: pose.rFoot[0],
          y2: pose.rFoot[1],
        } : {
          x1: pose.rKnee[0][0], y1: pose.rKnee[1][0],
          x2: pose.rFoot[0][0], y2: pose.rFoot[1][0],
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />

      {/* FEET - small ellipses */}
      <motion.ellipse
        rx="3.5" ry="1.5"
        fill={c.joint}
        animate={isAnimating ? {
          cx: pose.lFoot[0],
          cy: pose.lFoot[1].map(v => v + 1),
        } : {
          cx: pose.lFoot[0][0], cy: pose.lFoot[1][0] + 1,
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />
      <motion.ellipse
        rx="3.5" ry="1.5"
        fill={c.joint}
        animate={isAnimating ? {
          cx: pose.rFoot[0],
          cy: pose.rFoot[1].map(v => v + 1),
        } : {
          cx: pose.rFoot[0][0], cy: pose.rFoot[1][0] + 1,
        }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />

      {/* Elbow joints - subtle */}
      <motion.circle
        r="1.5"
        fill={c.joint}
        animate={isAnimating ? { cx: pose.lArmElbow[0], cy: pose.lArmElbow[1] } : { cx: pose.lArmElbow[0][0], cy: pose.lArmElbow[1][0] }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />
      <motion.circle
        r="1.5"
        fill={c.joint}
        animate={isAnimating ? { cx: pose.rArmElbow[0], cy: pose.rArmElbow[1] } : { cx: pose.rArmElbow[0][0], cy: pose.rArmElbow[1][0] }}
        transition={{ duration: dur, repeat: Infinity, ease, repeatType: "loop" }}
      />
    </svg>
  );
}


// ── Main Page ─────────────────────────────────────────────────────
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

    // Small delay to let cancel finish before starting new speech
    const startDelay = setTimeout(() => {
      voiceRef.current.enqueue(
        {
          text: `Movement ${m.id}... ${m.name}.`,
          pauseAfter: 2500,
        },
        {
          text: m.description,
          pauseAfter: 3000,
        },
        {
          text: m.breathing,
          pauseAfter: 2000,
        },
        {
          text: m.cues,
          pauseAfter: 10000,
          onEnd: () => {
            if (practiceIndex < MOVEMENTS.length - 1) {
              timerRef.current = setTimeout(() => {
                setPracticeIndex((prev) => prev + 1);
              }, 500);
            }
          },
        }
      );
    }, 300);

    return () => {
      clearTimeout(startDelay);
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
    <div className="min-h-screen bg-[#0F1A12]">

      {/* ── Intro header ──────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2e1a]/60 via-[#0F1A12] to-[#0F1A12]" />
        {/* Subtle particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-sage/40"
              style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 6 + i, repeat: Infinity, delay: i * 0.8 }}
            />
          ))}
        </div>

        <div className="relative pt-28 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/experiences"
              className="text-sage/50 hover:text-sage transition-colors text-sm"
            >
              ← Experiences
            </Link>

            <div className="mt-10 text-center">
              <p className="text-sage/60 text-xs tracking-[0.4em] uppercase mb-5">
                Movement &middot; Breath &middot; Energy
              </p>
              <h1 className="font-heading text-5xl md:text-7xl font-light text-cream/90 mb-5">
                Qigong{" "}
                <span className="italic text-sage/70">18 Movements</span>
              </h1>
              <p className="text-cream/40 font-light text-lg max-w-2xl mx-auto leading-relaxed">
                The Shibashi form — 18 flowing movements that cultivate energy,
                balance, and inner calm. Follow the guided sequence or explore
                each movement at your own pace.
              </p>
            </div>

            {/* Mode toggle */}
            <div className="flex justify-center mt-12 gap-4">
              <button
                onClick={() => {
                  setMode("explore");
                  setPracticeStarted(false);
                  audioRef.current.stop();
                  voiceRef.current.cancel();
                }}
                className={`px-8 py-3.5 rounded-full text-sm font-light tracking-wide transition-all duration-500 ${
                  mode === "explore"
                    ? "bg-sage/20 text-sage border border-sage/40"
                    : "border border-cream/10 text-cream/40 hover:text-cream/60 hover:border-cream/20"
                }`}
              >
                Explore Movements
              </button>
              <button
                onClick={startPractice}
                className={`px-8 py-3.5 rounded-full text-sm font-light tracking-wide transition-all duration-500 ${
                  mode === "practice"
                    ? "bg-sage/20 text-sage border border-sage/40"
                    : "border border-cream/10 text-cream/40 hover:text-cream/60 hover:border-cream/20"
                }`}
              >
                Guided Practice
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ══════ EXPLORE MODE ════════════════════════════════════ */}
        {mode === "explore" && (
          <motion.div
            key="explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto px-6 pb-24"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
              {MOVEMENTS.map((m, i) => (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  onClick={() => setSelectedMovement(selectedMovement === i ? null : i)}
                  className={`group p-3 rounded-2xl border transition-all duration-500 text-left relative overflow-hidden ${
                    selectedMovement === i
                      ? "border-sage/40 bg-sage/10"
                      : "border-cream/5 hover:border-sage/20 bg-cream/[0.02] hover:bg-cream/[0.04]"
                  }`}
                >
                  <div className="h-24 mb-2 flex items-center justify-center">
                    <HumanFigure
                      poseKey={m.poseKey}
                      isAnimating={selectedMovement === i}
                      color={selectedMovement === i ? "sage" : "cream"}
                    />
                  </div>
                  <p className="text-[9px] text-sage/60 font-medium tracking-wider">
                    {String(m.id).padStart(2, "0")}
                  </p>
                  <p className="text-xs font-heading font-light text-cream/70 group-hover:text-sage/80 transition-colors leading-tight">
                    {m.name}
                  </p>
                  <p className="text-[9px] text-cream/25 mt-0.5">{m.chinese}</p>
                </motion.button>
              ))}
            </div>

            {/* Detail panel */}
            <AnimatePresence>
              {detailMovement && (
                <motion.div
                  key={`detail-${selectedMovement}`}
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mt-8 overflow-hidden"
                >
                  <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-sage/[0.06] to-transparent border border-sage/10">
                    <div className="grid md:grid-cols-[240px_1fr] gap-10 items-start">
                      {/* Figure */}
                      <div className="h-56 md:h-72 flex items-center justify-center">
                        <HumanFigure poseKey={detailMovement.poseKey} isAnimating={true} color="sage" />
                      </div>

                      {/* Details */}
                      <div>
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-sage/70 text-sm font-medium tracking-wider">
                            {String(detailMovement.id).padStart(2, "0")}/18
                          </span>
                          <span className="text-cream/30 text-sm">{detailMovement.chinese}</span>
                        </div>
                        <h3 className="font-heading text-3xl md:text-4xl font-light text-cream/90 mb-8">
                          {detailMovement.name}
                        </h3>

                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] text-sage/60 tracking-[0.2em] uppercase mb-1.5">
                              How to Move
                            </p>
                            <p className="text-cream/60 font-light leading-relaxed">
                              {detailMovement.description}
                            </p>
                          </div>
                          <div className="flex gap-8">
                            <div className="flex-1">
                              <p className="text-[10px] text-sage/60 tracking-[0.2em] uppercase mb-1.5">
                                Breathing
                              </p>
                              <p className="text-cream/60 font-light text-sm">
                                {detailMovement.breathing}
                              </p>
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] text-sage/60 tracking-[0.2em] uppercase mb-1.5">
                                Benefits
                              </p>
                              <p className="text-cream/60 font-light text-sm">
                                {detailMovement.benefits}
                              </p>
                            </div>
                          </div>
                          <div className="p-5 rounded-2xl bg-sage/[0.06] border border-sage/10">
                            <p className="text-[10px] text-sage/60 tracking-[0.2em] uppercase mb-2">
                              Teacher&apos;s Cue
                            </p>
                            <p className="text-cream/50 font-light italic leading-relaxed">
                              &ldquo;{detailMovement.cues}&rdquo;
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            voiceRef.current.cancel();
                            setTimeout(() => {
                              voiceRef.current.enqueue(
                                { text: `${detailMovement.name}.`, pauseAfter: 1500 },
                                { text: detailMovement.description, pauseAfter: 2000 },
                                { text: detailMovement.breathing, pauseAfter: 1500 },
                                { text: detailMovement.cues }
                              );
                            }, 200);
                          }}
                          className="mt-6 px-6 py-2.5 rounded-full border border-sage/20 text-sage/70 text-sm hover:bg-sage/10 hover:text-sage transition-all duration-500"
                        >
                          🔊 Hear Instruction
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ══════ PRACTICE MODE ════════════════════════════════════ */}
        {mode === "practice" && currentMovement && (
          <motion.div
            key="practice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-6 pb-24"
          >
            {/* Progress */}
            <div className="mt-6 mb-14">
              <div className="flex items-center gap-0.5">
                {MOVEMENTS.map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-0.5 rounded-full transition-all duration-1000 ${
                      i < practiceIndex
                        ? "bg-sage/50"
                        : i === practiceIndex
                        ? "bg-sage"
                        : "bg-cream/8"
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sage/50 text-xs mt-3 tracking-wider">
                {practiceIndex + 1} of 18
              </p>
            </div>

            {/* Current movement */}
            <AnimatePresence mode="wait">
              <motion.div
                key={practiceIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1 }}
                className="text-center"
              >
                {/* Figure - large and centered */}
                <div className="h-72 md:h-96 mb-10 flex items-center justify-center">
                  <HumanFigure
                    poseKey={currentMovement.poseKey}
                    isAnimating={!isPaused}
                    color="sage"
                  />
                </div>

                {/* Movement info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-sage/40 text-xs tracking-[0.3em] uppercase mb-3">
                    {currentMovement.chinese}
                  </p>
                  <h2 className="font-heading text-4xl md:text-5xl font-light text-cream/90 mb-8">
                    {currentMovement.name}
                  </h2>

                  {/* Instruction cards */}
                  <div className="max-w-xl mx-auto space-y-4 mb-8">
                    <div className="p-5 rounded-2xl bg-cream/[0.03] border border-cream/5">
                      <p className="text-cream/50 font-light leading-relaxed">
                        {currentMovement.description}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 p-4 rounded-xl bg-sage/[0.05] border border-sage/10">
                        <p className="text-[9px] text-sage/50 tracking-wider uppercase mb-1">Breath</p>
                        <p className="text-cream/40 font-light text-sm">{currentMovement.breathing}</p>
                      </div>
                      <div className="flex-1 p-4 rounded-xl bg-sage/[0.05] border border-sage/10">
                        <p className="text-[9px] text-sage/50 tracking-wider uppercase mb-1">Focus</p>
                        <p className="text-cream/40 font-light text-sm italic">&ldquo;{currentMovement.cues.split('.')[0]}.&rdquo;</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Breathing circle */}
                <motion.div
                  animate={!isPaused ? { scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] } : {}}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-14 h-14 rounded-full border border-sage/20 mx-auto flex items-center justify-center"
                >
                  <span className="text-sage/40 text-[10px] tracking-widest">
                    {!isPaused ? "breathe" : "paused"}
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex justify-center items-center gap-4 mt-14">
              <button
                onClick={() => {
                  if (practiceIndex > 0) {
                    voiceRef.current.cancel();
                    setPracticeIndex((p) => p - 1);
                  }
                }}
                disabled={practiceIndex === 0}
                className="px-6 py-2.5 rounded-full border border-cream/10 text-cream/40 text-sm disabled:opacity-20 hover:border-sage/30 hover:text-sage/60 transition-all"
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
                className="px-10 py-3 rounded-full bg-sage/15 text-sage border border-sage/30 text-sm hover:bg-sage/25 transition-all"
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
                className="px-6 py-2.5 rounded-full border border-cream/10 text-cream/40 text-sm disabled:opacity-20 hover:border-sage/30 hover:text-sage/60 transition-all"
              >
                Next →
              </button>
            </div>

            {/* Completion */}
            {practiceIndex === MOVEMENTS.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1.5 }}
                className="text-center mt-20"
              >
                <div className="w-16 h-16 rounded-full bg-sage/10 border border-sage/20 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                <p className="text-cream/60 font-heading text-xl font-light mb-2">
                  You&apos;ve completed all 18 movements.
                </p>
                <p className="text-cream/30 font-light text-sm mb-8">
                  May this energy carry with you through your day.
                </p>
                <Link
                  href="/"
                  className="inline-block px-8 py-3 rounded-full bg-sage/15 text-sage border border-sage/30 font-light hover:bg-sage/25 transition-all"
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
