"use client";

import HeroSequence from "@/components/HeroSequence";
import { motion } from "framer-motion";
import LoginPortal from "@/components/LoginPortal";

export default function LandingPage() {


  return (
    <main className="relative bg-black w-full text-white">
      <HeroSequence>
        
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-6"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 uppercase drop-shadow-[0_0_15px_rgba(213,0,249,0.5)]">
            FitpromixAI
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mb-12 max-w-2xl px-4"
        >
          <p className="text-xl md:text-2xl text-gray-200 font-light font-mono tracking-wide drop-shadow-md">
            Awaken Your Inner Athlete. Train with Next-Gen Cybernetic AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
          className="flex w-full justify-center px-4 relative z-20"
        >
          <LoginPortal />
        </motion.div>

      </HeroSequence>
    </main>
  );
}
