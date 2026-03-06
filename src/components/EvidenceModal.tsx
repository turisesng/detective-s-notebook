import { Evidence } from "@/lib/caseService";
import { X, MapPin, Clock, Tag } from "lucide-react";

interface EvidenceModalProps {
  evidence: Evidence;
  onClose: () => void;
}

const categoryIcons: Record<string, string> = {
  physical: "🔍",
  digital: "💻",
  testimonial: "🗣️",
  forensic: "🧪",
};

const EvidenceModal = ({ evidence, onClose }: EvidenceModalProps) => {
  // Fallback values for missing Supabase fields
  // some records use `name` instead of `title`
  const title = evidence.title || evidence.name || `Evidence ${evidence.id?.slice(0, 8) || 'Unknown'}`;
  const category = evidence.category || 'physical';
  const collectedAt = evidence.collectedAt || evidence.discovered_at || 'Date Unknown';
  const location = evidence.location || 'Location Unknown';
  const description = evidence.description || evidence.detailedDescription || 'No additional details available.';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 noir-overlay" />
      <div
        className="relative bg-card border border-border rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-scale-in"
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
            <div className="evidence-badge mb-3">
              <span className="mr-1.5">{categoryIcons[category] || '📋'}</span>
              {category} evidence
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
          </div>

          <div className="noir-divider" />

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" /> {collectedAt}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" /> {location}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-primary" /> {category}
            </span>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-2">Detailed Analysis</h4>
            <p className="text-secondary-foreground leading-relaxed text-sm">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceModal;
