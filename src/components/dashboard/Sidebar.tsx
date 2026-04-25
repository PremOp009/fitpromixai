"use client";

import { Activity, Apple, Dumbbell, Terminal, Skull, Zap, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAvatar } from "@/context/AvatarContext";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user, userData } = useAuth();
  const status = userData?.status || "trial";
  const { activeModule, setActiveModule } = useAvatar();
  const pathname = usePathname();
  const isCommunityActive = pathname === "/dashboard/community";

  const links = [
    { name: "Analytics", icon: Activity },
    { name: "Neural Interface", icon: Terminal },
    { name: "Diet AI", icon: Apple },
    { name: "Workouts", icon: Dumbbell },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-black/80 backdrop-blur-3xl h-[100dvh] flex flex-col p-6 hidden md:flex sticky top-0">
      <div className="flex flex-col items-center gap-4 mb-10 text-center">
        {user?.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Avatar" 
            className="w-20 h-20 rounded-full border-2 border-cyan-neon shadow-[0_0_20px_rgba(0,243,255,0.4)] object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-neon to-purple-neon border-2 border-cyan-neon flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            <Zap size={32} className="text-black" />
          </div>
        )}
        <div>
          <p className="text-xs text-cyan-neon font-mono uppercase tracking-widest mb-1">Avatar Connected</p>
          <h2 className="text-xl font-bold text-white truncate max-w-[200px]">
            {user?.displayName || "Initializing..."}
          </h2>
        </div>
      </div>

      <nav className="flex-1 space-y-4">
        {links.map((link) => {
          const isActive = activeModule === link.name;
          const Icon = link.icon;

          return (
            <button
              key={link.name}
              onClick={() => setActiveModule(link.name)}
              className={clsx(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-mono text-sm uppercase tracking-wider group text-left",
                isActive
                  ? "bg-gradient-to-r from-cyan-neon/20 to-transparent border-l-2 border-cyan-neon text-white text-glow-cyan"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon
                size={20}
                className={clsx(
                  "transition-colors",
                  isActive ? "text-cyan-neon" : "group-hover:text-cyan-neon/70"
                )}
              />
              {link.name}
            </button>
          );
        })}

        <Link
          href="/dashboard/community"
          className={clsx(
            "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-mono text-sm uppercase tracking-wider group text-left",
            isCommunityActive
              ? "bg-gradient-to-r from-cyan-neon/20 to-transparent border-l-2 border-cyan-neon text-white text-glow-cyan"
              : "text-gray-500 hover:text-white hover:bg-white/5"
          )}
        >
          <Globe
            size={20}
            className={clsx(
              "transition-colors",
              isCommunityActive ? "text-cyan-neon" : "group-hover:text-cyan-neon/70"
            )}
          />
          COMMUNITY
        </Link>
        
        <div className="pt-4">
          {status === "premium" ? (
            <div className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-white/5 border border-purple-500/50 text-purple-400 font-mono tracking-widest text-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              VIP CORE ACTIVE <span className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
          ) : (
            <Link
              href="/dashboard/premium"
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 font-mono tracking-widest group bg-white/5 border border-yellow-500/30 hover:border-yellow-400 hover:bg-yellow-500/10 shadow-[0_0_15px_rgba(250,204,21,0.1)] hover:shadow-[0_0_25px_rgba(250,204,21,0.3)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-yellow-500/5 animate-pulse pointer-events-none"></div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 font-black relative z-10 text-[15px]">PREMIUM ✦</span>
            </Link>
          )}
        </div>
      </nav>

      <div className="mt-auto border-t border-white/10 pt-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-neon/5 border border-purple-neon/20 group hover:border-purple-neon transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-neon to-cyan-neon flex items-center justify-center border border-white/20">
            <Skull size={20} className="text-black" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-wide">COMMANDER</p>
            <p className="text-xs text-purple-neon font-mono">Lvl 99 Ghost</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
