"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { AvatarProvider } from "@/context/AvatarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AvatarProvider>
      <div className="flex min-h-screen bg-black text-white selection:bg-cyan-neon selection:text-black font-sans">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative">
          {/* Adds a slight glow to the background globally */}
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-neon/10 via-black to-black opacity-50" />
          {children}
        </main>
      </div>
    </AvatarProvider>
  );
}

