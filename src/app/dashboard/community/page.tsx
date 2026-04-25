import CommunityFeed from "@/components/CommunityFeed";

export default function CommunityPage() {
  return (
    <div className="flex-1 w-full p-6 md:p-10 h-full overflow-y-auto custom-scrollbar">
      {/* Glassmorphic Header */}
      <div className="mb-10 p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,212,255,0.1)] relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d4ff]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-widest text-white uppercase mb-3 flex items-center gap-3">
            TRANSFORM FEED // <span className="text-[#00d4ff] text-glow-cyan">COMMUNITY</span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 font-mono tracking-wide border-l-2 border-[#00d4ff] pl-4 py-1">
            The ultimate space to share goals and get motivated.
          </p>
        </div>
      </div>

      {/* Community Feed Render */}
      <div className="w-full h-full relative z-0">
        <CommunityFeed />
      </div>
    </div>
  );
}
