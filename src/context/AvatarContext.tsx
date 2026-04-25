"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface AvatarStats {
  weight: number | null;
  height: number | null;
  goal: "Cut" | "Bulk" | "Recomp" | null;
  isCalibrated: boolean;
}

export interface DietPlan {
  id: string;
  date: string;
  name: string;
  macros?: string;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string[];
  tips?: string[];
  video_recommendation?: string;
  yt_query?: string;
  yt_queries?: string[];
}

export interface WorkoutPlan {
  id: string;
  date: string;
  type: string;
  exercises?: string[];
  description?: string;
  plan?: any[];
  tips?: string[];
  video_recommendation?: string;
  yt_query?: string;
  yt_queries?: string[];
  steps?: number;
  distanceKm?: number;
  caloriesBurned?: number;
}

interface AvatarContextType {
  stats: AvatarStats;
  calibrateAvatar: (weight: number, height: number, goal: "Cut" | "Bulk" | "Recomp") => void;
  bmi: string | null;
  activeModule: string;
  setActiveModule: (module: string) => void;
  savedDiets: DietPlan[];
  savedWorkouts: WorkoutPlan[];
  saveDietPlan: (plan: DietPlan) => void;
  saveWorkout: (workout: WorkoutPlan) => void;
  updateDietPlan: (plan: DietPlan) => void;
  updateWorkout: (workout: WorkoutPlan) => void;
  deleteDietPlan: (id: string) => void;
  deleteWorkout: (id: string) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function AvatarProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<AvatarStats>({ weight: null, height: null, goal: null, isCalibrated: false });
  const [activeModule, setActiveModule] = useState("Analytics");
  const [savedDiets, setSavedDiets] = useState<DietPlan[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutPlan[]>([]);

  // Load from Mock DB (LocalStorage keyed by email)
  useEffect(() => {
    if (user?.email) {
      const storedStats = localStorage.getItem(`avatarStats_${user.email}`);
      if (storedStats) setStats(JSON.parse(storedStats));

      const storedDiets = localStorage.getItem(`avatarDiets_${user.email}`);
      if (storedDiets) setSavedDiets(JSON.parse(storedDiets));

      const storedWorkouts = localStorage.getItem(`avatarWorkouts_${user.email}`);
      if (storedWorkouts) setSavedWorkouts(JSON.parse(storedWorkouts));
    }
  }, [user?.email]);

  const calibrateAvatar = (weight: number, height: number, goal: "Cut" | "Bulk" | "Recomp") => {
    const newStats = { weight, height, goal, isCalibrated: true };
    setStats(newStats);
    if (user?.email) {
      localStorage.setItem(`avatarStats_${user.email}`, JSON.stringify(newStats));
    }
  };

  const saveDietPlan = (plan: DietPlan) => {
    setSavedDiets((prev) => {
      const newDiets = [plan, ...prev];
      if (user?.email) {
        localStorage.setItem(`avatarDiets_${user.email}`, JSON.stringify(newDiets));
      }
      return newDiets;
    });
  };

  const saveWorkout = (workout: WorkoutPlan) => {
    setSavedWorkouts((prev) => {
      const newWorkouts = [workout, ...prev];
      if (user?.email) {
        localStorage.setItem(`avatarWorkouts_${user.email}`, JSON.stringify(newWorkouts));
      }
      return newWorkouts;
    });
  };

  const deleteDietPlan = (id: string) => {
    setSavedDiets(prev => {
      const newDiets = prev.filter((d) => d.id !== id);
      if (user?.email) localStorage.setItem(`avatarDiets_${user.email}`, JSON.stringify(newDiets));
      return newDiets;
    });
  };

  const deleteWorkout = (id: string) => {
    setSavedWorkouts(prev => {
      const newWorkouts = prev.filter((w) => w.id !== id);
      if (user?.email) localStorage.setItem(`avatarWorkouts_${user.email}`, JSON.stringify(newWorkouts));
      return newWorkouts;
    });
  };

  const updateDietPlan = (updatedDiet: DietPlan) => {
    setSavedDiets((prev) => {
      const newDiets = prev.map((d) => (d.id === updatedDiet.id ? updatedDiet : d));
      if (user?.email) {
        localStorage.setItem(`avatarDiets_${user.email}`, JSON.stringify(newDiets));
      }
      return newDiets;
    });
  };

  const updateWorkout = (updatedWorkout: WorkoutPlan) => {
    setSavedWorkouts((prev) => {
      const newWorkouts = prev.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w));
      if (user?.email) {
        localStorage.setItem(`avatarWorkouts_${user.email}`, JSON.stringify(newWorkouts));
      }
      return newWorkouts;
    });
  };

  const bmi = stats.weight && stats.height 
    ? (stats.weight / Math.pow(stats.height / 100, 2)).toFixed(1) 
    : null;

  return (
    <AvatarContext.Provider value={{ stats, calibrateAvatar, bmi, activeModule, setActiveModule, savedDiets, savedWorkouts, saveDietPlan, saveWorkout, updateDietPlan, updateWorkout, deleteDietPlan, deleteWorkout }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error("useAvatar must be used within an AvatarProvider");
  }
  return context;
}
