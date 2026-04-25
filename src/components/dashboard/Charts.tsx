"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useAvatar } from "@/context/AvatarContext";

const pieData = [
  { name: "Protein", value: 35 },
  { name: "Carbs", value: 45 },
  { name: "Fats", value: 20 },
];
const COLORS = ["#00f3ff", "#d500f9", "#3b82f6"];

export function KineticOutputChart({ logs = [] }: { logs?: any[] | null }) {
  const processLineData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];
    const today = new Date();
    
    // If logs is null (loading), we can return empty data or zeros
    const activeLogs = logs || [];

    // Build last 7 days dynamically
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      
      // Handle the fact that Firestore timestamps might be objects or dates
      const output = activeLogs.reduce((sum, log) => {
        let logDate = null;
        if (log.timestamp?.toDate) {
          logDate = log.timestamp.toDate().toLocaleDateString();
        } else if (log.date) {
          logDate = log.date;
        }

        if (logDate === d.toLocaleDateString()) {
          return sum + (Number(log.caloriesBurned) || 0);
        }
        return sum;
      }, 0);
      
      result.push({ name: dayName, output });
    }
    
    return result;
  };

  const lineData = processLineData();

  if (logs === null) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-80 flex flex-col items-center justify-center animate-pulse border border-cyan-500/30 bg-cyan-900/10">
        <div className="w-16 h-16 border-4 border-cyan-neon border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-mono text-cyan-500 font-bold tracking-widest uppercase">Fetching Matrix Logs...</span>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl h-80 flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
          Weekly Kinetic Output
        </h3>
        <p className="text-xs text-cyan-neon font-mono">System Energy Expenditure (kJ)</p>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="#666" tick={{ fill: "#666", fontSize: 12 }} border-glow-cyan />
            <YAxis stroke="#666" tick={{ fill: "#666", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(0, 243, 255, 0.5)", borderRadius: "8px" }}
              itemStyle={{ color: "#00f3ff" }}
            />
            <Line
              type="monotone"
              dataKey="output"
              stroke="#00f3ff"
              strokeWidth={3}
              dot={{ r: 4, fill: "#000", stroke: "#00f3ff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#00f3ff", className: "animate-pulse" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DailyMacrosChart() {
  return (
    <div className="glass-panel p-6 rounded-2xl h-80 flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
          Daily Macros
        </h3>
        <p className="text-xs text-purple-neon font-mono">Fuel Distribution Matrix</p>
      </div>
      <div className="flex-1 w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              stroke="none"
              paddingAngle={5}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(213, 0, 249, 0.5)", borderRadius: "8px" }}
              itemStyle={{ color: "#d500f9" }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center overlay text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-white text-glow-purple">100%</span>
          <span className="text-[10px] text-gray-500 uppercase font-mono tracking-widest">Optimized</span>
        </div>
      </div>
    </div>
  );
}
