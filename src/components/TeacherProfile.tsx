"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";

interface TeacherData {
  name: string;
  title: string;
  specialty: string;
  quote: string;
  bio: string[];
  philosophy: string;
  experiences: {
    title: string;
    href: string;
    description: string;
    category: string;
  }[];
  credentials: string[];
  personalLinks: { label: string; url: string }[];
}

const TEACHERS: Record<string, TeacherData> = {
  "brent-baum": {
    name: "Brent Baum",
    title: "World-Renowned Trauma Specialist",
    specialty: "Holographic Memory Resolution",
    quote:
      "The body holds every story we've ever lived. Our work is not to erase those stories, but to help the body tell a new one — one rooted in compassion rather than pain.",
    bio: [
      "Brent Baum is a pioneering trauma specialist who has dedicated over 30 years to understanding how the mind and body store and process overwhelming experiences. His groundbreaking Holographic Memory Resolution (HMR) technique has helped over 11,000 trauma survivors — from everyday emotional wounds to survivors of the Oklahoma City bombing and the events of September 11th.",
      "At Miraval Arizona, Brent leads deeply personal one-on-one and group sessions where guests learn to identify the colors, body sensations, and emotional patterns connected to their stored memories. Through gentle, guided visualization, he helps people send corrective signals to the subconscious mind — not erasing the memory, but fundamentally changing the body's relationship to it.",
      "His work sits at the intersection of neuroscience, somatic therapy, and spiritual healing — a bridge between the clinical and the sacred that has made him one of the most sought-after wellness practitioners in the world.",
    ],
    philosophy:
      "Every emotion has a color. Every memory lives somewhere in the body. When we learn to see and feel these connections, we gain the power to transform them. Healing is not about forgetting — it's about remembering differently.",
    experiences: [
      {
        title: "Holographic Memory Resolution",
        href: "/experiences/holographic-memory",
        description:
          "A guided journey through color, body, and memory — gently reframing trauma through visualization and compassionate awareness.",
        category: "Healing & Transformation",
      },
    ],
    credentials: [
      "30+ years in trauma therapy and emotional healing",
      "Creator of Holographic Memory Resolution (HMR)",
      "Worked with 11,000+ trauma survivors",
      "Published author on somatic trauma resolution",
      "Miraval Arizona exclusive specialist since founding",
    ],
    personalLinks: [
      { label: "Published Works", url: "#" },
      { label: "Book a Private Session", url: "#" },
    ],
  },
  "qigong-master": {
    name: "Master Li Wei",
    title: "Qigong & Tai Chi Master",
    specialty: "Qigong Shibashi & Energy Cultivation",
    quote:
      "In stillness, find movement. In movement, find peace. The 18 forms are not exercises — they are conversations between your body and the universe.",
    bio: [
      "Master Li Wei brings over 25 years of dedicated practice in traditional Chinese energy arts to Miraval Arizona. Trained in the lineage of the Shibashi form — the 18-movement Tai Chi Qigong sequence — he embodies the gentle power that comes from decades of cultivating internal energy.",
      "His teaching style is warm, patient, and deeply intuitive. He meets each student exactly where they are, whether they've never moved mindfully before or have years of practice. His classes are known for their transformative simplicity — guests often arrive skeptical and leave with tears of joy, having felt their own life force (Qi) for the first time.",
      "Beyond Miraval, Master Li leads retreats and teacher trainings, carrying forward the ancient tradition of Qigong while making it accessible to modern Western practitioners.",
    ],
    philosophy:
      "Qi is not something you need to create. It already flows through you. My role is simply to help you remember how to feel it, how to move with it, and how to let it heal you. The 18 movements are a map back to your own energy.",
    experiences: [
      {
        title: "Qigong 18 Movements",
        href: "/experiences/qigong",
        description:
          "Learn and practice the 18 flowing movements of Shibashi — an ancient sequence for energy, balance, and inner calm.",
        category: "Movement & Energy",
      },
    ],
    credentials: [
      "25+ years of Qigong and Tai Chi practice",
      "Certified Shibashi lineage holder",
      "Trained in Traditional Chinese Medicine principles",
      "International retreat leader and teacher trainer",
      "Specialist in therapeutic Qigong for stress & healing",
    ],
    personalLinks: [
      { label: "Upcoming Retreats", url: "#" },
      { label: "Teacher Training Program", url: "#" },
    ],
  },
  "elemental-guide": {
    name: "Sierra Ramirez",
    title: "Elemental Healing & Manifestation Guide",
    specialty: "Elemental Meditation & Energy Work",
    quote:
      "The elements live within you. When you remember this — when you feel the earth in your bones, the water in your blood, the fire in your heart, and the air in your breath — everything shifts.",
    bio: [
      "Sierra Ramirez is a transformative healer whose work bridges ancient elemental wisdom with modern manifestation practices. Her signature Elemental Soul Journey — an immersive, sensory meditation through Earth, Water, Fire, Air, and Spirit — has become one of Miraval Arizona's most sought-after experiences.",
      "Guests describe her sessions as 'traveling without moving.' Using carefully curated soundscapes, guided visualization, and the power of the five elements, Sierra creates a space where profound inner transformation happens naturally. Her background in sound healing, breathwork, and manifestation coaching gives her sessions a unique depth that resonates long after they end.",
      "Sierra's approach is rooted in the belief that we are not separate from nature — we are nature. By reconnecting with the elements within ourselves, we reconnect with our power to create, to heal, and to transform.",
    ],
    philosophy:
      "Manifestation isn't about wishing. It's about aligning. When you connect with the earth, you find your foundation. When you flow with water, you release resistance. When you embrace fire, you transform. When you open to air, you find freedom. And when you touch spirit — you remember that you are already whole.",
    experiences: [
      {
        title: "Elemental Soul Journey",
        href: "/experiences/elemental-journey",
        description:
          "An immersive meditation through Earth, Water, Fire, Air, and Spirit — with transformative soundscapes and guided visualization.",
        category: "Spirit & Soul",
      },
    ],
    credentials: [
      "15+ years in elemental healing and energy work",
      "Certified Sound Healing Practitioner",
      "Trained in Breathwork and Somatic Experiencing",
      "Manifestation and Law of Attraction specialist",
      "Creator of the Elemental Soul Journey method",
    ],
    personalLinks: [
      { label: "Manifestation Workshop", url: "#" },
      { label: "Private Healing Sessions", url: "#" },
    ],
  },
};

