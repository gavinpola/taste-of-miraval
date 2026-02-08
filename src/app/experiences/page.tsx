"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";

const experiences = [
  {
    slug: "holographic-memory",
    title: "Holographic Memory Resolution",
    teacher: "Brent Baum",
    description:
      "A guided journey through color, body, and memory — gently reframing trauma through visualization and compassionate awareness.",
    category: "Healing & Transformation",
    duration: "8-10 min",
    icon: "🎨",
    gradient: "from-terracotta/20 via-sand/10 to-cream",
    details: [
      "7-stage guided process",
      "Interactive color wheel",
      "Body sensation mapping",
      "Ambient soundscapes",
      "Voice-guided meditation",
    ],
  },
  {
    slug: "qigong",
    title: "Qigong 18 Movements",
    teacher: "Master Li Wei",
    description:
      "Learn and practice the 18 flowing movements of Shibashi — an ancient sequence for energy, balance, and inner calm.",
    category: "Movement & Energy",
    duration: "20-30 min",
    icon: "🌊",
    gradient: "from-sage/20 via-sky/10 to-cream",
    details: [
      "18 animated movement guides",
      "Explore and guided modes",
      "Chinese names and meanings",
      "Breathing cues",
      "Progress tracking",
    ],
  },
  {
    slug: "elemental-journey",
    title: "Elemental Soul Journey",
    teacher: "Sierra Ramirez",
    description:
      "An immersive meditation through Earth, Water, Fire, Air, and Spirit — with transformative soundscapes and guided visualization.",
    category: "Spirit & Soul",
    duration: "12-15 min",
    icon: "🔥",
    gradient: "from-desert-night/20 via-sunset-gold/10 to-cream",
    details: [
      "5 elemental phases",
      "Full-screen particle visuals",
      "Procedural ambient audio",
      "Voice-guided narration",
      "Headphones recommended",
    ],
  },
];

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <p className="text-terracotta text-xs tracking-[0.3em] uppercase mb-6">
              Interactive Experiences
            </p>
            <h1 className="font-heading text-5xl md:text-7xl font-light text-desert-night mb-6 leading-tight">
              Choose Your
              <br />
              <span className="italic">Journey</span>
            </h1>
            <p className="text-dust text-lg font-light max-w-xl mx-auto leading-relaxed">
              Not just content. Guided, immersive experiences designed to be
              practiced, not just read. Each one uses sound, voice, and
              interactive visuals to create something transformative.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experiences */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 * i }}
            >
              <Link href={`/experiences/${exp.slug}`}>
                <div
                  className={`group relative rounded-3xl bg-gradient-to-br ${exp.gradient} border border-sand/10 hover:border-sand/30 transition-all duration-700 hover:shadow-lg hover:shadow-sand/10 overflow-hidden`}
                >
                  <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12">
                    {/* Left side */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{exp.icon}</span>
                        <span className="text-xs tracking-[0.2em] uppercase text-dust font-medium">
                          {exp.category}
                        </span>
                      </div>
                      <h2 className="font-heading text-3xl md:text-4xl font-light text-desert-night mb-4 group-hover:text-terracotta transition-colors duration-500">
                        {exp.title}
                      </h2>
                      <p className="text-desert-night/60 font-light leading-relaxed mb-6">
                        {exp.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-dust">
                        <span>{exp.teacher}</span>
                        <span className="w-px h-4 bg-dust/30" />
                        <span>{exp.duration}</span>
                      </div>
                    </div>

                    {/* Right side — details */}
                    <div className="md:w-64 flex-shrink-0">
                      <p className="text-xs tracking-[0.2em] uppercase text-dust mb-4">
                        What&apos;s inside
                      </p>
                      <ul className="space-y-2">
                        {exp.details.map((detail, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-desert-night/60 font-light text-sm"
                          >
                            <span className="w-1 h-1 rounded-full bg-terracotta/60 mt-2 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Begin CTA */}
                  <div className="px-8 md:px-12 pb-8 md:pb-10">
                    <div className="flex items-center gap-2 text-terracotta opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="font-light tracking-wide">
                        Begin this journey
                      </span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="text-lg"
                      >
                        →
                      </motion.span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Preparation tip */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream to-sand/10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h3 className="font-heading text-2xl md:text-3xl font-light text-desert-night mb-6">
              Before you begin
            </h3>
            <div className="space-y-4 text-desert-night/60 font-light leading-relaxed">
              <p>
                These experiences are designed to be immersive. For the best
                journey:
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mt-8">
                <div className="p-6 rounded-2xl bg-cream border border-sand/10">
                  <span className="text-2xl mb-3 block">🎧</span>
                  <p className="text-sm">
                    Use <strong className="font-normal text-desert-night">headphones</strong> for
                    spatial audio
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-cream border border-sand/10">
                  <span className="text-2xl mb-3 block">🤫</span>
                  <p className="text-sm">
                    Find a <strong className="font-normal text-desert-night">quiet space</strong>{" "}
                    where you won&apos;t be interrupted
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-cream border border-sand/10">
                  <span className="text-2xl mb-3 block">🕯️</span>
                  <p className="text-sm">
                    Set your{" "}
                    <strong className="font-normal text-desert-night">intention</strong> before
                    starting
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

