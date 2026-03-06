import { useState, useEffect } from "react";
import { FileText, MapPin, Calendar, Hash, UserCircle, Upload, Loader, Clock, AlertCircle, Search, User } from "lucide-react";
// Ensure these paths use the correct relative or @/ alias we discussed
import type { Case as RemoteCase, TimelineEvent } from "@/lib/caseService";
import { updateVictimImage, fetchTimelineByCase } from "@/lib/caseService";
import { uploadImage, validateImageFile } from "@/lib/imageService";

const CaseTimeline = ({ events, loading }: { events: TimelineEvent[]; loading: boolean }) => {
  const iconMap: Record<string, React.ReactNode> = {
    incident: <AlertCircle className="w-4 h-4 text-red-500" />,
    discovery: <Search className="w-4 h-4 text-primary" />,
    sighting: <User className="w-4 h-4 text-blue-400" />,
    forensic: <Clock className="w-4 h-4 text-muted-foreground" />,
  };

  if (loading) return (
    <div className="noir-card p-8 mt-8 flex justify-center">
      <Loader className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  if (events.length === 0) return null;

  return (
    <div className="noir-card p-8 mt-8 animate-fade-in">
      <h3 className="font-display text-2xl font-bold uppercase tracking-tighter mb-8 flex items-center gap-3">
        <Clock className="text-primary w-6 h-6" />
        Chronological Log
      </h3>
      
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-border before:to-transparent">
        {events.map((event) => (
          <div key={event.id} className="relative flex items-start gap-6 group">
            <div className="absolute left-0 w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center z-10 group-hover:border-primary transition-colors duration-500">
              {iconMap[event.event_type] || <Search className="w-4 h-4" />}
            </div>
            
            <div className="ml-12 pt-1">
              <time className="block mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary typewriter">
                {event.event_time}
              </time>
              <p className="text-muted-foreground font-body text-base leading-relaxed italic">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CaseOverview = ({ remoteCase, onImageUpdate }: { remoteCase: RemoteCase | null; onImageUpdate?: () => void }) => {
  const [uploadingVictim, setUploadingVictim] = useState(false);
  const [victimError, setVictimError] = useState('');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  // Fetch timeline data when the case changes
  useEffect(() => {
    const loadTimeline = async () => {
      if (!remoteCase?.id) return;
      setLoadingTimeline(true);
      try {
        const data = await fetchTimelineByCase(remoteCase.id);
        setTimelineEvents(data);
      } catch (err) {
        console.error("Failed to load timeline:", err);
      } finally {
        setLoadingTimeline(false);
      }
    };

    loadTimeline();
  }, [remoteCase?.id]);

  if (!remoteCase) {
    return (
      <div className="w-full py-20 text-center animate-pulse">
        <p className="text-muted-foreground typewriter">Waiting for Case Authorization...</p>
      </div>
    );
  }

  const handleVictimImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setVictimError(validation.error || 'Invalid file');
      return;
    }

    setUploadingVictim(true);
    setVictimError('');
    try {
      const url = await uploadImage(file, 'victims', remoteCase.id);
      await updateVictimImage(remoteCase.id, url);
      onImageUpdate?.();
    } catch (err) {
      setVictimError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingVictim(false);
    }
  };

  return (
    <section className="space-y-12 max-w-7xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <p className="evidence-stamp animate-fade-in tracking-[0.3em]">
          FILE ACCESS GRANTED: #{remoteCase.id.substring(0, 8)}
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground noir-text-glow animate-fade-in">
          {remoteCase.title}
        </h1>
        <div className="flex flex-wrap justify-center gap-8 text-muted-foreground text-base animate-fade-in">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {remoteCase.victim_tod || "Date Unknown"}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {remoteCase.scene_location || "Location Restricted"}
          </span>
          <span className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" />
            {remoteCase.year || "2026"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: VICTIM IMAGE (Placeholder fixed at min-h-550px) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="noir-card p-3">
            <div className="relative w-full min-h-[550px] h-full rounded-lg overflow-hidden border-2 border-border bg-secondary/20 group noir-glow flex items-center justify-center">
              {remoteCase.victim_image ? (
                <img 
                  src={remoteCase.victim_image} 
                  alt={remoteCase.victim_name} 
                  className="evidence-image-large w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 opacity-20">
                  <UserCircle className="w-32 h-32 text-muted-foreground" />
                  <p className="font-typewriter uppercase tracking-[0.3em] text-sm">No Image on File</p>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
                <div className="suspect-badge bg-red-950/80 text-red-200 border-red-500/50 mb-3 px-4 py-1.5">
                  Status: Deceased
                </div>
                <h3 className="font-display text-4xl font-bold text-white noir-text-glow uppercase">
                  {remoteCase.victim_name}
                </h3>
              </div>
            </div>
            
            <div className="p-6 border-t border-border/50 mt-2">
              <p className="text-primary text-xs uppercase font-bold tracking-[0.25em] mb-1">Primary Occupation</p>
              <p className="text-foreground text-xl font-medium typewriter">
                {remoteCase.victim_occupation || "Confidential"}
              </p>
            </div>
          </div>
          {victimError && <p className="text-destructive text-sm font-bold bg-destructive/10 p-3 rounded-md">{victimError}</p>}
        </div>

        {/* RIGHT COLUMN: CRIME NARRATIVE, DOSSIER & DYNAMIC TIMELINE */}
        <div className="lg:col-span-7 space-y-8">
          <div className="noir-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-primary" />
              <h3 className="font-display text-2xl font-semibold text-foreground uppercase tracking-wider">Executive Summary</h3>
            </div>
            
            <p className="text-secondary-foreground leading-relaxed font-body text-xl italic mb-10">
              "{remoteCase.summary}"
            </p>
            
            <div className="noir-divider mb-10" />
            
            <div className="space-y-4">
              <h4 className="text-sm uppercase tracking-[0.3em] text-primary font-bold">Victim Dossier: Classified</h4>
              <div className="profile-text-formatted text-muted-foreground leading-loose text-base">
                {remoteCase.victim_profile || "Analysis pending..."}
              </div>
            </div>
          </div>

          {/* DYNAMIC TIMELINE FROM SUPABASE */}
          <CaseTimeline events={timelineEvents} loading={loadingTimeline} />
        </div>

      </div>
    </section>
  );
};

export default CaseOverview;