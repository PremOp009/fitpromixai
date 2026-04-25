import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAvatar, DietPlan } from "@/context/AvatarContext";
import { Plus, Apple, Calendar, Activity, X, Trash2 } from "lucide-react";

export default function DietModule() {
  const { savedDiets, saveDietPlan, updateDietPlan, deleteDietPlan } = useAvatar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DietPlan | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [macros, setMacros] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !macros) return;
    saveDietPlan({
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(),
      name,
      macros,
    });
    setName("");
    setMacros("");
    setIsModalOpen(false);
  };

  const cleanText = (str?: string) => {
    if (!str) return '';
    return str.replace(/\[YT:\s*.*?\]/ig, '').trim();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-neon to-cyan-neon tracking-wide flex items-center gap-3">
          <Apple className="text-purple-neon" /> Nutritional Archive
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-neon/20 hover:bg-purple-neon/40 border border-purple-neon text-purple-neon px-6 py-3 rounded-xl font-bold font-mono tracking-wider transition-all shadow-[0_0_15px_rgba(181,0,255,0.4)] flex items-center gap-2"
        >
          <Plus size={18} /> LOG NEW RATION
        </button>
      </div>

      {/* Data Grid */}
      {savedDiets.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 flex border-purple-neon/20 shadow-[0_0_40px_rgba(181,0,255,0.05)] bg-black/60 relative overflow-hidden items-center justify-center">
          <p className="text-gray-500 font-mono text-center text-lg tracking-widest uppercase">
            No nutritional logs detected in the matrix. Consult the Neural Interface to generate a diet plan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedDiets.map((diet) => (
            <div 
              key={diet.id} 
              onClick={() => setSelectedItem(diet)}
              className="glass-panel bg-white/5 border border-purple-neon/50 rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(181,0,255,0.2)] transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 font-mono text-sm flex items-center gap-2">
                  <Calendar size={14} className="text-purple-neon" /> {diet.date}
                </p>
                <div className="w-2 h-2 rounded-full bg-purple-neon animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide uppercase">{diet.name}</h3>
              <div className="bg-black/50 rounded-lg p-3 border border-white/5 mt-4">
                <p className="text-sm text-cyan-neon font-mono flex items-center gap-2">
                  <Activity size={14} /> {diet.macros}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedItem && (
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
              className="glass-panel w-full max-w-lg bg-black/95 border border-purple-neon/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(181,0,255,0.3)] relative"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-neon rounded-full animate-pulse" />
                  Ration Intel
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      deleteDietPlan(selectedItem.id);
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
                  <p className="text-sm font-mono text-purple-neon mb-1 uppercase tracking-widest">Protocol Name</p>
                  <input
                    type="text"
                    value={selectedItem.name}
                    onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                    className="w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-purple-neon focus:outline-none text-3xl font-black text-white transition-all py-1"
                  />
                </div>
                <div>
                  <p className="text-sm font-mono text-purple-neon mb-1 uppercase tracking-widest">Timestamp</p>
                  <p className="text-gray-300 font-mono text-lg">{selectedItem.date}</p>
                </div>
                <div>
                  <p className="text-sm font-mono text-purple-neon mb-1 uppercase tracking-widest">Macro Breakdown</p>
                  
                  {(() => {
                    // 1. SMART NORMALIZER: Find the diet data whether it's nested or flattened
                    const dp: any = (selectedItem as any).diet_plan || ((selectedItem as any).breakfast ? selectedItem : null);

                    if (dp && (dp.breakfast || dp.lunch || dp.dinner)) {
                      const mainMeals = ['breakfast', 'lunch', 'dinner'];
                      
                      return (
                        <div className="flex flex-col gap-4 w-full mt-2">
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
                              <div key={meal} className="p-4 bg-black/40 rounded-xl border border-white/5 shadow-lg w-full">
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
                            <div className="p-4 bg-black/40 rounded-xl border border-white/5 shadow-lg w-full">
                              <h3 className="text-purple-400 font-extrabold uppercase tracking-wider border-b border-purple-500/20 pb-2 mb-3 flex items-center gap-2">
                                <span className="text-cyan-400 text-lg leading-none">❖</span> OPTIONAL FUEL (SNACKS)
                              </h3>
                              <ul className="space-y-2">
                                {dp.snacks.map((snack: any, idx: number) => (
                                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                    <span className="text-cyan-500 mt-0.5">▪</span> 
                                    <span className="font-medium whitespace-pre-wrap">{cleanText(snack)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* AI Tips Array */}
                          {dp.tips && Array.isArray(dp.tips) && dp.tips.length > 0 && (
                            <div className="p-4 bg-black/40 rounded-xl border border-white/5 shadow-lg w-full">
                              <h3 className="text-purple-400 font-extrabold uppercase tracking-wider border-b border-purple-500/20 pb-2 mb-3 flex items-center gap-2">
                                <span className="text-cyan-400 text-lg leading-none">❖</span> PROTOCOL TIPS
                              </h3>
                              <ul className="space-y-2">
                                {dp.tips.map((tip: any, idx: number) => (
                                  <li key={idx} className="text-sm text-gray-400 italic flex items-start gap-2">
                                    <span className="text-purple-500 mt-0.5">▪</span> <span className="whitespace-pre-wrap">{cleanText(tip)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div className="bg-white/5 border border-purple-neon/30 rounded-xl p-4 mt-2">
                        <p className="text-white font-mono leading-relaxed whitespace-pre-wrap">{cleanText(selectedItem.macros)}</p>
                      </div>
                    );
                  })()}

                  {/* Handle both new strict video schema and old String format */}
                  {(() => {
                    const videoArray = selectedItem.video_recommendations || selectedItem.yt_queries || (selectedItem.yt_query ? [selectedItem.yt_query] : []);
                    
                    if (videoArray && Array.isArray(videoArray) && videoArray.length > 0) {
                      return (
                        <div className="mt-6 border-t border-purple-900/40 pt-6 flex flex-col gap-3">
                          <h4 className="text-xs font-bold text-gray-400 tracking-widest uppercase">Attached Nutritional Intel Media</h4>
                          {videoArray.map((query: string, index: number) => (
                            <a
                              key={index}
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query.replace(/\[YT:|\]/gi, '').trim())}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between px-6 py-3 bg-purple-900/20 border border-purple-500/50 rounded-xl text-purple-400 font-bold tracking-widest hover:bg-purple-900/40 hover:shadow-[0_0_20px_rgba(181,0,255,0.4)] transition-all"
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
                    <button
                      onClick={() => {
                        updateDietPlan(selectedItem);
                        setSelectedItem(null);
                      }}
                      className="w-full bg-gradient-to-r from-purple-900 to-purple-600 hover:from-purple-800 hover:to-purple-500 text-white font-black tracking-widest uppercase py-4 rounded-xl shadow-[0_0_20px_rgba(181,0,255,0.5)] transition-all flex justify-center items-center gap-2 border border-purple-400"
                    >
                      <Activity size={20} /> Update Matrix Log
                    </button>
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
              className="glass-panel w-full max-w-md bg-black/90 border border-purple-neon/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(181,0,255,0.3)] relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-neon rounded-full" />
                  Log New Ration
                </h3>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-4" onPointerDownCapture={(e) => e.stopPropagation()}>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Meal Plan Designation</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Spartan Hypertrophy Diet"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-purple-neon focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Macro Specifications</label>
                  <input
                    type="text"
                    value={macros}
                    onChange={(e) => setMacros(e.target.value)}
                    required
                    placeholder="e.g. 200g PRO, 150g CHO, 80g FAT"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-purple-neon focus:outline-none transition-colors"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-900 to-purple-600 hover:from-purple-800 hover:to-purple-500 text-white font-bold py-3 rounded-lg uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(181,0,255,0.5)] mt-4"
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
