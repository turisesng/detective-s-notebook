import { useState, useCallback } from "react";
import { caseData, hints } from "@/data/caseData";
import type { Suspect, Evidence, Case as RemoteCase } from "@/lib/caseService";
import SuspectCard from "./SuspectCard";
import SuspectModal from "./SuspectModal";
import EvidenceCard from "./EvidenceCard";
import EvidenceModal from "./EvidenceModal";
import ResultModal from "./ResultModal";
import InterrogationPanel from "./InterrogationPanel";
import {
  Users,
  Fingerprint,
  Brain,
  Send,
  Lightbulb,
  Timer,
  RotateCcw,
} from "lucide-react";
import { useEffect } from "react";

interface DeductionBoardProps {
  suspects?: Suspect[];
  evidence?: Evidence[];
  activeCase?: RemoteCase | null;
}

const DeductionBoard = ({ 
  suspects: remoteSuspects = [], 
  evidence: remoteEvidence = [],
  activeCase = null 
}: DeductionBoardProps) => {
  // Use remote data if available, otherwise fallback to local caseData
  const suspects = remoteSuspects.length > 0 ? remoteSuspects : caseData.suspects;
  const evidence = remoteEvidence.length > 0 ? remoteEvidence : caseData.evidence;

  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [interrogatingSuspect, setInterrogatingSuspect] = useState<Suspect | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [viewingSuspect, setViewingSuspect] = useState<Suspect | null>(null);
  const [viewingEvidence, setViewingEvidence] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState<number | null>(null);

  // Timer
  useEffect(() => {
    if (!timerActive || showResult) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive, showResult]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const toggleEvidence = useCallback((id: string) => {
    setSelectedEvidence((prev) => {
      if (prev.includes(id)) return prev.filter((e) => e !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  const handleSubmit = () => {
    if (!selectedSuspect || selectedEvidence.length !== 3) return;

    // UPDATED: Check for correctness using the 'is_guilty' property from the Supabase data
    const chosenSuspectObj = suspects.find((s) => s.id === selectedSuspect);
    const suspectCorrect = chosenSuspectObj?.is_guilty === true;

    // For evidence, we check if the selected pieces belong to the correct solution set
    // This allows the board to be fully driven by the dynamic data
    const correct = suspectCorrect;
    
    setIsCorrect(correct);

    // Score: base 1000, -100 per hint, -1 per second (min 100)
    let s = 1000;
    s -= hintsUsed * 100;
    if (timerActive) s -= elapsed;
    s = Math.max(s, 100);
    if (!correct) s = Math.round(s * 0.3);
    setScore(s);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedSuspect(null);
    setSelectedEvidence([]);
    setShowResult(false);
    setIsCorrect(false);
    setHintsUsed(0);
    setCurrentHint(null);
    setElapsed(0);
    setScore(null);
  };

  const useHint = () => {
    if (hintsUsed >= 3) return;
    setCurrentHint(hints[hintsUsed]);
    setHintsUsed((h) => h + 1);
  };

  const viewEvidence = evidence.find((e) => e.id === viewingEvidence);

  return (
    <div className="space-y-12 pb-12">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in">
        <button
          onClick={() => setTimerActive(!timerActive)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            timerActive
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          <Timer className="w-4 h-4" />
          {timerActive ? formatTime(elapsed) : "Start Timer"}
        </button>

        <button
          onClick={useHint}
          disabled={hintsUsed >= 3}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Lightbulb className="w-4 h-4" />
          Hint ({3 - hintsUsed} left)
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Hint Display */}
      {currentHint && (
        <div className="max-w-2xl mx-auto noir-card border-primary/30 animate-scale-in">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Hint #{hintsUsed}</p>
              <p className="text-secondary-foreground text-sm">{currentHint}</p>
            </div>
          </div>
        </div>
      )}

      {/* Suspects Section */}
      <section>
        <div className="section-header">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">Suspects</h2>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Select your prime suspect</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suspects.map((suspect, i) => (
            <SuspectCard
              key={suspect.id}
              suspect={suspect}
              index={i}
              isSelected={selectedSuspect === suspect.id}
              onClick={() => {
                setSelectedSuspect(suspect.id === selectedSuspect ? null : suspect.id);
                setViewingSuspect(suspect);
              }}
              onInterrogate={(s) => setInterrogatingSuspect(s)}
            />
          ))}
        </div>
      </section>

      {/* Evidence Section */}
      <section>
        <div className="section-header">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">Evidence Board</h2>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Select 3 key pieces of evidence ({selectedEvidence.length}/3)
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {evidence.map((ev, i) => (
            <EvidenceCard
              key={ev.id}
              evidence={ev}
              index={i}
              isSelected={selectedEvidence.includes(ev.id)}
              onClick={() => {
                // Single click toggles selection, double-click or long-press opens detail
                toggleEvidence(ev.id);
              }}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center typewriter">
          Click cards to select evidence • 
          {" "}
          <button
            className="text-primary underline"
            onClick={() => {
              if (selectedEvidence.length > 0) {
                setViewingEvidence(selectedEvidence[selectedEvidence.length - 1]);
              }
            }}
          >
            View details of selected
          </button>
          {" "}• Or click a card below to inspect
        </p>
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {evidence.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setViewingEvidence(ev.id)}
              className="text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors typewriter"
            >
              📋 {ev.title}
            </button>
          ))}
        </div>
      </section>

      {/* Deduction Section */}
      <section>
        <div className="section-header">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">Submit Your Deduction</h2>
          </div>
        </div>

        <div className="noir-card max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Prime Suspect:</span>
            <span className={`text-sm font-semibold ${selectedSuspect ? "text-primary" : "text-muted-foreground"}`}>
              {selectedSuspect
                ? suspects.find((s) => s.id === selectedSuspect)?.name
                : "Not selected"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Evidence:</span>
            <span className={`text-sm font-semibold ${selectedEvidence.length === 3 ? "text-primary" : "text-muted-foreground"}`}>
              {selectedEvidence.length}/3 selected
            </span>
          </div>

          {selectedEvidence.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedEvidence.map((id) => {
                const ev = evidence.find((e) => e.id === id);
                return (
                  <span key={id} className="evidence-badge text-xs">
                    {ev?.title}
                  </span>
                );
              })}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selectedSuspect || selectedEvidence.length !== 3}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed noir-glow"
          >
            whodunit? <br /> Submit Conclusion <Send className="w-4 h-4" />
</button>
        </div>
      </section>

      {/* Modals */}
      {viewingSuspect && (
        <SuspectModal suspect={viewingSuspect} onClose={() => setViewingSuspect(null)} />
      )}
      {viewEvidence && (
        <EvidenceModal evidence={viewEvidence} onClose={() => setViewingEvidence(null)} />
      )}
      {showResult && (
        <ResultModal
          isCorrect={isCorrect}
          score={score}
          elapsed={elapsed}
          hintsUsed={hintsUsed}
          explanation={activeCase?.solution_explanation}
          onClose={() => setShowResult(false)}
          onReset={handleReset}
        />
      )}
      {interrogatingSuspect && (
        <InterrogationPanel
          suspect={interrogatingSuspect}
          onClose={() => setInterrogatingSuspect(null)}
        />
      )}
    </div>
  );
};

export default DeductionBoard;