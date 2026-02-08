"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
const audiences = [
  {
    icon: "🏜️",
    title: "Miraval Alumni",
    description:
      "You've been to Miraval. It changed you. But life has a way of pulling you back into old patterns. This platform keeps the transformation alive — giving you access to the practices and teachers that moved you, so the journey doesn't end when you leave the desert.",
  },
  {
    icon: "🏠",
    title: "Take It Home",
    description:
      "\"This is so cool, but how am I going to remember all 18 poses?\" You learned something profound. Now you need a way to actually practice it. Interactive, guided experiences that let you integrate what you learned into your daily life — not just a PDF or a memory.",
  },
  {
    icon: "✨",
    title: "Access for Everyone",
    description:
      "Not everyone can afford a Miraval stay. But everyone deserves access to transformation. This platform democratizes world-class wellness teachings, creating a pipeline of future guests who already know the power of what Miraval offers.",
  },
];

const benefits = [
  {
    for: "For Miraval",
    items: [
      "Extended brand reach beyond the physical resort",
      "Digital touchpoint that drives repeat bookings",
      "Content that markets itself — every experience is a brand ambassador",
      "Competitive advantage as first luxury resort with an interactive digital platform",
      "Data insights on what practices resonate most with guests",
    ],
  },
  {
    for: "For Teachers",
    items: [
      "Personal platform to build their own brand and following",
      "Reach beyond the resort walls — students become lifelong followers",
      "Agency over their content and presentation",
      "Powerful recruiting incentive — attract world-class talent",
      "New revenue streams through digital extensions of their practice",
    ],
  },
  {
    for: "For Users",
    items: [
      "Continue their Miraval journey at home",
      "Actually remember and practice what they learned",
      "Access world-class teachers without the travel cost",
      "Guided, interactive experiences — not just videos or articles",
      "A bridge between visits that deepens the transformation",
    ],
  },
];

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            <p className="text-terracotta text-xs tracking-[0.3em] uppercase mb-8">
              The Vision
            </p>
            <h1 className="font-heading text-5xl md:text-7xl font-light text-desert-night mb-8 leading-tight">
              Life in Balance,
              <br />
              <span className="italic">Beyond the Desert</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* The Origin Story */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream to-sand/10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-light text-desert-night mb-10">
              It started with a question.
            </h2>

            <div className="space-y-6 text-desert-night/70 font-light text-lg leading-relaxed">
              <p>
                During a Tai Chi session at Miraval Arizona, a woman in the
                group turned to the instructor and said:
              </p>

              <blockquote className="border-l-2 border-terracotta pl-6 py-2 my-8">
                <p className="font-heading text-2xl md:text-3xl font-light text-desert-night/80 italic">
                  &ldquo;This is so cool, but how am I going to remember all 18
                  poses?&rdquo;
                </p>
              </blockquote>

              <p>
                That question captured something I&apos;d been feeling the entire
                weekend. Every session I attended — from Brent Baum&apos;s
                Holographic Memory Resolution to the Elemental Soul Journey to
                the Qigong practice — I was learning things that genuinely
                shifted something in me. Practices I&apos;d never imagined trying.
                Ways of seeing myself and the world that felt entirely new.
              </p>

              <p>
                But I also felt the weight of the question: <em>How do I take this home?</em>
              </p>

              <p>
                Miraval creates transformation. But transformation needs
                continuation. It needs practice. It needs a bridge between the
                desert and daily life.
              </p>

              <p className="text-desert-night font-normal">
                That&apos;s what <em>A Taste of Miraval</em> is.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Three Audiences */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-light text-desert-night mb-4">
              Three audiences. One platform.
            </h2>
            <p className="text-dust font-light text-lg">
              Each with a different need. All united by the desire for
              transformation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {audiences.map((aud, i) => (
              <motion.div
                key={aud.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 * i }}
                className="p-8 rounded-3xl border border-sand/20 bg-gradient-to-b from-sand/5 to-cream"
              >
                <span className="text-3xl">{aud.icon}</span>
                <h3 className="font-heading text-2xl font-light text-desert-night mt-4 mb-4">
                  {aud.title}
                </h3>
                <p className="text-desert-night/60 font-light leading-relaxed text-sm">
                  {aud.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mutual Benefit Model */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream to-sand/10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-light text-desert-night mb-4">
              Everyone wins.
            </h2>
            <p className="text-dust font-light text-lg max-w-2xl mx-auto">
              This isn&apos;t a replacement for Miraval. It&apos;s an amplifier.
              Visibility drives demand. Access creates loyalty. And empowered
              teachers are the best ambassadors a brand could ask for.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((group, i) => (
              <motion.div
                key={group.for}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 * i }}
                className="p-8 rounded-3xl border border-sand/20"
              >
                <h3 className="font-heading text-2xl font-light text-terracotta mb-6">
                  {group.for}
                </h3>
                <ul className="space-y-3">
                  {group.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-desert-night/70 font-light text-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta/60 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Flywheel */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-light text-desert-night mb-10">
              The Flywheel
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-16">
              <div className="p-6 rounded-2xl bg-sand/5 border border-sand/10">
                <p className="text-terracotta font-heading text-lg mb-2">
                  1. Teachers create
                </p>
                <p className="text-desert-night/60 font-light text-sm">
                  World-class practitioners build interactive experiences on the
                  platform, extending their personal brand and reaching new
                  audiences.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-sand/5 border border-sand/10">
                <p className="text-terracotta font-heading text-lg mb-2">
                  2. Users discover
                </p>
                <p className="text-desert-night/60 font-light text-sm">
                  People experience guided practices at home — falling in love
                  with the teachers, the modalities, and the Miraval philosophy.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-sand/5 border border-sand/10">
                <p className="text-terracotta font-heading text-lg mb-2">
                  3. Demand grows
                </p>
                <p className="text-desert-night/60 font-light text-sm">
                  Experiencing a taste of Miraval creates desire for the full
                  experience. Digital users become future resort guests.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-sand/5 border border-sand/10">
                <p className="text-terracotta font-heading text-lg mb-2">
                  4. Talent elevates
                </p>
                <p className="text-desert-night/60 font-light text-sm">
                  The platform becomes a value prop for recruiting. The best
                  teachers in the world want a platform. Miraval offers one.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What You Just Experienced */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream to-sand/10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-light text-desert-night mb-8">
              What you just experienced
            </h2>
            <p className="text-desert-night/70 font-light text-lg leading-relaxed mb-10">
              This prototype includes three fully interactive experiences that
              demonstrate what this platform could be:
            </p>

            <div className="space-y-6 text-left">
              <Link href="/experiences/holographic-memory">
                <div className="group p-6 rounded-2xl border border-sand/20 hover:border-terracotta/30 transition-all duration-500">
                  <h3 className="font-heading text-xl text-desert-night group-hover:text-terracotta transition-colors">
                    Holographic Memory Resolution
                  </h3>
                  <p className="text-desert-night/60 font-light text-sm mt-1">
                    A 7-stage guided trauma healing journey with color selection,
                    body mapping, ambient audio, and voice guidance. Based on
                    Brent Baum&apos;s groundbreaking work.
                  </p>
                </div>
              </Link>

              <Link href="/experiences/qigong">
                <div className="group p-6 rounded-2xl border border-sand/20 hover:border-sage/30 transition-all duration-500">
                  <h3 className="font-heading text-xl text-desert-night group-hover:text-sage transition-colors">
                    Qigong 18 Movements
                  </h3>
                  <p className="text-desert-night/60 font-light text-sm mt-1">
                    An interactive movement library with animated figures, two
                    practice modes (explore and guided), voice instruction, and
                    ambient soundscapes. The answer to &ldquo;how will I remember?&rdquo;
                  </p>
                </div>
              </Link>

              <Link href="/experiences/elemental-journey">
                <div className="group p-6 rounded-2xl border border-sand/20 hover:border-sunset-gold/30 transition-all duration-500">
                  <h3 className="font-heading text-xl text-desert-night group-hover:text-sunset-gold transition-colors">
                    Elemental Soul Journey
                  </h3>
                  <p className="text-desert-night/60 font-light text-sm mt-1">
                    A 12-15 minute immersive meditation through five elements,
                    each with unique particle visuals, procedurally generated
                    ambient soundscapes, and guided voice narration.
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            <p className="font-heading text-4xl md:text-5xl font-light text-desert-night leading-relaxed mb-10">
              Miraval has spent 30 years creating transformation.
              <br />
              <span className="italic text-terracotta">
                Let&apos;s help it travel.
              </span>
            </p>

            <p className="text-desert-night/60 font-light text-lg mb-12 max-w-xl mx-auto">
              This platform is a labor of love — born from a weekend that
              genuinely changed my perspective. I&apos;d love to explore building
              this together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@tasteofmiraval.com"
                className="px-12 py-5 rounded-full bg-terracotta text-cream font-light tracking-wide text-lg hover:bg-terracotta/90 transition-all duration-500 shadow-lg shadow-terracotta/20"
              >
                Let&apos;s Talk
              </a>
              <Link
                href="/"
                className="px-12 py-5 rounded-full border border-desert-night/20 text-desert-night font-light tracking-wide text-lg hover:bg-desert-night hover:text-cream transition-all duration-500"
              >
                Explore the Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

