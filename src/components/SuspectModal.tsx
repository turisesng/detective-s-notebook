import { Suspect } from "@/lib/caseService";
import { X, User, Shield, Heart, Fingerprint, Lock, Target } from "lucide-react";

interface SuspectModalProps {
  suspect: Suspect | null;
  onClose: () => void;
}

const SuspectModal = ({ suspect, onClose }: SuspectModalProps) => {
  // Safety Guard: Prevents the "Black Screen" if suspect data is missing
  if (!suspect) return null;

  const role = suspect.role || "Unknown Role";
  const displayImage = suspect.image_url || suspect.image;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 noir-overlay" />
      <div
        className="relative bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Section */}
          <div className="flex gap-6 items-start">
            <div className="w-32 h-32 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center border-2 border-border overflow-hidden shadow-inner">
              {displayImage ? (
                <img 
                  src={displayImage} 
                  alt={suspect.name} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                />
              ) : (
                <User className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <div className="suspect-badge mb-2 bg-red-900/20 text-red-500 border border-red-900/30 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest inline-block">
                Classification: Suspect
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">
                {suspect.name}
              </h2>
              <p className="text-primary font-medium text-lg uppercase tracking-tighter">
                {role}
              </p>
              {suspect.personality && (
                <p className="text-muted-foreground italic text-sm mt-2">
                  "{suspect.personality}"
                </p>
              )}
            </div>
          </div>

          <div className="noir-divider h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Investigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Background */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Fingerprint className="w-4 h-4" />
                <h4 className="font-display font-semibold uppercase text-xs tracking-widest">Case Background</h4>
              </div>
              <p className="text-secondary-foreground leading-relaxed text-sm bg-secondary/30 p-3 rounded-lg border border-border/50">
                {suspect.background || "No historical data available."}
              </p>
            </div>

            {/* Motive */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-500">
                <Target className="w-4 h-4" />
                <h4 className="font-display font-semibold uppercase text-xs tracking-widest">Known Motive</h4>
              </div>
              <p className="text-secondary-foreground leading-relaxed text-sm bg-red-500/5 p-3 rounded-lg border border-red-500/20">
                {suspect.motive || "Motive currently undetermined."}
              </p>
            </div>

            {/* Alibi */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Shield className="w-4 h-4" />
                <h4 className="font-display font-semibold uppercase text-xs tracking-widest">Verified Alibi</h4>
              </div>
              <p className="text-secondary-foreground leading-relaxed text-sm bg-blue-500/5 p-3 rounded-lg border border-blue-500/20">
                {suspect.alibi || "No verified alibi on record."}
              </p>
            </div>

            {/* Secret - Intelligence Leak */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-500">
                <Lock className="w-4 h-4" />
                <h4 className="font-display font-semibold uppercase text-xs tracking-widest">Intelligence Leak</h4>
              </div>
              <p className="text-amber-200/70 leading-relaxed text-sm bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 italic">
                {suspect.secret || "No confidential data unearthed yet."}
              </p>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="pt-4 flex justify-center">
            <span className="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-[0.3em]">
              Aethelgard Labs // Security Clearance Level 4 Required
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspectModal;