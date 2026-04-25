"use client";

import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color?: "cyan" | "purple";
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "cyan",
}: MetricCardProps) {
  const isCyan = color === "cyan";

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      {/* Background glow effect */}
      <div
        className={clsx(
          "absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity",
          isCyan ? "bg-cyan-neon" : "bg-purple-neon"
        )}
      />

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-1">
            {title}
          </p>
          <h3
            className={clsx(
              "text-3xl font-black tracking-tighter",
              isCyan ? "text-glow-cyan text-white" : "text-glow-purple text-white"
            )}
          >
            {value}
          </h3>
          <p className="text-gray-500 text-xs mt-2 font-mono flex items-center gap-1">
            {trend === "up" && <span className="text-green-400">↑</span>}
            {trend === "down" && <span className="text-red-400">↓</span>}
            {subtitle}
          </p>
        </div>
        
        <div
          className={clsx(
            "p-3 rounded-xl border border-white/5",
            isCyan ? "bg-cyan-neon/10" : "bg-purple-neon/10"
          )}
        >
          <Icon
            size={24}
            className={isCyan ? "text-cyan-neon" : "text-purple-neon"}
          />
        </div>
      </div>
    </div>
  );
}
