import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAvatar, WorkoutPlan } from "@/context/AvatarContext";
import { Plus, Dumbbell, Calendar, Activity, X, Trash2 } from "lucide-react";
import LogWorkoutButton from "@/components/LogWorkoutButton";

export default function WorkoutModule() {
  const { savedWorkouts, saveWorkout, updateWorkout, deleteWorkout } = useAvatar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WorkoutPlan | null>(null);
  const [editedItem, setEditedItem] = useState<WorkoutPlan | null>(null);

  useEffect(() => {
    if (selectedItem) {
      setEditedItem(JSON.parse(JSON.stringify(selectedItem)));
    } else {
      setEditedItem(null);
    }
  }, [selectedItem]);
  
  // Form state
  const [type, setType] = useState("");
  const [exercisesText, setExercisesText] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !exercisesText) return;
    
    const exercises = exercisesText.split('\n').filter(line => line.trim().length > 0);
    
    saveWorkout({
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(),
      type,
      exercises,
    });
    setType("");
    setExercisesText("");
    setIsModalOpen(false);
  };

  const cleanText = (str?: string) => {
    if (!str) return '';
    return str.replace(/\[YT:\s*.*?\]/ig, '').trim();
  };

  const renderArchiveContent = () => {
    if (!editedItem) return null;

    const toggleExercise = (dayIndex: number, exIndex: number) => {
      const newData = { ...editedItem };
      const wp: any = newData.workout_plan || (newData.plan ? newData : null);
      
      if (wp && wp.plan[dayIndex].exercises[exIndex]) {
        const currentStatus = wp.plan[dayIndex].exercises[exIndex].completed;
        wp.plan[dayIndex].exercises[exIndex].completed = !currentStatus;
        setEditedItem(newData);
      }
    };

    // 1. SMART NORMALIZER: Find the payload wherever it hides
    const wp: any = editedItem.workout_plan || (editedItem.plan ? editedItem : null);
    const dp: any = editedItem.diet_plan || (editedItem.breakfast ? editedItem : null);

    // 2. Check if it's the strict Workout Schema
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
                    <li 
                      key={i} 
                      onClick={() => toggleExercise(idx, i)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between text-sm cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${ex.completed ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.6)]' : 'border border-cyan-500/30'}`}>
                          {ex.completed && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`font-bold transition-all ${ex.completed ? 'text-gray-500 line-through' : 'text-cyan-400 group-hover:text-cyan-300'}`}>{ex.name}</span>
                      </div>
                      <span className={`font-mono text-xs mt-2 sm:mt-0 transition-all ${ex.completed ? 'text-gray-600 line-through' : 'text-gray-400'}`}>
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
            if (!dp[meal as keyof typeof dp]) return null;
            return (
              <div key={meal} className="p-4 bg-black/40 rounded-xl border border-white/5 shadow-lg">
                <h3 className="text-purple-400 font-extrabold uppercase tracking-wider border-b border-purple-500/20 pb-2 mb-3 flex items-center gap-2">
                  <span className="text-cyan-400 text-lg leading-none">❖</span> {meal.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed whitespace-pre-wrap">
                  {cleanText(dp[meal as keyof typeof dp] as string)}
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

    // 4. Fallback for older unstructured saves
    return (
       <div className="text-gray-300 whitespace-pre-wrap text-[13px] leading-relaxed">
          {Object.entries(editedItem || {}).map(([key, value]) => {
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon to-purple-neon tracking-wide flex items-center gap-3">
          <Dumbbell className="text-cyan-neon" /> Kinetic Archive
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-neon/20 hover:bg-cyan-neon/40 border border-cyan-neon text-cyan-neon px-6 py-3 rounded-xl font-bold font-mono tracking-wider transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] flex items-center gap-2"
        >
          <Plus size={18} /> LOG KINETIC ROUTINE
        </button>
      </div>

      {/* Data Grid */}
      {savedWorkouts.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 flex border-cyan-neon/20 shadow-[0_0_40px_rgba(0,243,255,0.05)] bg-black/60 relative overflow-hidden items-center justify-center">
          <p className="text-gray-500 font-mono text-center text-lg tracking-widest uppercase">
            No kinetic logs detected in the matrix. Consult the Neural Interface to generate a routine.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedWorkouts.map((workout) => (
            <div 
              key={workout.id} 
              onClick={() => setSelectedItem(workout)}
              className="glass-panel bg-white/5 border border-cyan-neon/50 rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 font-mono text-sm flex items-center gap-2">
                  <Calendar size={14} className="text-cyan-neon" /> {workout.date}
                </p>
                <div className="w-2 h-2 rounded-full bg-cyan-neon animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide uppercase">{workout.type}</h3>
              <div className="bg-black/50 rounded-lg p-4 border border-white/5 mt-4 space-y-2">
                {workout.exercises && Array.isArray(workout.exercises) ? workout.exercises.map((exercise, idx) => (
                  <p key={idx} className="text-sm text-cyan-100/80 font-mono flex items-start gap-2">
                    <span className="text-cyan-neon mt-1">{"•"}</span> {exercise}
                  </p>
                )) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedItem && editedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              drag
              dragMomentum={false}
              className="glass-panel w-full max-w-lg bg-black/95 border border-cyan-neon/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.3)] relative"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-neon rounded-full animate-pulse" />
                  Kinetic Intel
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      deleteWorkout(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all"
                    title="Delete Record"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div 
                className="p-8 space-y-6 max-h-[70vh] overflow-y-auto cyber-scrollbar"
                onPointerDownCapture={(e) => e.stopPropagation()}
              >
                <div>
                  <p className="text-sm font-mono text-purple-neon mb-1 uppercase tracking-widest">Protocol Type</p>
                  <input
                    type="text"
                    value={editedItem.type}
                    onChange={(e) => setEditedItem({ ...editedItem, type: e.target.value })}
                    className="w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-cyan-neon focus:outline-none text-3xl font-black text-white transition-all py-1"
                  />
                </div>
                <div>
                  <p className="text-sm font-mono text-purple-neon mb-1 uppercase tracking-widest">Timestamp</p>
                  <p className="text-gray-300 font-mono text-lg">{editedItem.date}</p>
                </div>
                
                {editedItem.description && (
                  <div>
                    <p className="text-glow-cyan text-cyan-neon font-semibold text-[15px] leading-relaxed">
                      {cleanText(editedItem.description)}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-mono text-purple-neon mb-1 uppercase tracking-widest">Kinetic Input Logs</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 bg-white/5 flex flex-col relative group">
                      <label className="text-xs font-bold text-cyan-neon uppercase tracking-widest mb-2 z-10 group-focus-within:text-white transition-colors">Steps Taken</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={editedItem.steps || ""}
                        onChange={(e) => setEditedItem({ ...editedItem, steps: Number(e.target.value) })}
                        className="bg-transparent border-none text-2xl font-black text-white font-mono focus:outline-none focus:ring-0 z-10 w-full"
                      />
                      <div className="absolute inset-0 bg-cyan-900/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none shadow-[0_0_15px_rgba(0,243,255,0.2)]"></div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 bg-white/5 flex flex-col relative group">
                      <label className="text-xs font-bold text-cyan-neon uppercase tracking-widest mb-2 z-10 group-focus-within:text-white transition-colors">Distance (km)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.0"
                        value={editedItem.distanceKm || ""}
                        onChange={(e) => setEditedItem({ ...editedItem, distanceKm: Number(e.target.value) })}
                        className="bg-transparent border-none text-2xl font-black text-white font-mono focus:outline-none focus:ring-0 z-10 w-full"
                      />
                      <div className="absolute inset-0 bg-cyan-900/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none shadow-[0_0_15px_rgba(0,243,255,0.2)]"></div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 bg-white/5 flex flex-col relative group">
                      <label className="text-xs font-bold text-cyan-neon uppercase tracking-widest mb-2 z-10 group-focus-within:text-white transition-colors">Cals Burned</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={editedItem.caloriesBurned || ""}
                        onChange={(e) => setEditedItem({ ...editedItem, caloriesBurned: Number(e.target.value) })}
                        className="bg-transparent border-none text-2xl font-black text-white font-mono focus:outline-none focus:ring-0 z-10 w-full"
                      />
                      <div className="absolute inset-0 bg-cyan-900/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none shadow-[0_0_15px_rgba(0,243,255,0.2)]"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-mono text-purple-neon mb-1 uppercase tracking-widest">Kinetic Sequences</p>
                  
                  {renderArchiveContent()}

                  {editedItem.tips && Array.isArray(editedItem.tips) && editedItem.tips.length > 0 && (
                    <div className="mt-4 glass-panel p-4 rounded-xl border border-purple-500/50 bg-purple-900/10">
                      <h4 className="text-purple-neon font-bold uppercase tracking-wider mb-2 border-b border-purple-500/30 pb-1.5">
                        Optimization Protocol
                      </h4>
                      <ul className="space-y-1.5 list-none m-0 p-0 text-purple-200/90 text-[13px] leading-relaxed">
                        {editedItem.tips.map((tip: string, tIdx: number) => (
                          <li key={tIdx} className="flex items-start gap-2">
                            <span className="text-purple-neon mt-0.5">{"•"}</span>
                            <div className="flex-1">{cleanText(tip)}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Handle both new Array format and old String format */}
                  {(() => {
                    const videoArray = editedItem.video_recommendations || editedItem.yt_queries || ((editedItem as any).yt_query ? [(editedItem as any).yt_query] : []);
                    
                    if (videoArray && Array.isArray(videoArray) && videoArray.length > 0) {
                      return (
                        <div className="mt-6 border-t border-cyan-900/40 pt-6 flex flex-col gap-3">
                          <h4 className="text-xs font-bold text-gray-500 tracking-widest uppercase">Attached Kinetic Media</h4>
                          {videoArray.map((query: string, index: number) => (
                            <a
                              key={index}
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query.replace(/\[YT:|\]/gi, '').trim())}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between px-6 py-3 bg-cyan-900/20 border border-cyan-500/50 rounded-xl text-cyan-400 font-bold tracking-widest hover:bg-cyan-900/40 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all"
                            >
                              <span className="truncate">▶ ARCHIVE: {query.replace(/\[YT:|\]/gi, '').trim().toUpperCase()}</span>
                            </a>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <div className="mt-8">
                    <LogWorkoutButton 
                      workoutType={editedItem.type || "AI Kinetic Protocol"}
                      caloriesBurned={editedItem.caloriesBurned || 0}
                      onSuccess={() => setSelectedItem(null)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              drag
              dragMomentum={false}
              className="glass-panel w-full max-w-md bg-black/90 border border-cyan-neon/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.3)] relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-neon rounded-full" />
                  Log Kinetic Routine
                </h3>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-4" onPointerDownCapture={(e) => e.stopPropagation()}>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Protocol Type</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    placeholder="e.g. Hypertrophy, Cardio"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-cyan-neon focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Kinetic Sequences (One per line)</label>
                  <textarea
                    value={exercisesText}
                    onChange={(e) => setExercisesText(e.target.value)}
                    required
                    rows={4}
                    placeholder="Bench Press 4x10&#10;Squat 3x8"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-cyan-neon focus:outline-none transition-colors resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-900 to-cyan-600 hover:from-cyan-800 hover:to-cyan-500 text-white font-bold py-3 rounded-lg uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(0,243,255,0.5)] mt-4"
                >
                  Encrypt to Matrix
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
