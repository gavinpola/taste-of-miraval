"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-sand/20 bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <Link
              href="/"
              className="font-heading text-xl font-light text-desert-night/50 hover:text-desert-night transition-colors duration-500"
            >
              A Taste of <span className="italic">Miraval</span>
            </Link>
            <p className="text-dust text-sm font-light mt-1">
              Life in Balance, Beyond the Desert
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            <Link
              href="/experiences/holographic-memory"
              className="text-dust text-sm hover:text-terracotta transition-colors duration-500"
            >
              Holographic Memory
            </Link>
            <Link
              href="/experiences/qigong"
              className="text-dust text-sm hover:text-terracotta transition-colors duration-500"
            >
              Qigong
            </Link>
            <Link
              href="/experiences/elemental-journey"
              className="text-dust text-sm hover:text-terracotta transition-colors duration-500"
            >
              Elemental Journey
            </Link>
            <Link
              href="/teachers/brent-baum"
              className="text-dust text-sm hover:text-terracotta transition-colors duration-500"
            >
              Teachers
            </Link>
            <Link
              href="/vision"
              className="text-dust text-sm hover:text-terracotta transition-colors duration-500"
            >
              The Vision
            </Link>
          </nav>
        </div>

        <div className="mt-10 pt-8 border-t border-sand/10 text-center">
          <p className="text-dust/60 text-xs font-light tracking-wider">
            A concept prototype &middot; Built with intention &middot; Not
            affiliated with Miraval Resorts
          </p>
        </div>
      </div>
    </footer>
  );
}

