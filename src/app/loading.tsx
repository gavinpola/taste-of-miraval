"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-cream flex items-center justify-center z-[100]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        {/* Breathing circle loader */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full border border-sand/40 mx-auto mb-6 flex items-center justify-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="w-6 h-6 rounded-full bg-sand/20"
          />
        </motion.div>
        <p className="font-heading text-lg font-light text-dust tracking-wide">
          Finding stillness...
        </p>
      </motion.div>
    </div>
  );
}

