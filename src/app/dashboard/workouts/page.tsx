"use client";

import { Dumbbell } from "lucide-react";

export default function WorkoutsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="glass-panel p-12 rounded-2xl border-purple-neon/20 flex flex-col items-center max-w-2xl w-full relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-neon/5 to-transparent pointer-events-none" />
        
        <div className="w-20 h-20 rounded-full bg-purple-neon/10 border border-purple-neon flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(204,0,255,0.2)]">
          <Dumbbell size={40} className="text-purple-neon" />
        </div>
        
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-widest mb-4">
          Kinetic Simulator
        </h1>
        
        <p className="text-gray-400 font-mono text-center mb-8">
          Workout generation protocols are currently loading. 
          Use the AI terminal to override parameters and request a tactical routine.
        </p>
        
        <div className="flex items-center gap-2 text-purple-neon font-mono text-sm">
          <span className="w-2 h-2 rounded-full border border-purple-neon bg-purple-neon animate-ping" />
          AWAITING PARAMETERS...
        </div>
      </div>
    </div>
  );
}
