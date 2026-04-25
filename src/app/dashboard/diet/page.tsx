"use client";

import { Apple } from "lucide-react";

export default function DietPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="glass-panel p-12 rounded-2xl border-cyan-neon/20 flex flex-col items-center max-w-2xl w-full relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-neon/5 to-transparent pointer-events-none" />
        
        <div className="w-20 h-20 rounded-full bg-cyan-neon/10 border border-cyan-neon flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,243,255,0.2)]">
          <Apple size={40} className="text-cyan-neon" />
        </div>
        
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-widest mb-4">
          Diet AI Matrix
        </h1>
        
        <p className="text-gray-400 font-mono text-center mb-8">
          Nutritional algorithms are currently calibrating. 
          Connect to the main terminal to synthesize meal plans.
        </p>
        
        <div className="flex items-center gap-2 text-cyan-neon font-mono text-sm">
          <span className="w-2 h-2 rounded-full border border-cyan-neon bg-cyan-neon animate-ping" />
          MODULE INITIATING...
        </div>
      </div>
    </div>
  );
}
