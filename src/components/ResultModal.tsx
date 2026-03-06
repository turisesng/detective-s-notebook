import { X, CheckCircle, XCircle, RotateCcw, Trophy, BookOpen } from "lucide-react";

interface ResultModalProps {
  isCorrect: boolean;
  score: number | null;
  elapsed: number;
  hintsUsed: number;
  explanation?: string; // Prop added to receive Supabase data
  onClose: () => void;
  onReset: () => void;
}

const ResultModal = ({ 
  isCorrect, 
  score, 
  elapsed, 
  hintsUsed, 
  explanation, 
  onClose, 
  onReset 
}: ResultModalProps) => {
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

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

        <div className="p-6 sm:p-8 space-y-6">
          {/* Result Header */}
          <div className="text-center space-y-3">
            {isCorrect ? (
              <>
                <CheckCircle className="w-16 h-16 text-success mx-auto animate-bounce" />
                <h2 className="font-display text-3xl font-bold text-success">Case Solved!</h2>
                <p className="text-secondary-foreground">Excellent detective work. You've cracked the case.</p>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-accent mx-auto opacity-80" />
                <h2 className="font-display text-3xl font-bold text-accent">Case Unsolved</h2>
                <p className="text-secondary-foreground">Your deduction was incorrect. Review the findings below.</p>
              </>
            )}
          </div>

          {/* Stats Grid */}
          {score !== null && (
            <div className="grid grid-cols-3 gap-4 py-4 bg-secondary/20 rounded-lg">
              <div className="text-center border-r border-border/50">
                <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xl font-bold text-primary">{score}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</p>
              </div>
              <div className="text-center border-r border-border/50">
                <p className="text-xl font-bold text-foreground">{formatTime(elapsed)}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Time</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{hintsUsed}/3</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Hints</p>
              </div>
            </div>
          )}

          <div className="noir-divider" />

          {/* Solution - Now strictly pulling from Supabase explanation prop */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="evidence-stamp">Official Case Conclusion</span>
            </h4>
            <div className="noir-card bg-secondary/10 border-primary/20 p-4">
              <p className="text-secondary-foreground leading-relaxed text-sm font-body italic">
                {explanation || "The case file explanation is currently restricted or missing from the database."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all border border-border"
            >
              <RotateCcw className="w-4 h-4" />
              New Investigation
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Return to Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;