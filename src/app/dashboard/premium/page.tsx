import PricingSection from "@/components/PricingSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PremiumPage() {
  return (
    <div className="w-full min-h-[100dvh] flex flex-col p-4 md:p-8 overflow-y-auto cyber-scrollbar bg-black/95 relative">
      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest">
            System <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">Upgrade</span>
          </h1>
        </div>
        
        {/* Status Banner */}
        <div className="mb-8 md:mb-12 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.02)]">
          <p className="text-base md:text-lg text-gray-300 font-mono tracking-wide leading-relaxed">
            Your current status: <span className="text-cyan-400 font-bold border border-cyan-400/50 px-3 py-1 rounded bg-cyan-400/10 shadow-[0_0_10px_rgba(34,211,238,0.2)] mx-2 inline-block mb-2 md:mb-0">[TRIAL]</span>
            <span className="block md:inline">Upgrade your account to keep generating AI-powered workouts and diet plans.</span>
          </p>
        </div>

        {/* The Pricing Component */}
        <div className="-mx-4 md:mx-0">
          <PricingSection />
        </div>
        
      </div>
    </div>
  );
}
