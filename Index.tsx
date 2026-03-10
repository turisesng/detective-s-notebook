import CaseOverview from "@/components/CaseOverview";
import DeductionBoard from "@/components/DeductionBoard";
import CasesDropdown from "@/components/CasesDropdown";
import { Search, Loader2, MessageSquare } from "lucide-react"; // Changed Camera to MessageSquare
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Case as RemoteCase } from "@/lib/caseService";
import { fetchCases, fetchSuspectsByCase, fetchEvidenceByCase } from "@/lib/caseService";

const Index = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allCases, setAllCases] = useState<RemoteCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<RemoteCase | null>(null);
  const [suspects, setSuspects] = useState<any[]>([]);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(true);

  // Phase 1: Fetch the list of cases once
  useEffect(() => {
    fetchCases()
      .then((data) => {
        setAllCases(data);
        const initialCase = id 
          ? data.find(c => c.id === id) || data[0]
          : data[0];
        
        if (initialCase) {
          setSelectedCase(initialCase);
          if (!id) navigate(`/case/${initialCase.id}`, { replace: true });
        }
      })
      .finally(() => setFetchingList(false));
  }, []);

  // Phase 2: Handle URL changes
  useEffect(() => {
    if (id && allCases.length > 0) {
      const found = allCases.find(c => c.id === id);
      if (found) setSelectedCase(found);
    }
  }, [id, allCases]);

  // Phase 3: Fetch details for the selected case
  useEffect(() => {
    if (!selectedCase?.id) return;

    setLoading(true);
    Promise.all([
      fetchSuspectsByCase(selectedCase.id),
      fetchEvidenceByCase(selectedCase.id),
    ])
      .then(([sData, eData]) => {
        setSuspects(sData);
        setEvidence(eData);
      })
      .finally(() => setLoading(false));
  }, [selectedCase?.id]);

  const handleCaseSelect = (c: RemoteCase | null) => {
    if (c) navigate(`/case/${c.id}`);
  };

  if (fetchingList) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen noir-gradient-bg">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CasesDropdown 
              onSelect={handleCaseSelect} 
              selectedId={selectedCase?.id ?? null}
              cases={allCases} 
            />
            <Search className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground text-lg uppercase tracking-tighter">
              Archive Registry
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {selectedCase && (
              <button 
                // REWIRED: Navigates to the eyewitness sub-route
                onClick={() => navigate(`/case/${selectedCase.id}/witnesses`)}
                className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 rounded-md font-display font-bold uppercase text-[10px] tracking-widest transition-all shadow-lg group"
              >
                <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                Eyewitness Portal
              </button>
            )}
            <span className="evidence-stamp text-xs hidden sm:block">Level 4 Access</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground typewriter text-xs uppercase tracking-widest">Decrypting Case Files...</p>
          </div>
        ) : selectedCase ? (
          <>
            <CaseOverview remoteCase={selectedCase} />
            <div className="noir-divider" />
            <DeductionBoard 
              suspects={suspects} 
              evidence={evidence} 
              activeCase={selectedCase} 
            />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No active case selected.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;