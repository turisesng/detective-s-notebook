import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Activity, ShieldCheck, Database } from "lucide-react";
import WitnessReport from "@/components/mystery/WitnessReport";

const WitnessPortal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: witnesses, isLoading } = useQuery({
    queryKey: ['witnesses', id],
    queryFn: async () => {
      // Pulling all eyewitness data for the specific case
      const { data, error } = await supabase
        .from('eyewitnesses')
        .select('*')
        .eq('case_id', id)
        .order('reliability_score', { ascending: false }); // Sort by most reliable first
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-slate-200 p-6 selection:bg-primary/30">
      {/* Background Ambience Layer */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-primary/70 hover:text-primary transition-colors font-mono text-[10px] tracking-[0.2em]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            [ RETURN_TO_DEBRIEF ]
          </button>
          
          <div className="flex gap-4 items-center opacity-40">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono">CONNECTION_STATUS</span>
              <span className="text-[10px] text-green-500 font-mono">ENCRYPTED_LINK</span>
            </div>
            <Activity className="w-4 h-4 text-green-500 animate-pulse" />
          </div>
        </div>

        <header className="mb-16 border-l-4 border-primary pl-6">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Database className="w-4 h-4" />
            <span className="text-xs font-mono tracking-widest uppercase">Aethelgard Secure Archive</span>
          </div>
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter text-white">
            Eyewitness <span className="text-primary/80">Statements</span>
          </h1>
          <div className="flex items-center gap-6 mt-4">
            <p className="text-muted-foreground font-mono text-xs italic">
              SUBJECT_CASE: <span className="text-primary/60">{id}</span>
            </p>
            <div className="h-px w-12 bg-white/10" />
            <p className="text-muted-foreground font-mono text-xs italic">
              RECORDS_FOUND: <span className="text-primary/60">{witnesses?.length || 0}</span>
            </p>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-primary font-mono text-xs animate-pulse">DECRYPTING_WITNESS_FILES...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {witnesses?.length ? (
              witnesses.map((w) => (
                <WitnessReport 
                  key={w.id}
                  name={w.name}
                  occupation={w.occupation}
                  testimony={w.testimony}
                  reliability={w.reliability_score}
                  pressured_testimony={w.pressured_testimony} 
                hasAudio={w.has_audio}
                  // Optional: pass a redact flag if you add a 'secret' column later
                  isRedacted={w.is_secret && !w.unlocked} 
                />
              ))
            ) : (
              <div className="text-center py-32 border border-white/5 bg-white/[0.02] rounded-2xl backdrop-blur-sm">
                <ShieldCheck className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-muted-foreground font-display text-lg uppercase tracking-widest">
                  Archive Empty
                </p>
                <p className="text-white/30 font-mono text-[10px] mt-2 italic">
                  No civilian reports processed for this sector.
                </p>
              </div>
            )}
          </div>
        )}

        <footer className="mt-20 pb-10 text-center opacity-20 hover:opacity-100 transition-opacity">
          <p className="text-[9px] font-mono tracking-[0.3em] text-white">
            CONFIDENTIAL - AUTHORIZED DETECTIVE PERSONNEL ONLY
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WitnessPortal;