"use client";

import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../lib/firebase";
import { useState } from "react";
// Import your context here if you have one!
// import { useAvatarContext } from "../context/AvatarContext"; 

export default function LoginPortal() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log("MATRIX ACCESSED BY:", user.displayName);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const trialEnds = new Date();
        trialEnds.setDate(trialEnds.getDate() + 7); // 7-day countdown

        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          status: "trial",
          trialEndsAt: trialEnds.getTime(),
          createdAt: new Date().getTime()
        });
      }
      
      // TODO: Save user.displayName and user.email to your AvatarContext here
      // setAvatarData({ name: user.displayName, email: user.email });
      
      // Redirect to the dashboard
      window.location.href = "/dashboard"; 
      
    } catch (error) {
      console.error("ACCESS DENIED:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-black/50 overflow-hidden rounded-xl border border-cyan-400 text-cyan-400 font-mono font-bold tracking-widest uppercase hover:bg-black/80 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] backdrop-blur-md min-w-[240px]"
      >
        <div className="absolute inset-0 h-full w-0 bg-cyan-400/20 group-hover:w-full transition-all duration-500 ease-out"></div>
        
        <svg className="w-6 h-6 fill-current relative z-10" viewBox="0 0 24 24">
          <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
        </svg>
        
        <span className="relative z-10">
          {isLoading ? "SYNCING..." : "LOGIN WITH GOOGLE"}
        </span>
      </button>

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-purple-900/50 overflow-hidden rounded-xl border border-purple-500 text-purple-400 font-mono font-bold tracking-widest uppercase hover:bg-purple-900/80 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] backdrop-blur-md min-w-[240px]"
      >
        <div className="absolute inset-0 h-full w-0 bg-purple-500/30 group-hover:w-full transition-all duration-500 ease-out"></div>
        
        <svg className="w-6 h-6 fill-current relative z-10" viewBox="0 0 24 24">
          <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
        </svg>
        
        <span className="relative z-10">
          {isLoading ? "SYNCING..." : "SIGNUP WITH GOOGLE"}
        </span>
      </button>
    </div>
  );
}
