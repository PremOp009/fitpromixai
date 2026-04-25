"use client";

import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="glass-panel p-12 rounded-2xl border-white/10 flex flex-col items-center max-w-2xl w-full relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          <Settings size={40} className="text-gray-400" />
        </div>
        
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-widest mb-4">
          System Preferences
        </h1>
        
        <p className="text-gray-500 font-mono text-center mb-8">
          Avatar configuration and neural link settings are locked for maintenance. 
          Return later for synchronization.
        </p>
        
        <div className="flex items-center gap-2 text-gray-500 font-mono text-sm">
          <span className="w-2 h-2 rounded-full border border-gray-600 bg-gray-600 animate-pulse" />
          MAINTENANCE MODE
        </div>
      </div>
    </div>
  );
}
