"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <p className="text-dust text-sm tracking-[0.3em] uppercase mb-6">
          Lost in the Desert
        </p>
        <h1 className="font-heading text-5xl md:text-7xl font-light text-desert-night mb-6">
          Page Not Found
        </h1>
        <p className="text-desert-night/60 font-light text-lg mb-10">
          Even in stillness, some paths lead nowhere.
          <br />
          Let&apos;s guide you back.
        </p>
        <Link
          href="/"
          className="inline-block px-10 py-4 rounded-full bg-terracotta text-cream font-light tracking-wide hover:bg-terracotta/90 transition-all duration-500"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}

