"use client";

import { motion } from "framer-motion";
import { Move, BrainCircuit, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { RefObject, useState } from "react";

interface AntigravityLoginProps {
  constraintsRef: RefObject<HTMLDivElement | null>;
}

export default function AntigravityLogin({ constraintsRef }: AntigravityLoginProps) {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitialize = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInitializing(true);
    // Simulate initialization delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.2}
      dragMomentum={true}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      // "Google Antigravity" continuous drifting block
      animate={{
        y: [0, -15, 0, 10, 0],
        x: [0, 10, 0, -10, 0],
        rotate: [0, 1, -1, 1, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute glass-card w-full max-w-md rounded-2xl p-8 border-glow-cyan text-white cursor-grab z-10 mx-4 md:mx-0 shadow-2xl"
    >
      <div className="absolute top-4 right-4 text-cyan-neon/50">
        <Move size={20} />
      </div>

      <div className="flex items-center gap-3 mb-8">
        <BrainCircuit className="text-purple-neon drop-shadow-[0_0_8px_rgba(213,0,249,0.8)]" size={36} />
        <h1 className="text-3xl font-extrabold tracking-tighter text-glow-cyan uppercase">
          FitpromixAI
        </h1>
      </div>

      <p className="text-gray-400 text-sm mb-6 uppercase tracking-widest font-mono">
        Neural Link Authentication
      </p>

      <form onSubmit={handleInitialize} className="space-y-5">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="text-cyan-neon/50 group-focus-within:text-cyan-neon transition-colors" size={18} />
          </div>
          <input
            type="email"
            required
            placeholder="Agent Designation (Email)"
            className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-all"
            defaultValue="commander@fitpromix.ai"
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="text-purple-neon/50 group-focus-within:text-purple-neon transition-colors" size={18} />
          </div>
          <input
            type="password"
            required
            placeholder="Decryption Key"
            className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-neon focus:ring-1 focus:ring-purple-neon transition-all"
            defaultValue="********"
          />
        </div>

        <button
          type="submit"
          disabled={isInitializing}
          className="w-full relative group overflow-hidden rounded-lg bg-gradient-to-r from-cyan-neon/20 to-purple-neon/20 border border-cyan-neon/30 hover:border-cyan-neon p-[1px] mt-4"
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-black/80 px-4 py-3 rounded-md flex items-center justify-center gap-2 text-white font-mono uppercase tracking-widest font-semibold hover:bg-black/60 transition-colors">
            {isInitializing ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-neon border-t-transparent rounded-full animate-spin" />
                <span>Calibrating...</span>
              </>
            ) : (
              <span>Initialize</span>
            )}
          </div>
        </button>
      </form>
      
      <div className="mt-6 text-center text-xs text-gray-500 font-mono">
        <p>Establishing secure connection to mainframe...</p>
      </div>
    </motion.div>
  );
}
