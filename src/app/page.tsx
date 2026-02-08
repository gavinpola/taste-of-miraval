"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DustParticles from "@/components/DustParticles";
import BreathingCircle from "@/components/BreathingCircle";
import Footer from "@/components/Footer";

const intentions = [
  { id: "healing", label: "Healing", icon: "🌿" },
  { id: "movement", label: "Movement", icon: "🌊" },
  { id: "transformation", label: "Transformation", icon: "🔥" },
  { id: "stillness", label: "Stillness", icon: "🏔️" },
  { id: "discovery", label: "Discovery", icon: "✨" },
];

const experiences = [
  {
    slug: "holographic-memory",
    title: "Holographic Memory Resolution",
    teacher: "Brent Baum",
    description:
      "A guided journey through color, body, and memory — gently reframing trauma through visualization and compassionate awareness.",
    category: "Healing & Transformation",
    gradient: "from-terracotta/20 via-sand/10 to-cream",
    accentColor: "terracotta",
    duration: "8-10 min",
  },
  {
    slug: "qigong",
    title: "Qigong 18 Movements",
    teacher: "Qigong Master",
    description:
      "Learn and practice the 18 flowing movements of Shibashi — an ancient sequence for energy, balance, and inner calm.",
    category: "Movement & Energy",
    gradient: "from-sage/20 via-sky/10 to-cream",
    accentColor: "sage",
    duration: "20-30 min",
  },
  {
    slug: "elemental-journey",
    title: "Elemental Soul Journey",
    teacher: "Elements Guide",
    description:
      "An immersive meditation through Earth, Water, Fire, Air, and Spirit — with transformative soundscapes and guided visualization.",
    category: "Spirit & Soul",
    gradient: "from-desert-night/20 via-sunset-gold/10 to-cream",
    accentColor: "sunset-gold",
    duration: "12-15 min",
  },
];

const teachers = [
  {
    slug: "brent-baum",
    name: "Brent Baum",
    specialty: "Holographic Memory Resolution",
    quote: "The body holds every story. Our work is to help it tell a new one.",
  },
  {
    slug: "qigong-master",
    name: "Master Li Wei",
    specialty: "Qigong & Tai Chi",
    quote: "In stillness, find movement. In movement, find peace.",
  },
  {
    slug: "elemental-guide",
    name: "Sierra Ramirez",
    specialty: "Elemental Healing & Manifestation",
    quote: "The elements live within you. When you remember this, everything shifts.",
  },
];

