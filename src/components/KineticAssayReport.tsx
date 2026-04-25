"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "@/context/AuthContext";
import { FileDown } from "lucide-react";

export interface KineticStats {
  protocols: string;
  calories: string;
  compliance: string;
  lowerBodyStatus: string;
}

export default function KineticAssayReport({ stats }: { stats?: KineticStats | null }) {
  const { user } = useAuth();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true, // This allows the logo to be rendered!
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 794,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add Page 1
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add Page 2
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = user?.displayName
        ? `${user.displayName.replace(/\s+/g, '_')}_Kinetic_Assay.pdf`
        : "Kinetic_Assay.pdf";

      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Matrix interference. Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  };

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/ /g, '-');
  const userName = user?.displayName || "PREM PATEL";

  return (
    <div className="inline-block">
      {/* Sleek Action Button - TEMPORARILY DISABLED (Emergency Rollback) */}
      {/* <button
        onClick={generatePDF}
        disabled={isGenerating}
        className="group relative flex items-center justify-center gap-3 px-6 py-3 bg-black/50 overflow-hidden rounded-xl border border-cyan-400 text-cyan-400 font-mono font-bold tracking-widest uppercase hover:bg-cyan-900/40 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] backdrop-blur-md disabled:opacity-50"
      >
        <div className="absolute inset-0 w-0 bg-cyan-400/20 group-hover:w-full transition-all duration-500 ease-out"></div>
        <FileDown size={18} className="relative z-10" />
        <span className="relative z-10">
          {isGenerating ? "GENERATING ASSAY..." : "DOWNLOAD ASSAY REPORT"}
        </span>
      </button> */}

      {/* Hidden Report UI - EXACT BRANDING MATCH */}
      <div
        className="fixed top-0 left-[-9999px] w-[794px] bg-[#ffffff] font-sans z-[-1]"
        ref={reportRef}
      >

        {/* ======================= PAGE 1 ======================= */}
        <div className="w-[794px] h-[1123px] p-16 flex flex-col bg-[#ffffff] relative">

          {/* HEADER (Logo + Custom Colors) */}
          <div className="flex items-center gap-6 mb-4">
            {/* Standard img tag is required here for html2canvas to read it properly */}
            <img src="/logo.png" alt="FitpromixAI Logo" className="w-20 h-20 object-contain" />
            <div>
              <h1 className="text-5xl font-black tracking-wide mb-2">
                <span className="text-[#0a192f]">FITPROMIX</span><span className="text-[#00d4ff]">AI</span>
              </h1>
              <h2 className="text-[13px] text-[#64748b] font-bold tracking-[0.25em] uppercase">
                CLINICAL KINETIC ASSAY // CONFIDENTIAL
              </h2>
            </div>
          </div>
          {/* CYAN DIVIDER LINE */}
          <div className="h-[3px] w-full bg-[#00d4ff] mb-10"></div>

          {/* VITALS GRID */}
          <div className="grid grid-cols-2 gap-y-8 gap-x-12 mb-12">
            <div>
              <div className="text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">SUBJECT ID</div>
              <div className="text-lg font-medium text-[#0a192f] tracking-wide">{userName.toUpperCase()} (AV-01)</div>
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">DATE OF ASSAY</div>
              <div className="text-lg font-medium text-[#0a192f] tracking-wide">{today}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">VITALS</div>
              <div className="text-lg font-medium text-[#0a192f] tracking-wide">176 cm | 76 kg</div>
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">CURRENT PROTOCOL</div>
              <div className="text-lg font-medium text-[#0a192f] tracking-wide">SHRED (WEIGHT LOSS)</div>
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">ATTENDING AI</div>
              <div className="text-lg font-medium text-[#0a192f] tracking-wide">SYS-LLAMA-3 CORE</div>
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">SYSTEM STATUS</div>
              <div className="text-lg font-medium text-[#0a192f] tracking-wide">ACTIVE</div>
            </div>
          </div>

          {/* SECTION 1: METABOLIC BIOMARKERS */}
          <div className="mb-12">
            <h3 className="text-[#8b5cf6] text-[15px] font-bold tracking-[0.15em] uppercase mb-6">1. METABOLIC BIOMARKERS</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="py-3 text-[12px] text-[#64748b] font-bold tracking-widest uppercase">ASSAY DESCRIPTION</th>
                  <th className="py-3 text-[12px] text-[#64748b] font-bold tracking-widest uppercase">RECORDED RESULT</th>
                  <th className="py-3 text-[12px] text-[#64748b] font-bold tracking-widest uppercase">REFERENCE TARGET</th>
                  <th className="py-3 text-[12px] text-[#64748b] font-bold tracking-widest uppercase">DIAGNOSTIC FLAG</th>
                </tr>
              </thead>
              <tbody className="text-[15px] text-[#0a192f]">
                <tr className="border-b border-[#f1f5f9]">
                  <td className="py-4 font-medium">Protocols Executed</td>
                  <td className="py-4">{stats?.protocols || "5 Sessions"}</td>
                  <td className="py-4 text-[#64748b]">4-6 Sessions</td>
                  <td className="py-4 font-medium">NOMINAL</td>
                </tr>
                <tr className="border-b border-[#f1f5f9]">
                  <td className="py-4 font-medium">Est. Caloric Output</td>
                  <td className="py-4">{stats?.calories || "3,450 kcal"}</td>
                  <td className="py-4 text-[#64748b]">&gt; 2,800 kcal</td>
                  <td className="py-4 font-medium">ELEVATED</td>
                </tr>
                <tr className="border-b border-[#f1f5f9]">
                  <td className="py-4 font-medium">Compliance Index</td>
                  <td className="py-4">{stats?.compliance || "83%"}</td>
                  <td className="py-4 text-[#64748b]">&gt; 80%</td>
                  <td className="py-4 font-medium">NOMINAL</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Cardio/Strain Ratio</td>
                  <td className="py-4">30/70</td>
                  <td className="py-4 text-[#64748b]">50/50 Target</td>
                  <td className="py-4 font-medium">IMBALANCE</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SECTION 2: MUSCULOSKELETAL OBSERVATIONS */}
          <div className="mb-10">
            <h3 className="text-[#8b5cf6] text-[15px] font-bold tracking-[0.15em] uppercase mb-6">2. MUSCULOSKELETAL OBSERVATIONS</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="py-3 text-[12px] text-[#64748b] font-bold tracking-widest uppercase">TARGET GROUP</th>
                  <th className="py-3 text-[12px] text-[#64748b] font-bold tracking-widest uppercase w-1/4">RECORDED VOLUME</th>
                  <th className="py-3 text-[12px] text-[#64748b] font-bold tracking-widest uppercase">OBSERVATION</th>
                </tr>
              </thead>
              <tbody className="text-[15px] text-[#0a192f]">
                <tr className="border-b border-[#f1f5f9]">
                  <td className="py-4 font-medium">Chest / Triceps</td>
                  <td className="py-4">High</td>
                  <td className="py-4 text-[#475569]">Optimal mechanical tension achieved. Recovery nominal.</td>
                </tr>
                <tr className="border-b border-[#f1f5f9]">
                  <td className="py-4 font-medium">Back / Biceps</td>
                  <td className="py-4">Moderate</td>
                  <td className="py-4 text-[#475569]">Pulling mechanics steady. Grip strength stable.</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Lower Body (Legs)</td>
                  <td className="py-4">{stats?.lowerBodyStatus || "Deficient"}</td>
                  <td className="py-4 text-[#475569]">Severe volume lack. Quadricep engagement minimal.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


        {/* ======================= PAGE 2 ======================= */}
        <div className="w-[794px] h-[1123px] p-16 flex flex-col bg-[#ffffff] relative">

          {/* SECTION 3: AI SYNTHESIS */}
          <div className="mb-12">
            <h3 className="text-[#8b5cf6] text-[15px] font-bold tracking-[0.15em] uppercase mb-6">3. AI SYNTHESIS & PRESCRIPTION</h3>
            <p className="text-[15px] text-[#0a192f] leading-loose mb-4">
              Subject <span className="font-bold">PREM</span> exhibits highly elevated kinetic output. Upper body muscle hypertrophy and fat oxidation are progressing at optimal rates.
            </p>
            <p className="text-[15px] text-[#0a192f] leading-loose mb-6">
              However, data indicates lower-body protocols have been bypassed, resulting in a Cardio/Strain imbalance.
            </p>
            <p className="text-[15px] text-[#0a192f] font-bold leading-loose p-4 bg-[#f8fafc] border-l-4 border-[#00d4ff]">
              PRESCRIPTION: Mandatory lower-body injection for the upcoming week. Increase hydration by 1.5L daily. Keep pushing.
            </p>
          </div>

          {/* SECTION 4: ZERO LIABILITY DISCLAIMER */}
          <div>
            <h3 className="text-[#8b5cf6] text-[15px] font-bold tracking-[0.15em] uppercase mb-6">
              A ZERO LIABILITY DISCLAIMER
            </h3>
            <p className="text-[#64748b] text-[12px] leading-loose text-justify">
              Fitpromixai, its creators, founders, and underlying AI systems (SYS-LLAMA-3) accept ZERO liability or responsibility for any injury, physical harm, medical emergency, or death resulting from the use of this application. This system generates automated, unverified kinetic routines using predictive modeling. WE ARE NOT MEDICAL PROFESSIONALS and this document does not constitute medical advice. By executing any routines generated by this platform, the user acknowledges they are doing so entirely at their own risk and agree to hold Fitpromixai and its creators completely harmless from any and all damages.
            </p>
          </div>

          {/* PAGE 2 FOOTER */}
          <div className="absolute bottom-16 left-16 right-16 border-t border-[#e2e8f0] pt-4 flex justify-between items-center">
            <span className="text-[#94a3b8] text-[11px] tracking-widest font-bold uppercase">GENERATED BY FITPROMIXAI MATRIX</span>
            <span className="text-[#94a3b8] text-[11px] tracking-widest font-bold uppercase">END OF ASSAY</span>
          </div>

        </div>
      </div>
    </div>
  );
}