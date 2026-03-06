import CaseOverview from "@/components/CaseOverview";
import DeductionBoard from "@/components/DeductionBoard";
import CasesDropdown from "@/components/CasesDropdown";
import { Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { Case as RemoteCase } from "@/lib/caseService";
import { fetchCases, fetchSuspectsByCase, fetchEvidenceByCase } from "@/lib/caseService";
const Index = () => {
  const [selectedCase, setSelectedCase] = useState<RemoteCase | null>(null);
  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // 1. Initial Load: Fetch cases and auto-select the first one
  useEffect(() => {
    fetchCases()
      .then((cases) => {
        if (cases && cases.length > 0) {
          setSelectedCase(cases[0]); // Auto-select the first case from Supabase
        }
        setInitialFetchDone(true);
      })
      .catch((err) => console.error("Initial fetch failed:", err));
  }, []);

  // 2. Secondary Load: Fetch suspects/evidence when the selectedCase changes
  useEffect(() => {
    if (!selectedCase?.id) {
      setSuspects([]);
      setEvidence([]);
      return;
    }

    let mounted = true;
    setLoading(true);

    Promise.all([
      fetchSuspectsByCase(selectedCase.id),
      fetchEvidenceByCase(selectedCase.id),
    ])
      .then(([suspectsData, evidenceData]) => {
        if (mounted) {
          setSuspects(suspectsData);
          setEvidence(evidenceData);
        }
      })
      .catch((e) => {
        console.error("Error fetching case details:", e);
        if (mounted) {
          setSuspects([]);
          setEvidence([]);
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [selectedCase?.id]);

  return (
    <div className="min-h-screen noir-gradient-bg">
      {/* Top Bar */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CasesDropdown onSelect={setSelectedCase} selectedId={selectedCase?.id ?? null} />
            <Search className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground text-lg uppercase tracking-tighter">
              Archive Registry
            </span>
          </div>
          <span className="evidence-stamp text-xs hidden sm:block">Level 4 Access</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground typewriter">Decrypting Case Files...</p>
          </div>
        ) : selectedCase ? (
          <>
            <CaseOverview remoteCase={selectedCase} />
            <div className="noir-divider" />
            <DeductionBoard 
  suspects={suspects} 
  evidence={evidence} 
  activeCase={selectedCase} // Add this prop
/>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No active case selected in Archive Registry.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center bg-black/20">
        <p className="text-[10px] text-muted-foreground/50 tracking-[0.5em] uppercase">
          Classified — For Authorized Personnel Only — Aethelgard System v4.2
        </p>
      </footer>
    </div>
  );
};

export default Index;