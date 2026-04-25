"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Activity } from "lucide-react";

interface LogWorkoutButtonProps {
  workoutType?: string;
  caloriesBurned?: number;
  onSuccess?: () => void;
}

export default function LogWorkoutButton({ workoutType = "Unknown Protocol", caloriesBurned = 0, onSuccess }: LogWorkoutButtonProps) {
  const { user } = useAuth();
  const [isLogging, setIsLogging] = useState(false);

  const handleLogWorkout = async () => {
    if (!user) {
      alert("Authentication required. Matrix link severed.");
      return;
    }

    setIsLogging(true);

    try {
      const workoutLogsRef = collection(db, "workout_logs");
      
      await addDoc(workoutLogsRef, {
        userId: user.uid,
        workoutType: workoutType,
        caloriesBurned: caloriesBurned,
        status: "COMPLETED",
        timestamp: serverTimestamp(),
      });

      alert("PROTOCOL LOGGED SUCCESSFULLY");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error logging workout to Matrix:", error);
      alert("SYSTEM ERROR: Failed to log protocol.");
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <button
      onClick={handleLogWorkout}
      disabled={isLogging}
      className="group relative w-full flex items-center justify-center gap-3 bg-green-500/10 border border-green-400 text-green-400 hover:bg-green-500/30 transition-all duration-300 font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(74,222,128,0.2)] hover:shadow-[0_0_25px_rgba(74,222,128,0.4)] disabled:opacity-50 overflow-hidden"
    >
      <div className="absolute inset-0 w-0 bg-green-400/20 group-hover:w-full transition-all duration-500 ease-out"></div>
      <Activity size={18} className="relative z-10" />
      <span className="relative z-10">
        {isLogging ? "UPLOADING TO MATRIX..." : "UPDATE MATRIX LOG"}
      </span>
    </button>
  );
}
