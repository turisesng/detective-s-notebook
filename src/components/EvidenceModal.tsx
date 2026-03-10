import { Evidence } from "@/lib/caseService";
import { X, MapPin, Clock, Tag, Microscope } from "lucide-react"; // Added Microscope icon

interface EvidenceModalProps {
  evidence: Evidence;
  onClose: () => void;
}

const categoryIcons: Record<string, string> = {
  physical: "🔍",
  digital: "💻",
  testimonial: "🗣️",
  forensic: "🧪",
  weapon: "🔫", // Added for JJK case
  ballistics: "🎯", // Added for JJK case
};

const EvidenceModal = ({ evidence, onClose }: EvidenceModalProps) => {
  const title = evidence.title || evidence.name || `Evidence ${evidence.id?.slice(0, 8) || 'Unknown'}`;
  const category = (evidence.category || 'physical').toLowerCase();
  const collectedAt = evidence.collectedAt || evidence.discovered_at || 'Date Unknown';
  const location = evidence.location || 'Location Unknown';
  const description = evidence.detailedDescription || evidence.description || 'No additional details available.';
  
  // NEW: Capture the forensic note from your Supabase column
  const forensicNote = evidence.forensic_note;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 noir-overlay" />
      <div
        className="relative bg-card border border-border rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <div className="evidence-badge mb-3 flex items-center uppercase tracking-wider text-[10px] font-bold">
              <span className="mr-1.5">{categoryIcons[category] || '📋'}</span>
              {category} evidence
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">{title}</h2>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground/80 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" /> {collectedAt}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" /> {location}
            </span>
          </div>

          <div className="noir-divider" />

          {/* MAIN DESCRIPTION */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-2 text-sm uppercase tracking-wide">Field Report</h4>
            <p className="text-secondary-foreground leading-relaxed text-sm antialiased">{description}</p>
          </div>

          {/* NEW: FORENSIC NOTE SECTION */}
          {forensicNote && (
            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Microscope className="w-12 h-12 text-primary" />
              </div>
              <h4 className="font-display font-bold text-primary mb-2 text-xs uppercase tracking-widest flex items-center gap-2">
                <Microscope className="w-3 h-3" /> Lab Analysis & Forensic Notes
              </h4>
              <p className="text-foreground italic leading-relaxed text-sm font-serif">
                "{forensicNote}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvidenceModal;