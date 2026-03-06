import { Evidence } from "@/lib/caseService";
import { Clock, CheckCircle2, FileSearch } from "lucide-react";

interface EvidenceCardProps {
  evidence: Evidence;
  onClick: () => void;
  isSelected: boolean;
  index: number;
}

const EvidenceCard = ({ evidence, onClick, isSelected, index }: EvidenceCardProps) => {
  // Mapping Supabase fields (handling different naming conventions)
  const title = evidence.title || evidence.name || `Evidence ${evidence.id?.slice(0, 8) || 'Unknown'}`;
  const collectedAt = evidence.collectedAt || evidence.discovered_at || 'Date Unknown';
  const description = evidence.description || evidence.detailedDescription || 'No description available';
  
  // Use the image_url from Supabase, or a fallback if it's missing
  const displayImage = evidence.image_url;

  return (
    <button
      onClick={onClick}
      className={`noir-card text-left w-full p-0 overflow-hidden transition-all duration-300 cursor-pointer group animate-fade-in ${
        isSelected ? "ring-2 ring-primary border-primary shadow-[0_0_20px_rgba(212,163,115,0.2)]" : "hover:border-primary/40"
      }`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* LARGE IMAGE PLACEHOLDER - Fixed sizing once and for all */}
      <div className="relative w-full h-48 bg-secondary/30 border-b border-border overflow-hidden">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={title} 
            className="evidence-image-large w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/10">
            <FileSearch className="w-10 h-10 text-muted-foreground/20 mb-2" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-typewriter">
              No Visual Data
            </span>
          </div>
        )}
        
        {/* Selection Indicator Overlay */}
        {isSelected && (
          <div className="absolute top-3 right-3 p-1.5 bg-primary rounded-full shadow-lg animate-scale-in">
            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* TEXT CONTENT */}
      <div className="p-4 space-y-2">
        <h4 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-tight">
          {title}
        </h4>
        
        <p className="font-body text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center gap-2 pt-1">
          <Clock className="w-3.5 h-3.5 text-primary/60" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium typewriter">
            {collectedAt}
          </span>
        </div>
      </div>
    </button>
  );
};

export default EvidenceCard;