export default function Home() {
  const [selectedIntention, setSelectedIntention] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Desert gradient background */}
        <div className="absolute inset-0 gradient-desert-dawn opacity-90" />
        <DustParticles count={50} color="rgba(245, 237, 227, 0.4)" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <BreathingCircle
              size={120}
              color="rgba(245, 237, 227, 0.25)"
              className="mx-auto mb-12"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-heading text-6xl md:text-8xl font-light text-cream tracking-wide mb-6"
          >
            A Taste of{" "}
            <span className="italic font-medium">Miraval</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.2 }}
            className="font-body text-lg md:text-xl text-cream/80 font-light tracking-wide max-w-2xl mx-auto leading-relaxed"
          >
            Trade the rush for the rhythm, noise for stillness,
            <br className="hidden sm:block" /> scrolling for presence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 2 }}
            className="mt-16"
          >
            <a
              href="#intention"
              className="inline-block text-cream/60 text-sm tracking-[0.3em] uppercase hover:text-cream transition-colors duration-700"
            >
              Begin your journey
              <div className="mt-3 mx-auto w-px h-12 bg-cream/30" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Intention Section */}
      <section id="intention" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="font-heading text-4xl md:text-6xl font-light text-desert-night mb-4"
          >
            What are you seeking?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-dust text-lg font-light mb-16"
          >
            Set your intention. Let it guide you.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {intentions.map((intent, i) => (
              <motion.button
                key={intent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * i }}
                onClick={() => setSelectedIntention(intent.id)}
                className={`group relative px-8 py-4 rounded-full border transition-all duration-700 ${
                  selectedIntention === intent.id
                    ? "border-terracotta bg-terracotta/10 text-terracotta"
                    : "border-dust/40 text-desert-night/60 hover:border-sand hover:text-desert-night"
                }`}
              >
                <span className="mr-2">{intent.icon}</span>
                <span className="font-heading text-lg font-light tracking-wide">
                  {intent.label}
                </span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {selectedIntention && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="mt-10 text-sand font-light italic text-lg"
              >
                Beautiful. Let&apos;s explore what resonates with you.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-light text-desert-night mb-4">
              Interactive Experiences
            </h2>
            <p className="text-dust text-lg font-light max-w-xl mx-auto">
              Not just content. Guided, immersive journeys you can return to
              anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 * i }}
              >
                <Link href={`/experiences/${exp.slug}`}>
                  <div
                    className={`group relative rounded-3xl bg-gradient-to-br ${exp.gradient} p-8 h-full min-h-[420px] flex flex-col justify-between border border-sand/10 hover:border-sand/30 transition-all duration-700 hover:shadow-lg hover:shadow-sand/10 cursor-pointer`}
                  >
                    <div>
                      <span
                        className={`text-xs tracking-[0.2em] uppercase text-${exp.accentColor} font-medium`}
                      >
                        {exp.category}
                      </span>
                      <h3 className="font-heading text-2xl md:text-3xl font-light text-desert-night mt-3 mb-4 group-hover:text-terracotta transition-colors duration-500">
                        {exp.title}
                      </h3>
                      <p className="text-desert-night/60 font-light leading-relaxed text-sm">
                        {exp.description}
                      </p>
                    </div>

                    <div className="mt-8">
                      <div className="flex items-center justify-between">
                        <span className="text-dust text-sm">{exp.teacher}</span>
                        <span className="text-dust text-xs">{exp.duration}</span>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-terracotta opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-sm font-light tracking-wide">
                          Begin Journey
                        </span>
                        <span className="text-lg">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream to-sand/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-light text-desert-night mb-4">
              Meet the Teachers
            </h2>
            <p className="text-dust text-lg font-light max-w-xl mx-auto">
              World-class practitioners who bring transformation to life.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teachers.map((teacher, i) => (
              <motion.div
                key={teacher.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * i }}
              >
                <Link href={`/teachers/${teacher.slug}`}>
                  <div className="group text-center p-8 rounded-3xl hover:bg-cream/80 transition-all duration-500">
                    {/* Avatar placeholder */}
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-sand/40 to-terracotta/20 mx-auto mb-6 flex items-center justify-center border border-sand/20">
                      <span className="font-heading text-3xl text-desert-night/30">
                        {teacher.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-heading text-2xl font-light text-desert-night group-hover:text-terracotta transition-colors duration-500">
                      {teacher.name}
                    </h3>
                    <p className="text-dust text-sm mt-1 tracking-wide">
                      {teacher.specialty}
                    </p>
                    <p className="text-desert-night/50 text-sm font-light italic mt-4 leading-relaxed">
                      &ldquo;{teacher.quote}&rdquo;
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Teaser */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 gradient-sonoran-sky opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            <p className="font-heading text-3xl md:text-4xl font-light text-desert-night leading-relaxed mb-4">
              &ldquo;This is so cool, but how am I going to remember all 18 poses?&rdquo;
            </p>
            <p className="text-dust font-light text-lg mb-12">
              — A guest during Tai Chi at Miraval Arizona
            </p>
            <p className="text-desert-night/70 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
              That question sparked everything. This platform exists so the
              transformation doesn&apos;t end when you leave the desert. For those who&apos;ve
              been and want to continue the journey. For those who want to bring the
              teachings home. And for those who haven&apos;t yet had the chance.
            </p>
            <Link
              href="/vision"
              className="inline-block px-10 py-4 rounded-full border border-terracotta text-terracotta hover:bg-terracotta hover:text-cream transition-all duration-500 font-light tracking-wide"
            >
              Read the Vision
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
