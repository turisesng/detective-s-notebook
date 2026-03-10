import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCaseById } from '@/lib/caseService';
import { Map, Info, ArrowLeft, Camera } from 'lucide-react';

const SceneAnalysis = () => {
  const { id } = useParams(); // Get the current case ID from the URL
  const navigate = useNavigate();
  
  const { data: currentCase, isLoading } = useQuery({
    queryKey: ['case', id],
    queryFn: () => fetchCaseById(id as string),
  });

  if (isLoading) return <div className="p-20 text-center animate-pulse">Loading Scene Data...</div>;
  if (!currentCase) return <div>Case not found.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Navigation Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* UPDATED: Navigates back to the specific case ID path */}
          <button 
            onClick={() => navigate(`/case/${id}`)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Case File
          </button>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Location Intelligence</span>
            <h1 className="text-xl font-display font-bold">{currentCase.scene_location}</h1>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Primary Scene Image */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl group bg-secondary/20">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
            
            <img 
              src={currentCase.scene_image || '/placeholder-scene.jpg'} 
              alt="Crime Scene" 
              className="w-full h-auto object-cover aspect-video grayscale hover:grayscale-0 transition-all duration-700"
            />
            {/* "Update Scene Photo" logic removed from here */}

            <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
              <div className="flex items-center gap-2 text-white/80 text-xs font-mono mb-2">
                <Camera className="w-4 h-4" /> Captured: Nov 22, 1963 - 12:45 PM
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" /> Visual Reconstruction
            </h3>
            <p className="text-secondary-foreground leading-relaxed antialiased">
              {currentCase.scene_description}
            </p>
          </div>
        </div>

        {/* Right Column: Tactical Data */}
        <div className="space-y-6">
          <div className="bg-secondary/30 border border-border p-6 rounded-2xl">
            <h4 className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground mb-4">Tactical Summary</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Map className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-bold">Primary Zone</p>
                  <p className="text-xs text-muted-foreground">{currentCase.scene_location}</p>
                </div>
              </div>
              <div className="noir-divider !my-4" />
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Victim Status</p>
                <p className="text-sm font-medium">{currentCase.victim_name} (Deceased)</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Elevation Threat</p>
                <p className="text-sm font-medium">High - Multiple Window Viewpoints</p>
              </div>
            </div>
          </div>

          {/* Mini Evidence Links */}
          <div className="bg-card border border-border p-6 rounded-2xl">
            <h4 className="font-display font-semibold mb-3">Linked Evidence</h4>
            <div className="grid grid-cols-2 gap-2">
              {currentCase.evidence?.slice(0, 4).map((item: any) => (
                <div key={item.id} className="text-[10px] bg-background border border-border p-2 rounded hover:border-primary cursor-pointer transition-colors">
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SceneAnalysis;