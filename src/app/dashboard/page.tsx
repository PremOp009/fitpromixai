"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAvatar } from "@/context/AvatarContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import KineticAssayReport, { KineticStats } from "@/components/KineticAssayReport";

import MetricCard from "@/components/dashboard/MetricCard";
import { KineticOutputChart, DailyMacrosChart } from "@/components/dashboard/Charts";
import TerminalInput from "@/components/dashboard/TerminalInput";
import NeuralOnboarding from "@/components/dashboard/NeuralOnboarding";
import DietModule from "@/components/dashboard/DietModule";
import WorkoutModule from "@/components/dashboard/WorkoutModule";
import { Weight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, userData } = useAuth();
  const status = userData?.status || "trial";
  const { stats, activeModule, savedWorkouts } = useAvatar();

  const totalSteps = savedWorkouts.reduce((sum, w) => sum + (Number(w.steps) || 0), 0);
  const totalDistance = savedWorkouts.reduce((sum, w) => sum + (Number(w.distanceKm) || 0), 0).toFixed(1);



  // 🛡️ PATIENT ROUTE GUARD (Firebase Auth Hook)
  useEffect(() => {
    if (!loading && !user) {
      router.push("/"); // Kick them back to landing page
    }
  }, [user, loading, router]);

  const [matrixStats, setMatrixStats] = useState<KineticStats | null>(null);

  const [firebaseLogs, setFirebaseLogs] = useState<any[] | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, "workout_logs"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let totalSessions = 0;
      let totalCalories = 0;
      const logs: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        logs.push({ id: doc.id, ...data });
        totalSessions += 1;
        if (data.caloriesBurned) {
          totalCalories += Number(data.caloriesBurned);
        }
      });

      setFirebaseLogs(logs);

      setMatrixStats({
        protocols: `${totalSessions} Sessions Completed`,
        calories: `${totalCalories} kcal Burned`,
        compliance: totalSessions >= 4 ? "99.9% (Optimum)" : "Requires Attention",
        lowerBodyStatus: "Power Output Maximum",
      });
    }, (error) => {
      console.error("Error fetching workout data:", error);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-cyan-400 bg-black font-mono tracking-widest animate-pulse">
        VERIFYING NEURAL LINK...
      </div>
    );
  }

  // Prevent flash of content if user is null right before redirect kicks in
  if (!user) return null;

  return (
    <>
      <NeuralOnboarding />
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {status === "premium" && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/50 backdrop-blur-md rounded-2xl p-5 shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-3 relative overflow-hidden ring-1 ring-purple-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 animate-pulse pointer-events-none"></div>
            <span className="text-2xl relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">👑</span>
            <p className="text-white font-mono text-sm md:text-base text-center relative z-10 font-bold tracking-wide">
              Welcome back, VIP. Neural sync limits disabled. Maximum hypertrophy unlocked.
            </p>
          </motion.div>
        )}

        {/* Header - Always Visible */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-tighter mix-blend-plus-lighter">
            {activeModule} // {user?.displayName?.toUpperCase() || "UNKNOWN"}
          </h1>
          <p className="text-cyan-neon font-mono text-sm mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-neon animate-pulse" />
            SYSTEMS NOMINAL. MATRICES SYNCHRONIZED.
          </p>
        </div>

        {/* Dynamic View Switcher */}
        <AnimatePresence mode="wait">
          {activeModule === "Analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Current Mass"
                  value={stats.weight ? `${stats.weight} kg` : "N/A"}
                  subtitle="Verified via Neural Sync"
                  icon={Weight}
                  trend="neutral"
                  color="cyan"
                />
                {firebaseLogs === null ? (
                  <>
                    <div className="glass-panel p-6 rounded-2xl h-[120px] animate-pulse bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center">
                      <span className="font-mono text-cyan-500 text-sm tracking-widest">SYNCING MATRIX...</span>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl h-[120px] animate-pulse bg-purple-900/20 border border-purple-500/30 flex items-center justify-center">
                      <span className="font-mono text-purple-500 text-sm tracking-widest">SYNCING MATRIX...</span>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl h-[120px] animate-pulse bg-emerald-900/20 border border-emerald-500/30 flex items-center justify-center">
                      <span className="font-mono text-emerald-500 text-sm tracking-widest">SYNCING MATRIX...</span>
                    </div>
                  </>
                ) : (
                  <>
                    <MetricCard
                      title="Total Calories"
                      value={`${firebaseLogs.reduce((acc, log) => acc + (Number(log.caloriesBurned) || 0), 0)} kcal`}
                      subtitle="Lifetime expenditure"
                      icon={Activity}
                      trend="up"
                      color="cyan"
                    />
                    <MetricCard
                      title="Protocols Executed"
                      value={firebaseLogs.length.toString()}
                      subtitle="Matrix entries"
                      icon={Activity}
                      trend="up"
                      color="purple"
                    />
                    <MetricCard
                      title="Total Footfalls"
                      value={totalSteps > 0 ? totalSteps.toLocaleString() : "0"}
                      subtitle="Detected via Avatar Context"
                      icon={Activity}
                      trend="up"
                      color="cyan"
                    />
                  </>
                )}
              </div>
              
              {/* Massive Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <KineticOutputChart logs={firebaseLogs} />
                <DailyMacrosChart />
              </div>

              <div className="flex justify-end pt-4">
                <KineticAssayReport stats={matrixStats} />
              </div>
            </motion.div>
          )}

          {activeModule === "Neural Interface" && (
            <motion.div
              key="neural"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col"
            >
              <div className="w-full h-[70vh] shadow-[0_0_50px_rgba(0,243,255,0.05)] relative z-10">
                <TerminalInput />
              </div>
            </motion.div>
          )}

          {activeModule === "Diet AI" && (
            <motion.div
              key="diet"
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
            >
              <DietModule />
            </motion.div>
          )}

          {activeModule === "Workouts" && (
            <motion.div
              key="workouts"
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
            >
              <WorkoutModule />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