export default function TeacherProfile({ slug }: { slug: string }) {
  const teacher = TEACHERS[slug];

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-desert-night mb-4">
            Teacher not found
          </h1>
          <Link href="/" className="text-terracotta hover:underline">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative pt-24 pb-20 px-6 bg-gradient-to-b from-sand/10 to-cream">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="text-dust hover:text-terracotta transition-colors text-sm"
          >
            ← Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-12 flex flex-col md:flex-row items-start gap-10"
          >
            {/* Avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-sand/40 to-terracotta/20 flex items-center justify-center border border-sand/20 flex-shrink-0">
              <span className="font-heading text-5xl text-desert-night/20">
                {teacher.name.charAt(0)}
              </span>
            </div>

            <div>
              <p className="text-terracotta text-xs tracking-[0.3em] uppercase mb-2">
                {teacher.specialty}
              </p>
              <h1 className="font-heading text-5xl md:text-6xl font-light text-desert-night mb-2">
                {teacher.name}
              </h1>
              <p className="text-dust text-lg font-light">{teacher.title}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-3xl mx-auto text-center"
        >
          <blockquote className="font-heading text-2xl md:text-3xl font-light text-desert-night/80 leading-relaxed italic">
            &ldquo;{teacher.quote}&rdquo;
          </blockquote>
        </motion.div>
      </section>

      {/* Bio */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-3xl font-light text-desert-night mb-8">
              About
            </h2>
            <div className="space-y-5">
              {teacher.bio.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-desert-night/70 font-light leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-12 px-6 bg-gradient-to-b from-cream to-sand/5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-3xl font-light text-desert-night mb-6">
              Teaching Philosophy
            </h2>
            <p className="text-desert-night/70 font-light leading-relaxed text-lg italic">
              &ldquo;{teacher.philosophy}&rdquo;
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experiences */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-3xl font-light text-desert-night mb-8">
              My Experiences
            </h2>
            <div className="space-y-4">
              {teacher.experiences.map((exp) => (
                <Link key={exp.href} href={exp.href}>
                  <div className="group p-6 rounded-2xl border border-sand/20 hover:border-terracotta/30 hover:bg-terracotta/5 transition-all duration-500">
                    <span className="text-terracotta text-xs tracking-[0.2em] uppercase">
                      {exp.category}
                    </span>
                    <h3 className="font-heading text-2xl font-light text-desert-night mt-2 group-hover:text-terracotta transition-colors duration-500">
                      {exp.title}
                    </h3>
                    <p className="text-desert-night/60 font-light mt-2">
                      {exp.description}
                    </p>
                    <span className="inline-block mt-3 text-terracotta text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      Begin Journey →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-3xl font-light text-desert-night mb-8">
              Background
            </h2>
            <ul className="space-y-3">
              {teacher.credentials.map((cred, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-desert-night/70 font-light"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sand mt-2 flex-shrink-0" />
                  {cred}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Personal Links */}
      <section className="py-12 px-6 mb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-3xl font-light text-desert-night mb-8">
              Continue Your Journey
            </h2>
            <div className="flex flex-wrap gap-4">
              {teacher.personalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  className="px-8 py-3 rounded-full border border-terracotta text-terracotta hover:bg-terracotta hover:text-cream transition-all duration-500 font-light"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/"
                className="px-8 py-3 rounded-full border border-dust/40 text-dust hover:border-sand hover:text-desert-night transition-all duration-500 font-light"
              >
                Explore More Experiences
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

