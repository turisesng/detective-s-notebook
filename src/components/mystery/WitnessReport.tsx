import { User, MessageSquare, ShieldAlert, Fingerprint, Zap } from "lucide-react";
import { useState } from "react";
import { useTypewriter } from "@/hooks/useTypewriter";
import WitnessPulse from "./WitnessPulse";
import AudioLog from "./AudioLog";

interface WitnessProps {
  name: string;
  occupation: string;
  testimony: string;
  pressured_testimony?: string; // The secret text
  reliability: number;
  hasAudio?: boolean;
}

const WitnessReport = ({ name, occupation, testimony, pressured_testimony, reliability, hasAudio }: WitnessProps) => {
  const [isPressured, setIsPressured] = useState(false);
  const [currentReliability, setCurrentReliability] = useState(reliability);
  
  // Switch text based on pressure state
  const activeText = isPressured && pressured_testimony ? pressured_testimony : testimony;
  const animatedText = useTypewriter(activeText, 20);

  const handlePressure = () => {
    if (isPressured) return;
    setIsPressured(true);
    setCurrentReliability(Math.max(currentReliability - 25, 10)); // Stress drops reliability
  };

  return (
    <div className={`relative overflow-hidden border rounded-xl p-6 transition-all duration-500 shadow-2xl
      ${isPressured ? 'border-red-500/50 bg-red-950/10' : 'border-white/5 bg-card/40'}`}>
      
      {/* Glitch Overlay when pressured */}
      {isPressured && <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />}

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <Fingerprint className="text-primary w-6 h-6 opacity-70" />
          </div>
          <div>
            <h4 className="font-display font-black text-xl uppercase tracking-tighter text-white">
              {name}
            </h4>
            <p className="text-[10px] text-primary/60 font-mono uppercase tracking-widest italic">
              {occupation}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
            {isPressured ? "CRITICAL_STRESS" : "BIOMETRIC_STRESS"}
          </p>
          <WitnessPulse reliability={currentReliability} />
        </div>
      </div>

      {hasAudio && <AudioLog />}

      <div className="relative bg-black/30 rounded-lg p-5 border border-white/5 mb-4">
        <p className="font-body text-lg italic leading-relaxed text-slate-300">
          <span className="text-primary/40 mr-2">"</span>
          {animatedText}
          <span className="inline-block w-2 h-4 bg-primary/50 ml-1 animate-pulse" />
          <span className="text-primary/40 ml-1">"</span>
        </p>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-primary/40">
          <ShieldAlert className="w-3 h-3" />
          <span className="text-[9px] font-mono uppercase">Interrogation_Log_v4</span>
        </div>

        {pressured_testimony && !isPressured && (
          <button 
            onClick={handlePressure}
            className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/40 text-red-500 rounded text-[10px] font-mono uppercase tracking-tighter hover:bg-red-500 hover:text-white transition-all animate-bounce"
          >
            <Zap className="w-3 h-3" /> Apply Pressure
          </button>
        )}

        {isPressured && (
          <span className="text-[10px] font-mono text-red-500 uppercase animate-pulse">
            [ Witness_Breaking ]
          </span>
        )}
      </div>
    </div>
  );
};

export default WitnessReport;