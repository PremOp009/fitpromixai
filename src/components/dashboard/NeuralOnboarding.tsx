"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAvatar } from "@/context/AvatarContext";
import { useAuth } from "@/context/AuthContext";
import { BrainCircuit } from "lucide-react";

export default function NeuralOnboarding() {
  const { stats, calibrateAvatar } = useAvatar();
  const { user } = useAuth();
  
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState<"Cut" | "Bulk" | "Recomp">("Recomp");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weight && height && goal) {
      calibrateAvatar(parseFloat(weight), parseFloat(height), goal);
    }
  };

  if (stats.isCalibrated) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ y: 50, scale: 0.9, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg glass-card rounded-3xl p-8 border border-cyan-neon/30 shadow-[0_0_40px_rgba(0,243,255,0.15)] bg-black/80"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-cyan-neon/50 p-3 rounded-full drop-shadow-[0_0_15px_#00f3ff]">
            <BrainCircuit size={32} className="text-cyan-neon" />
          </div>

          <div className="text-center mt-6 mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon to-purple-neon">
              Neural Calibration
            </h2>
            <p className="text-gray-400 font-mono text-sm mt-2">
              Welcome, {user?.displayName || "Avatar"}. Input your physical metrics to sync.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-cyan-neon">Mass (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white font-mono text-lg focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-all"
                  placeholder="e.g. 75.5"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-cyan-neon">Height (CM)</label>
                <input
                  type="number"
                  required
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white font-mono text-lg focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-all"
                  placeholder="e.g. 180"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-purple-neon">Protocol Directive</label>
              <div className="grid grid-cols-3 gap-3">
                {["Cut", "Recomp", "Bulk"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g as any)}
                    className={`p-3 rounded-lg border font-mono text-sm uppercase transition-all ${
                      goal === g
                        ? "border-purple-neon bg-purple-neon/20 text-white drop-shadow-[0_0_8px_#b500ff]"
                        : "border-white/10 text-gray-500 hover:border-white/30"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-cyan-neon/80 to-purple-neon/80 text-white font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(181,0,255,0.5)] transition-all hover:scale-[1.02]"
            >
              Sync to Matrix
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
