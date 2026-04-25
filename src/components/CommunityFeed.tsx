"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Zap, Radio, Loader2 } from "lucide-react";

interface Post {
  id: string;
  content: string;
  authorName: string;
  authorId: string;
  timestamp: any;
}

export default function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to real-time updates from the matrix_feed collection
    const q = query(collection(db, "matrix_feed"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedPosts: Post[] = [];
      snapshot.forEach((doc) => {
        feedPosts.push({ id: doc.id, ...doc.data() } as Post);
      });
      setPosts(feedPosts);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleBroadcast = async () => {
    if (!content.trim() || !user) return;
    
    setIsBroadcasting(true);
    try {
      await addDoc(collection(db, "matrix_feed"), {
        content: content.trim(),
        authorName: user.displayName || "Unknown Operative",
        authorId: user.uid,
        timestamp: serverTimestamp(),
      });
      setContent(""); // Clear input on success
    } catch (error) {
      console.error("Failed to broadcast to matrix:", error);
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 pb-20">
      
      {/* 1. BROADCAST INPUT TERMINAL */}
      <div className="bg-[#0a192f]/80 backdrop-blur-xl border border-[#00d4ff]/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,212,255,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d4ff]/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <h2 className="text-[#00d4ff] font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
          <Radio size={18} className="animate-pulse" /> SHARE YOUR PROGRESS
        </h2>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's your goal today? Drop a tip or show your progress..."
          className="w-full bg-black/40 border border-[#00d4ff]/20 rounded-xl p-4 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] resize-none min-h-[120px] transition-all"
        />
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleBroadcast}
            disabled={!content.trim() || isBroadcasting}
            className="flex items-center gap-2 px-6 py-3 bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff] rounded-xl font-bold font-mono tracking-widest hover:bg-[#00d4ff]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]"
          >
            {isBroadcasting ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
            {isBroadcasting ? "POSTING..." : "POST"}
          </button>
        </div>
      </div>

      {/* 2. LIVE TELEMETRY STREAM */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[#00d4ff]/20 pb-2">
          <Radio size={20} className="text-[#00d4ff]" />
          <h3 className="text-white font-mono tracking-widest text-lg">LIVE TELEMETRY FEED</h3>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="text-[#00d4ff] animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          
          /* Empty State */
          <div className="py-16 text-center border-2 border-dashed border-[#00d4ff]/20 rounded-2xl bg-[#0a192f]/40">
            <p className="text-[#00d4ff] font-mono tracking-widest text-lg uppercase animate-pulse">
              THE MATRIX IS SILENT.
            </p>
            <p className="text-gray-400 font-mono mt-2">
              BE THE FIRST TO UPLINK.
            </p>
          </div>
        ) : (
          
          /* Render Posts */
          posts.map((post) => (
            <div key={post.id} className="bg-[#0a192f]/60 backdrop-blur-md border border-[#00d4ff]/20 p-6 rounded-2xl hover:border-[#00d4ff]/40 transition-colors shadow-lg">
              <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00d4ff] to-blue-600 flex items-center justify-center border border-[#00d4ff]/50 shadow-[0_0_10px_rgba(0,212,255,0.3)]">
                    <span className="text-black font-bold font-mono text-lg">{post.authorName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold font-mono tracking-wide">{post.authorName}</h4>
                    <p className="text-[#00d4ff] text-xs font-mono">OP_ID: {post.authorId.substring(0, 8)}</p>
                  </div>
                </div>
                <span className="text-gray-500 text-xs font-mono">
                  {post.timestamp?.toDate ? post.timestamp.toDate().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Transmitting..."}
                </span>
              </div>
              <p className="text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
