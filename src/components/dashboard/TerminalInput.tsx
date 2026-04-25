"use client";

import { Terminal, Send, Play } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAvatar } from "@/context/AvatarContext";

interface ChatMessage {
  role: "user" | "ai" | "system";
  content: string;
}

export default function TerminalInput() {
  const { user } = useAuth();
  const { stats, saveWorkout, saveDietPlan } = useAvatar();

  const [input, setInput] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const handleSaveDiet = (dietData: any, fullParsed: any = {}, rawAiText: string = "") => {
    if (!dietData) return;
    
    // 1. Scan the raw text globally for ALL [YT: tag] instances
    const globalRegex = /\[YT:\s*(.*?)\]/gi;
    const matches = [...rawAiText.matchAll(globalRegex)];

    // 2. Map the matches into an array of clean strings
    const extractedQueries = matches.map(match => match[1].trim());

    // 3. Fallback to video_recommendation if it exists and array is empty
    if (extractedQueries.length === 0 && fullParsed.video_recommendation) {
      extractedQueries.push(fullParsed.video_recommendation.replace(/\[YT:|\]/gi, '').trim());
    }

    // Unstructured text fallback support
    if (dietData.raw_fallback) {
      saveDietPlan({
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        name: "AI Cybernetic Ration",
        macros: dietData.raw_fallback,
        yt_queries: extractedQueries
      });
      return;
    }

    const newDiet = { 
      id: Date.now().toString(), 
      date: new Date().toLocaleDateString(), 
      name: "AI Cybernetic Ration", 
      ...dietData,
      video_recommendation: fullParsed.video_recommendation,
      yt_queries: extractedQueries
    };
    saveDietPlan(newDiet);
  };

  const handleSaveWorkout = (workoutData: any, fullParsed: any = {}, rawAiText: string = "") => {
    if (!workoutData) return;

    // 1. Scan the raw text globally for ALL [YT: tag] instances
    const globalRegex = /\[YT:\s*(.*?)\]/gi;
    const matches = [...rawAiText.matchAll(globalRegex)];

    // 2. Map the matches into an array of clean strings
    const extractedQueries = matches.map(match => match[1].trim());

    // 3. Fallback to video_recommendation if it exists and array is empty
    if (extractedQueries.length === 0 && fullParsed.video_recommendation) {
      extractedQueries.push(fullParsed.video_recommendation.replace(/\[YT:|\]/gi, '').trim());
    }

    // Unstructured text fallback support
    if (workoutData.raw_fallback) {
       saveWorkout({
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        type: "AI Kinetic Protocol",
        exercises: [{ name: workoutData.raw_fallback, completed: true }],
        steps: Math.floor(Math.random() * 5000) + 3000,
        distanceKm: parseFloat((Math.random() * 4 + 1).toFixed(1)),
        caloriesBurned: Math.floor(Math.random() * 300) + 200,
        yt_queries: extractedQueries
       });
       return;
    }

    const newWorkout = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      type: "AI Kinetic Protocol",
      steps: workoutData.steps || Math.floor(Math.random() * 5000) + 3000,
      distanceKm: workoutData.distanceKm || parseFloat((Math.random() * 4 + 1).toFixed(1)),
      caloriesBurned: workoutData.caloriesBurned || Math.floor(Math.random() * 300) + 200,
      ...workoutData,
      video_recommendation: fullParsed.video_recommendation,
      yt_queries: extractedQueries
    };

    // Mark exercises as completed so they show up in Protocols Executed
    if (newWorkout.workout_plan && newWorkout.workout_plan.plan) {
      newWorkout.workout_plan.plan.forEach((day: any) => {
        if (day.exercises) {
          day.exercises.forEach((ex: any) => {
            ex.completed = true;
          });
        }
      });
    } else if (newWorkout.plan) {
      newWorkout.plan.forEach((day: any) => {
        if (day.exercises) {
          day.exercises.forEach((ex: any) => {
            ex.completed = true;
          });
        }
      });
    }

    saveWorkout(newWorkout);
  };

  useEffect(() => {
    if (user?.displayName && stats.isCalibrated) {
      setChatHistory([
        { role: "system", content: `Syncing Neural Interface for Avatar ${user.displayName.toUpperCase()}... Processing vitals: ${stats.weight}kg, ${stats.height}cm...` }
      ]);
    } else {
      setChatHistory([{ role: "system", content: "SYSTEM ONLINE. Awaiting Neural Calibration..." }]);
    }
  }, [user?.displayName, stats.isCalibrated, stats.weight, stats.height]);

  const generateCustomWorkout = async () => {
    if (!stats.isCalibrated) return;
    
    setChatHistory((prev) => [...prev, { role: "user", content: `GENERATE PROTOCOL: ${stats.goal}` }]);
    setIsLoading(true);

    try {
      const payload = {
        action_matrix: `Generate a workout for goal: ${stats.goal}, weight: ${stats.weight}kg, height: ${stats.height}cm.\n\nCRITICAL: Never generate direct YouTube URLs. If the user asks for a video or visual demonstration, output the exact search term wrapped in brackets like this: [YT: Exercise Name].`
      };
      const res = await fetch("https://fitpromixai.onrender.com/api/environment/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { role: "ai", content: `Protocol Generated: ${data.response || data.observation?.message || "Data synced."}` }]);
    } catch (err) {
      setChatHistory((prev) => [...prev, { role: "ai", content: "ERROR: Connection to Neural Mainframe lost. Make sure backend is running on port 7860." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedGoal) return;

    let finalPrompt = input.trim();
    let displayInput = input.trim();

    if (selectedGoal) {
      if (finalPrompt) {
        finalPrompt = `The user has selected the goal: [${selectedGoal}]. Their specific request is: [${finalPrompt}]. Generate the protocol.`;
      } else {
        finalPrompt = `The user has selected the goal: [${selectedGoal}]. Generate the protocol.`;
      }
      displayInput = displayInput ? `[${selectedGoal}] ${displayInput}` : `[${selectedGoal}]`;
    }

    // Add user input
    setChatHistory((prev) => [...prev, { role: "user", content: displayInput }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("https://fitpromixai.onrender.com/api/environment/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action_matrix: `${finalPrompt}\n\nCRITICAL: Never generate direct YouTube URLs. If the user asks for a video or visual demonstration, output the exact search term wrapped in brackets like this: [YT: Exercise Name].` 
        }),
      });
      const data = await res.json();
      
      let aiResponse = "Data accepted. Matrix updated.";
      if (data.error && data.raw_response) aiResponse = data.raw_response;
      else if (data.feedback) aiResponse = data.feedback;
      else if (data.observation?.message) aiResponse = data.observation.message;
      else if (data.response) aiResponse = data.response;
      else aiResponse = JSON.stringify(data);

      const rewardText = data.reward !== undefined ? `[Reward: ${data.reward}] ` : "";
      
      setChatHistory((prev) => [...prev, { role: "ai", content: `${rewardText}${aiResponse}` }]);
    } catch (err) {
      setChatHistory((prev) => [...prev, { role: "ai", content: "ERROR: Connection to Neural Mainframe lost. Ensure Render Backend is LIVE." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const cleanText = (str?: string) => {
    if (!str) return '';
    return str.replace(/\[YT:\s*.*?\]/ig, '').trim();
  };

  const renderLogText = (text: string) => {
    const ytRegex = /\[YT:\s*(.*?)\]/ig;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = ytRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>);
      }
      
      const query = match[1];
      const encodedQuery = encodeURIComponent(query);
      const url = `https://www.youtube.com/results?search_query=${encodedQuery}`;
      
      parts.push(
        <a 
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center flex-wrap gap-2 mt-2 mb-2 px-3 py-1.5 glass-panel bg-cyan-900/20 border border-cyan-500/50 text-cyan-neon rounded-md hover:bg-cyan-800/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-300 shadow-[0_0_5px_rgba(0,255,255,0.2)]"
        >
          <Play size={14} className="text-cyan-neon shrink-0" /> 
          <span className="font-medium tracking-wide">ACCESS KINETIC ARCHIVE: {query}</span>
        </a>
      );
      
      lastIndex = ytRegex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }
    
    return parts.length > 0 ? parts : text;
  };

  const renderKineticSequence = (data: any) => {
    if (!data) return null;

    // 1. SMART NORMALIZER (redundant but safe)
    const wp = data.workout_plan || (data.plan ? data : null);
    const dp = data.diet_plan || (data.breakfast ? data : null);

    // 2. Render Workout Protocol
    if (wp && wp.plan) {
      return (
        <div className="flex flex-col gap-4">
          {/* Top Level Meta Data Badges */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {wp.goal && <div className="bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 text-xs text-center py-2 rounded-lg font-bold">GOAL: {wp.goal.toUpperCase()}</div>}
            {wp.focus && <div className="bg-purple-900/20 border border-purple-500/30 text-purple-400 text-xs text-center py-2 rounded-lg font-bold">FOCUS: {wp.focus.toUpperCase()}</div>}
            {wp.duration && <div className="bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 text-xs text-center py-2 rounded-lg font-bold">DUR: {wp.duration.toUpperCase()}</div>}
          </div>
          
          {/* The Nested Days Array */}
          {wp.plan.map((dayObj: any, idx: number) => (
            <div key={idx} className="p-4 bg-black/40 rounded-xl border border-white/5 shadow-lg">
              <h3 className="text-purple-400 font-extrabold uppercase tracking-wider border-b border-purple-500/20 pb-2 mb-3">
                {dayObj.day} {dayObj.focus ? `// ${dayObj.focus}` : ''}
              </h3>
              {dayObj.exercises && dayObj.exercises.length > 0 ? (
                <ul className="space-y-2">
                  {dayObj.exercises.map((ex: any, i: number) => (
                    <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                      <span className="font-bold text-cyan-400">{ex.name}</span>
                      <span className="text-gray-400 font-mono text-xs mt-2 sm:mt-0">
                        {ex.sets ? `${ex.sets} SETS` : ''} {ex.reps ? `× ${ex.reps}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-500 text-xs font-bold tracking-widest uppercase">Rest Protocol Initiated</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    // 3. Render Diet Protocol
    if (dp && (dp.breakfast || dp.lunch || dp.dinner)) {
      const mainMeals = ['breakfast', 'lunch', 'dinner'];
      
      return (
        <div className="flex flex-col gap-4">
          {/* Top Level Meta Data Badge */}
          {dp.goal && (
            <div className="mb-2">
              <div className="bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 text-xs text-center py-2 rounded-lg font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                NUTRITION GOAL: {dp.goal}
              </div>
            </div>
          )}

          {/* Main Meal Cards */}
          {mainMeals.map((meal) => {
            if (!dp[meal]) return null;
            return (
              <div key={meal} className="p-4 bg-black/40 rounded-xl border border-white/5 shadow-lg">
                <h3 className="text-purple-400 font-extrabold uppercase tracking-wider border-b border-purple-500/20 pb-2 mb-3 flex items-center gap-2">
                  <span className="text-cyan-400 text-lg leading-none">❖</span> {meal.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed whitespace-pre-wrap">
                  {cleanText(dp[meal] as string)}
                </p>
              </div>
            );
          })}

          {/* Snacks / Fuel Array */}
          {dp.snacks && Array.isArray(dp.snacks) && dp.snacks.length > 0 && (
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 shadow-lg">
              <h3 className="text-purple-400 font-extrabold uppercase tracking-wider border-b border-purple-500/20 pb-2 mb-3 flex items-center gap-2">
                <span className="text-cyan-400 text-lg leading-none">❖</span> OPTIONAL FUEL (SNACKS)
              </h3>
              <ul className="space-y-2">
                {dp.snacks.map((snack: any, idx: number) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-cyan-500 mt-0.5">▪</span> 
                    <span className="font-medium">{cleanText(snack)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Tips Array */}
          {dp.tips && Array.isArray(dp.tips) && dp.tips.length > 0 && (
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 shadow-lg">
              <h3 className="text-purple-400 font-extrabold uppercase tracking-wider border-b border-purple-500/20 pb-2 mb-3 flex items-center gap-2">
                <span className="text-cyan-400 text-lg leading-none">❖</span> PROTOCOL TIPS
              </h3>
              <ul className="space-y-2">
                {dp.tips.map((tip: any, idx: number) => (
                  <li key={idx} className="text-sm text-gray-400 italic flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">▪</span> {cleanText(tip)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    // 4. Fallback for older unstructured saves (CRITICAL: Ignore video_recommendations)
    return (
       <div className="text-gray-300 whitespace-pre-wrap text-[13px] leading-relaxed">
          {Object.entries(data || {}).map(([key, value]) => {
            if (key === 'id' || key === 'timestamp' || key === 'date' || key === 'type' || key === 'tips' || key === 'description' || key === 'steps' || key === 'distanceKm' || key === 'caloriesBurned' || key === 'video_recommendations' || key === 'yt_queries' || key === 'yt_query') return null;
            return (
              <div key={key} className="mb-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-purple-neon uppercase mb-2 text-xs tracking-widest">{key.replace(/_/g, ' ')}</h4>
                <div>{typeof value === 'string' ? cleanText(value) : JSON.stringify(value)}</div>
              </div>
            );
          })}
       </div>
    );
  };

  const renderLogContent = (contentString: string, msg: ChatMessage, msgIndex: number) => {
    if (msg.role === "system") {
      return <span className="whitespace-pre-wrap">{contentString}</span>;
    }

    let rawText = contentString;
    let prefix = "";

    const rewardMatch = contentString.match(/^(\[Reward:\s*[-.\d]+\]\s*)([\s\S]*)$/);
    if (rewardMatch) {
      prefix = rewardMatch[1];
      rawText = rewardMatch[2];
    }

    const cleanParsedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const isProtocol = msg.role === 'ai' && contentString.includes('{') && (contentString.toLowerCase().includes('workout') || contentString.toLowerCase().includes('diet') || contentString.toLowerCase().includes('plan') || contentString.toLowerCase().includes('breakfast'));

    const handleSaveAction = (rawStr: string) => {
       const isDiet = rawStr.toLowerCase().includes('diet') || rawStr.toLowerCase().includes('breakfast') || rawStr.toLowerCase().includes('meal');
       
       let parsed = null;
       const cText = rawStr.replace(/```json/gi, '').replace(/```/g, '').trim();
       try { parsed = JSON.parse(cText); } catch(e){}

       if (isDiet) {
           handleSaveDiet(parsed || { raw_fallback: rawStr }, parsed || {}, rawStr);
       } else {
           handleSaveWorkout(parsed || { raw_fallback: rawStr }, parsed || {}, rawStr);
       }
    };

    const renderVideoRecommendation = (query: string) => {
      const encodedQuery = encodeURIComponent(query);
      const url = `https://www.youtube.com/results?search_query=${encodedQuery}`;
      return (
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center flex-wrap gap-2 mt-4 mb-2 px-4 py-2 glass-panel bg-cyan-900/20 border border-cyan-500/50 text-cyan-neon rounded-md hover:bg-cyan-800/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-300 shadow-[0_0_5px_rgba(0,255,255,0.2)]"
        >
          <Play size={16} className="text-cyan-neon shrink-0" /> 
          <span className="font-medium tracking-wide text-sm">ACCESS KINETIC ARCHIVE: {query}</span>
        </a>
      );
    };

    try {
      const parsedData = JSON.parse(cleanParsedText);
      if (parsedData && typeof parsedData === "object") {
        
        // 1. SMART NORMALIZER
        const wp = parsedData.workout_plan || (parsedData.plan ? parsedData : null);
        const dp = parsedData.diet_plan || (parsedData.breakfast ? parsedData : null);
        
        const isValidProtocol = wp || dp;
        const actualDataToRender = isValidProtocol || parsedData;

        // 2. RENDER THE CARDS
        return (
          <div className="flex flex-col w-full">
            {prefix && <div className="text-cyan-neon/50 mb-3 text-xs">{prefix}</div>}
            {renderKineticSequence(actualDataToRender)}
            {parsedData.video_recommendation && renderVideoRecommendation(parsedData.video_recommendation)}
            
            {/* ACTION BUTTONS (Only render if it's actually a workout/diet protocol) */}
            {isValidProtocol && (
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-cyan-900/40">
                <button
                  onClick={() => {
                    handleSaveAction(contentString);
                    setChatHistory((prev) => prev.filter((_, idx) => idx !== msgIndex));
                  }} 
                  className="flex-1 py-3 bg-emerald-900/20 border border-emerald-500/50 rounded-lg text-emerald-400 font-bold hover:bg-emerald-900/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all uppercase tracking-widest text-xs"
                >
                  + SAVE PROTOCOL TO MATRIX
                </button>
                <button
                  onClick={() => setChatHistory((prev) => prev.filter((_, idx) => idx !== msgIndex))} 
                  className="px-6 py-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 font-bold hover:bg-red-900/40 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all uppercase tracking-widest text-xs"
                >
                  DISCARD
                </button>
              </div>
            )}
          </div>
        );
      }
    } catch (err) {
      // Fall through to raw text
    }

    return (
      <div className="flex flex-col w-full">
        <span className="whitespace-pre-wrap">{renderLogText(contentString)}</span>

        {/* ALWAYS render fallback buttons if it roughly looks like a protocol */}
        {isProtocol && (
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-cyan-900/40">
            <button
              onClick={() => {
                handleSaveAction(contentString);
                setChatHistory((prev) => prev.filter((_, idx) => idx !== msgIndex));
              }} 
              className="flex-1 py-3 bg-emerald-900/20 border border-emerald-500/50 rounded-lg text-emerald-400 font-bold hover:bg-emerald-900/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all uppercase tracking-widest text-xs"
            >
              + SAVE PROTOCOL TO MATRIX
            </button>
            <button
              onClick={() => setChatHistory((prev) => prev.filter((_, idx) => idx !== msgIndex))} 
              className="px-6 py-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 font-bold hover:bg-red-900/40 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all uppercase tracking-widest text-xs"
            >
              DISCARD
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-2xl border border-cyan-neon/30 overflow-hidden flex flex-col h-[70vh]">
      {/* Header */}
      <div className="bg-black/60 px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-neon">
          <Terminal size={18} />
          <h3 className="font-mono text-sm tracking-widest uppercase font-bold text-glow-cyan">
            Neural Interface
          </h3>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
      </div>

      {/* Log Area */}
      <div className="flex-1 overflow-y-auto cyber-scrollbar p-4 space-y-4 font-mono text-sm">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`rounded-lg px-4 py-2 flex flex-col ${
                msg.role === "user"
                  ? "max-w-[80%] bg-purple-neon/20 border border-purple-neon/30 text-white"
                  : msg.role === "system"
                  ? "w-full max-w-[95%] bg-cyan-900/10 border-l-2 border-cyan-neon text-cyan-neon/80"
                  : "w-full max-w-[95%] bg-cyan-neon/10 border border-cyan-neon/20 text-cyan-neon"
              }`}
            >
              <div className="flex items-start">
                {msg.role === "ai" && <span className="font-bold mr-2 mt-0.5">{">"}</span>}
                <div className="flex-1 w-full min-w-0">
                  {renderLogContent(msg.content, msg, i)}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-cyan-neon/10 border border-cyan-neon/20 text-cyan-neon max-w-[80%] rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="font-bold">{">"}</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-neon rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-cyan-neon rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-cyan-neon rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Kinetic Goal Selector */}
      <div className="p-3 bg-black/40 border-t border-white/5 flex flex-wrap gap-2">
        {["Hypertrophy (Muscle)", "Shred (Weight Loss)", "Core/Belly Fat", "Pure Strength", "Custom Override"].map((chipName) => (
          <button
            key={chipName}
            type="button"
            onClick={() => setSelectedGoal(selectedGoal === chipName ? "" : chipName)}
            className={`px-3 py-1.5 text-xs rounded-md border transition-all duration-300 ${
              selectedGoal === chipName
                ? "bg-cyan-900/40 border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.6)] text-cyan-neon font-bold"
                : "bg-white/5 border-cyan-500/30 text-gray-400 hover:text-cyan-100"
            }`}
          >
            {chipName}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-black/40 border-t border-white/5 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter physiological data parameter..."
          className="w-full bg-transparent border-none text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:ring-0 px-2"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-neon/50 hover:text-cyan-neon transition-colors"
          disabled={isLoading}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
