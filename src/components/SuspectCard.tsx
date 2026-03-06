import { Suspect } from "@/lib/caseService";
import { User, Target, MessageCircle } from "lucide-react";

interface SuspectCardProps {
  suspect: Suspect;
  onClick: () => void;
  onInterrogate?: (suspect: Suspect) => void;
  isSelected: boolean;
  index: number;
}

const SuspectCard = ({ suspect, onClick, onInterrogate, isSelected, index }: SuspectCardProps) => {
  const role = suspect.role || "Unknown Role";
  // Display personality first, then background as a fallback
  const previewText = suspect.personality || suspect.background || "No profile available";
  const displayImage = suspect.image_url || suspect.image;
  
  return (
    <div
      className={`noir-card text-left transition-all duration-300 animate-fade-in ${
        isSelected ? "ring-2 ring-primary border-primary" : ""
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <button
        onClick={onClick}
        className="w-full text-left cursor-pointer group hover:opacity-80 transition-opacity"
      >
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center border border-border group-hover:border-primary/40 transition-colors overflow-hidden">
            {displayImage ? (
              <img src={displayImage} alt={suspect.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {suspect.name}
              </h3>
              {isSelected && <Target className="w-5 h-5 text-primary animate-scale-in" />}
            </div>
            <p className="text-primary/80 text-sm font-medium">{role}</p>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2 italic">"{previewText}"</p>
          </div>
        </div>
      </button>
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider typewriter">Analyze File</p>
        {onInterrogate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInterrogate(suspect);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/20 hover:bg-primary/40 text-primary transition-colors text-xs font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Question</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SuspectCard;