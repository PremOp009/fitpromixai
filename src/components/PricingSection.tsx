"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingSection() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amount: number, planName: string) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to upgrade your Neural Link.");
      return;
    }

    setLoadingPlan(planName);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoadingPlan(null);
        return;
      }

      // Fetch order from API
      const result = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await result.json();

      if (!order || order.error) {
        alert("Server error. Please try again.");
        setLoadingPlan(null);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Fitpromixai",
        description: `Upgrade to ${planName}`,
        order_id: order.id,
        handler: async function (response: any) {
          // On Payment Success
          try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
              status: "premium",
              premiumPlan: planName,
            });
            alert(`Payment Successful! Welcome to ${planName}.`);
            window.location.reload();
          } catch (err) {
            console.error("Firestore Error:", err);
            alert("Payment successful but failed to update status. Contact support.");
          }
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: {
          color: planName === "Pro Pass" ? "#a855f7" : "#22d3ee",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment Failed. Please try again.");
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div 
      className="w-full py-12 bg-black/90 relative overflow-hidden"
      style={{ backgroundImage: 'radial-gradient(circle at center, rgba(34,211,238,0.05) 0%, transparent 70%)' }}
    >
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Tier 1 */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 flex flex-col">
            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Trainee Pass</h3>
            <p className="text-4xl font-black text-cyan-400 mb-4">₹20 <span className="text-sm text-gray-500 font-normal">/ 14 Days</span></p>
            <p className="text-gray-400 mb-8 flex-1 font-mono text-sm leading-relaxed">Starter AI workouts, standard diet plans, and basic progress tracking.</p>
            <button 
              onClick={() => handlePayment(20, 'Trainee Pass')}
              disabled={loadingPlan === 'Trainee Pass'}
              className="w-full py-4 mt-auto bg-white/5 border border-white/10 rounded-xl text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 backdrop-blur-md disabled:opacity-50"
            >
              {loadingPlan === 'Trainee Pass' ? 'PROCESSING...' : 'ACTIVATE PLAN'}
            </button>
          </div>

          {/* Tier 2 (Highlighted) */}
          <div className="bg-white/5 border border-purple-500 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:border-purple-400 transition-all duration-300 flex flex-col relative md:scale-105 z-10">
            {/* Subtle pulse ring behind the card */}
            <div className="absolute inset-0 bg-purple-500/5 rounded-2xl animate-pulse pointer-events-none"></div>
            
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-400 text-black px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              Pro Pass
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2 mt-2">Pro Pass</h3>
            <p className="text-4xl font-black text-purple-400 mb-4">₹30 <span className="text-sm text-gray-500 font-normal">/ 1 Month</span></p>
            <p className="text-gray-300 mb-8 flex-1 font-mono text-sm leading-relaxed">Unlimited AI generation, advanced muscle tracking, and premium diet protocols.</p>
            <button 
              onClick={() => handlePayment(30, 'Pro Pass')}
              disabled={loadingPlan === 'Pro Pass'}
              className="w-full py-4 mt-auto bg-purple-500/20 border border-purple-500 rounded-xl text-purple-400 font-bold uppercase tracking-widest hover:bg-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 backdrop-blur-md relative overflow-hidden group disabled:opacity-50"
            >
              <span className="relative z-10">{loadingPlan === 'Pro Pass' ? 'PROCESSING...' : 'ACTIVATE PLAN'}</span>
              <div className="absolute inset-0 w-0 bg-purple-500/20 group-hover:w-full transition-all duration-500 ease-out"></div>
            </button>
          </div>

          {/* Tier 3 */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 flex flex-col">
            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Cybernetic Core</h3>
            <p className="text-4xl font-black text-cyan-400 mb-4">₹150 <span className="text-sm text-gray-500 font-normal">/ 1 Year</span></p>
            <p className="text-gray-400 mb-8 flex-1 font-mono text-sm leading-relaxed">Ultimate value. VIP server speeds for instant AI generation all year round.</p>
            <button 
              onClick={() => handlePayment(150, 'Cybernetic Core')}
              disabled={loadingPlan === 'Cybernetic Core'}
              className="w-full py-4 mt-auto bg-white/5 border border-white/10 rounded-xl text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 backdrop-blur-md disabled:opacity-50"
            >
              {loadingPlan === 'Cybernetic Core' ? 'PROCESSING...' : 'ACTIVATE PLAN'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
