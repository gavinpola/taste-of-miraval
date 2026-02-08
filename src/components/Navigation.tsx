"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const IMMERSIVE_PATHS = [
  "/experiences/holographic-memory",
  "/experiences/qigong",
  "/experiences/elemental-journey",
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isImmersivePage = IMMERSIVE_PATHS.includes(pathname);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Track scroll position for visual feedback
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render full nav on immersive experience pages
  if (isImmersivePage) return null;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/experiences", label: "Experiences" },
    { href: "/teachers/brent-baum", label: "Teachers" },
    { href: "/vision", label: "The Vision" },
  ];

  const experienceLinks = [
    { href: "/experiences/holographic-memory", label: "Holographic Memory" },
    { href: "/experiences/qigong", label: "Qigong 18 Movements" },
    { href: "/experiences/elemental-journey", label: "Elemental Journey" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "glass-card shadow-sm"
            : "bg-cream/40 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-heading text-2xl font-light tracking-wide text-desert-night"
          >
            A Taste of{" "}
            <span className="font-medium italic">Miraval</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-light tracking-wider transition-colors duration-500 ${
                  isActive(link.href)
                    ? "text-terracotta"
                    : "text-desert-night/70 hover:text-terracotta"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={
                isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
              }
              className="block w-6 h-px bg-desert-night"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-px bg-desert-night"
            />
            <motion.span
              animate={
                isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
              }
              className="block w-6 h-px bg-desert-night"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="md:hidden glass-card mx-4 mt-2 rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`font-heading text-xl font-light transition-colors duration-500 ${
                      isActive(link.href)
                        ? "text-terracotta"
                        : "text-desert-night/80 hover:text-terracotta"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {/* Show experience sub-links */}
                  {link.href === "/experiences" && (
                    <div className="ml-4 mt-2 flex flex-col gap-2">
                      {experienceLinks.map((exp) => (
                        <Link
                          key={exp.href}
                          href={exp.href}
                          onClick={() => setIsOpen(false)}
                          className={`text-sm font-light transition-colors duration-500 ${
                            pathname === exp.href
                              ? "text-terracotta"
                              : "text-dust hover:text-terracotta"
                          }`}
                        >
                          {exp.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
